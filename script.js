const questions = [...document.querySelectorAll(".question")];
const form = document.querySelector("#lead-form");
const nextButton = document.querySelector("#next-button");
const backButton = document.querySelector("#back-button");
const progressBar = document.querySelector("#progress-bar");
const stepLabel = document.querySelector("#step-label");
const progressValue = document.querySelector("#progress-value");
const result = document.querySelector("#result");
const assistantCard = document.querySelector(".assistant-card");
let currentStep = 0;
const answers = {};
const updateStep = () => {
  if (!form) return;
  questions.forEach((question, index) =>
    question.classList.toggle("active", index === currentStep),
  );
  const percent = Math.round(((currentStep + 1) / questions.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressValue.textContent = `${percent}%`;
  stepLabel.textContent = `Question ${String(currentStep + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  backButton.hidden = currentStep === 0;
  nextButton.textContent =
    currentStep === questions.length - 1 ? "See my next step →" : "Continue →";
};
const selected = () =>
  form.querySelector(`.question[data-step="${currentStep}"] input:checked`);
if (nextButton) nextButton.addEventListener("click", () => {
  const choice = selected();
  if (!choice) {
    questions[currentStep].animate(
      [
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 180 },
    );
    return;
  }
  answers[choice.name] = choice.value;
  if (currentStep < questions.length - 1) {
    currentStep += 1;
    updateStep();
  } else showResult();
});
if (backButton) backButton.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep -= 1;
    updateStep();
  }
});
const serviceFor = {
  website: {
    title: "A clearer digital front door.",
    copy: "A focused website can make your offer easier to understand, trust, and act on.",
    action: "website",
  },
  automation: {
    title: "Less manual work, more momentum.",
    copy: "An automation can connect the repetitive steps that are slowing the business down.",
    action: "automation",
  },
  software: {
    title: "A system shaped around the real work.",
    copy: "A custom software or backend project can bring the logic behind the process into one useful place.",
    action: "software",
  },
  unsure: {
    title: "Start with the problem, not the package.",
    copy: "The most useful next step is a conversation that gets close to what is actually happening.",
    action: "conversation",
  },
};
const stageLabels = {
  idea: "Just exploring",
  ready: "Ready to plan",
  improve: "Improving something existing",
};
const showResult = () => {
  const service = serviceFor[answers.need] || serviceFor.unsure;
  const next =
    answers.next === "form"
      ? "Continue through a project enquiry"
      : "Start a conversation on WhatsApp";
  document.querySelector("#result-title").textContent = service.title;
  document.querySelector("#result-copy").textContent = service.copy;
  document.querySelector("#result-summary").innerHTML =
    `<div><span>Direction</span> ${service.action}</div><div><span>Stage</span> ${stageLabels[answers.stage] || "To be discovered"}</div><div><span>Next</span> ${next}</div>`;
  const message = encodeURIComponent(
    `Hi JDH Studio, I used the LeadFlow assistant. I am interested in ${service.action}. I am currently ${stageLabels[answers.stage]?.toLowerCase() || "exploring the need"} and would like to discuss the next step.`,
  );
  const action = document.querySelector("#result-action");
  if (answers.next === "form") {
    action.href = "https://jdhstudio.co/contact.html";
    action.innerHTML = "Continue to enquiry <span>↗</span>";
  } else {
    action.href = `https://wa.me/2348158535742?text=${message}`;
    action.target = "_blank";
    action.rel = "noopener";
    action.innerHTML = "Open WhatsApp <span>↗</span>";
  }
  form.hidden = true;
  result.hidden = false;
  assistantCard.scrollIntoView({ behavior: "smooth", block: "center" });
};
const restartButton = document.querySelector("#restart-button");
if (restartButton) restartButton.addEventListener("click", () => {
  Object.keys(answers).forEach((key) => delete answers[key]);
  currentStep = 0;
  form.reset();
  form.hidden = false;
  result.hidden = true;
  updateStep();
});
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((element) => observer.observe(element));

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = `Project enquiry from ${data.get("name")}`;
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nProject: ${data.get("service")}\n\n${data.get("message")}`;
    window.location.href = `mailto:jdhstudio.co@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const note = document.querySelector("#form-note");
    note.hidden = false;
    note.textContent = "Your email app should open with the enquiry ready to send.";
  });
}
updateStep();
