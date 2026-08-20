const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const setMenuState = (open) => {
  menuButton?.setAttribute("aria-expanded", String(open));
  menuButton
    ?.querySelector(".sr-only")
    ?.replaceChildren(
      document.createTextNode(open ? "Close menu" : "Open menu"),
    );
};
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  setMenuState(open);
  if (open) nav.querySelector("a")?.focus();
});
nav?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    setMenuState(false);
  }),
);
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((element) => observer.observe(element));
const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.documentElement.style.setProperty(
    "--scroll-progress",
    `${max ? (window.scrollY / max) * 100 : 0}%`,
  );
};
window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

document.querySelectorAll(".footer").forEach((footer) => {
  if (footer.querySelector(".footer-legal-links")) return;
  const links = document.createElement("span");
  links.className = "footer-legal-links";
  links.innerHTML =
    '<a href="reviews.html">Reviews</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a>';
  footer.append(links);
});

const assistantMarkup = `
  <aside class="site-assistant" aria-label="JDH Studio AI assistant">
    <div class="assistant-panel" id="assistant-panel" hidden>
      <div class="assistant-header">
        <div>
          <p class="assistant-kicker">JDH Guide</p>
          <h2>How can I help?</h2>
        </div>
        <button class="assistant-close" type="button" aria-label="Close JDH Guide">×</button>
      </div>
      <div class="assistant-messages" aria-live="polite" aria-label="Assistant messages">
        <p class="assistant-message assistant-message-bot">I can point you to the right JDH Studio service, explain the process, or help you start a conversation.</p>
      </div>
      <div class="assistant-prompts" aria-label="Suggested questions">
        <button type="button" data-assistant-question="What services do you offer?">Services</button>
        <button type="button" data-assistant-question="How does a project work?">Process</button>
        <button type="button" data-assistant-question="I want to start a project">Start a project</button>
      </div>
      <form class="assistant-form">
        <label class="sr-only" for="assistant-input">Ask JDH Guide a question</label>
        <input id="assistant-input" name="question" autocomplete="off" placeholder="Ask a question..." />
        <button type="submit" aria-label="Send question">↑</button>
      </form>
      <p class="assistant-note">A quick guide to JDH Studio, not a human representative.</p>
    </div>
    <button class="assistant-toggle" type="button" aria-expanded="false" aria-controls="assistant-panel">
      <span class="assistant-toggle-mark" aria-hidden="true">✦</span><span>Ask JDH Guide</span>
    </button>
  </aside>`;
document.body.insertAdjacentHTML("beforeend", assistantMarkup);

const assistant = document.querySelector(".site-assistant");
const assistantPanel = assistant?.querySelector(".assistant-panel");
const assistantToggle = assistant?.querySelector(".assistant-toggle");
const assistantClose = assistant?.querySelector(".assistant-close");
const assistantMessages = assistant?.querySelector(".assistant-messages");
const assistantInput = assistant?.querySelector("#assistant-input");
const assistantAnswers = [
  {
    terms: [
      "service",
      "offer",
      "build",
      "website",
      "software",
      "automation",
      "ai",
    ],
    answer:
      "JDH Studio builds business websites, provides website maintenance, creates AI automations, and develops software, backend solutions, and useful AI-powered systems.",
    link: "services.html",
    label: "Explore services",
  },
  {
    terms: ["process", "work", "start", "project", "begin", "approach"],
    answer:
      "Projects usually move through Understand, Plan, Build, Launch, and Support. The approach is shaped around the real business problem rather than a fixed package.",
    link: "contact.html",
    label: "Start a conversation",
  },
  {
    terms: ["portfolio", "case", "example", "work", "tannora"],
    answer:
      "The Work page includes a live e-commerce project, an automation system in progress, and technical directions that are becoming future case studies.",
    link: "work.html",
    label: "See selected work",
  },
  {
    terms: ["contact", "talk", "whatsapp", "email", "quote", "price", "cost"],
    answer:
      "The best next step is to describe what you want to improve, build, or untangle. You can use the contact form, email, or WhatsApp and JDH Studio can suggest a sensible starting point.",
    link: "contact.html",
    label: "Contact JDH Studio",
  },
];
const addAssistantMessage = (text, type = "bot", action) => {
  if (!assistantMessages) return;
  const message = document.createElement("p");
  message.className = `assistant-message assistant-message-${type}`;
  message.textContent = text;
  assistantMessages.append(message);
  if (action) {
    const link = document.createElement("a");
    link.className = "assistant-action";
    link.href = action.href;
    link.textContent = action.label;
    message.append(link);
  }
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
};
const answerAssistant = (question) => {
  const normalized = question.toLowerCase();
  const match = assistantAnswers.find((entry) =>
    entry.terms.some((term) => normalized.includes(term)),
  );
  if (match) {
    addAssistantMessage(match.answer, "bot", {
      href: match.link,
      label: match.label,
    });
  } else {
    addAssistantMessage(
      "I can help with services, the project process, selected work, or getting in touch. Try one of those topics, or send the team a message directly.",
      "bot",
      { href: "contact.html", label: "Contact JDH Studio" },
    );
  }
};
const setAssistantState = (open) => {
  if (!assistantPanel || !assistantToggle) return;
  assistantPanel.hidden = !open;
  assistantToggle.setAttribute("aria-expanded", String(open));
  if (open) assistantInput?.focus();
};
assistantToggle?.addEventListener("click", () =>
  setAssistantState(assistantPanel?.hidden ?? true),
);
assistantClose?.addEventListener("click", () => setAssistantState(false));
assistant?.querySelectorAll("[data-assistant-question]").forEach((button) =>
  button.addEventListener("click", () => {
    const question = button.getAttribute("data-assistant-question");
    if (!question) return;
    addAssistantMessage(question, "user");
    answerAssistant(question);
  }),
);
assistant
  ?.querySelector(".assistant-form")
  ?.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = assistantInput?.value.trim();
    if (!question) return;
    addAssistantMessage(question, "user");
    answerAssistant(question);
    assistantInput.value = "";
  });
