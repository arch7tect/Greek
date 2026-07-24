(() => {
  const root = document.getElementById("registration-trainer");
  if (!root) return;

  const data = window.GREEK_REGISTRATION_DATA;
  window.GreekTrainer.createQuiz({
    root,
    datasets: Object.fromEntries(data.modes.map((mode) => [mode.key, mode.cards])),
    defaultMode: "ask",
    modeDataKey: "registrationMode",
    storageKey: data.storageKey,
    elements: {
      modeButtons: [...root.querySelectorAll("[data-registration-mode]")],
      restart: root.querySelector("#registration-trainer-restart"),
      lessonSelect: root.querySelector("#registration-trainer-lesson-filter"),
      progress: root.querySelector("#registration-trainer-progress"),
      score: root.querySelector("#registration-trainer-score"),
      prompt: root.querySelector("#registration-trainer-prompt"),
      context: root.querySelector("#registration-trainer-context"),
      choices: root.querySelector("#registration-trainer-choices"),
      unknown: root.querySelector("#registration-trainer-unknown"),
      feedback: root.querySelector("#registration-trainer-feedback"),
      next: root.querySelector("#registration-trainer-next")
    }
  });
})();
