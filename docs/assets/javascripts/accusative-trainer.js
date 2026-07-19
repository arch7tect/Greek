(() => {
  const root = document.getElementById("accusative-trainer");
  if (!root) return;

  const data = window.GREEK_ACCUSATIVE_DATA;
  window.GreekTrainer.createQuiz({
    root,
    datasets: Object.fromEntries(data.modes.map((mode) => [mode.key, mode.cards])),
    defaultMode: "apo",
    modeDataKey: "accusativeMode",
    storageKey: data.storageKey,
    elements: {
      modeButtons: [...root.querySelectorAll("[data-accusative-mode]")],
      restart: root.querySelector("#accusative-trainer-restart"),
      lessonSelect: root.querySelector("#accusative-trainer-lesson-filter"),
      progress: root.querySelector("#accusative-trainer-progress"),
      score: root.querySelector("#accusative-trainer-score"),
      prompt: root.querySelector("#accusative-trainer-prompt"),
      context: root.querySelector("#accusative-trainer-context"),
      choices: root.querySelector("#accusative-trainer-choices"),
      unknown: root.querySelector("#accusative-trainer-unknown"),
      feedback: root.querySelector("#accusative-trainer-feedback"),
      next: root.querySelector("#accusative-trainer-next")
    }
  });
})();
