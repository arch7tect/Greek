(() => {
  const root = document.getElementById("verbs-b1-trainer");
  if (!root) return;

  const data = window.GREEK_VERBS_B1_DATA;
  window.GreekTrainer.createQuiz({
    root,
    datasets: Object.fromEntries(data.modes.map((mode) => [mode.key, mode.cards])),
    defaultMode: "milao",
    modeDataKey: "verbsB1Mode",
    storageKey: data.storageKey,
    elements: {
      modeButtons: [...root.querySelectorAll("[data-verbs-b1-mode]")],
      restart: root.querySelector("#verbs-b1-trainer-restart"),
      lessonSelect: root.querySelector("#verbs-b1-trainer-lesson-filter"),
      progress: root.querySelector("#verbs-b1-trainer-progress"),
      score: root.querySelector("#verbs-b1-trainer-score"),
      prompt: root.querySelector("#verbs-b1-trainer-prompt"),
      context: root.querySelector("#verbs-b1-trainer-context"),
      choices: root.querySelector("#verbs-b1-trainer-choices"),
      unknown: root.querySelector("#verbs-b1-trainer-unknown"),
      feedback: root.querySelector("#verbs-b1-trainer-feedback"),
      next: root.querySelector("#verbs-b1-trainer-next")
    }
  });
})();
