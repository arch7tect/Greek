(() => {
  const root = document.getElementById("verbs-a-trainer");
  if (!root) return;

  const data = window.GREEK_VERBS_A_DATA;
  window.GreekTrainer.createQuiz({
    root,
    datasets: Object.fromEntries(data.modes.map((mode) => [mode.key, mode.cards])),
    defaultMode: "endings",
    modeDataKey: "verbsAMode",
    storageKey: data.storageKey,
    elements: {
      modeButtons: [...root.querySelectorAll("[data-verbs-a-mode]")],
      restart: root.querySelector("#verbs-a-trainer-restart"),
      lessonSelect: root.querySelector("#verbs-a-trainer-lesson-filter"),
      progress: root.querySelector("#verbs-a-trainer-progress"),
      score: root.querySelector("#verbs-a-trainer-score"),
      prompt: root.querySelector("#verbs-a-trainer-prompt"),
      context: root.querySelector("#verbs-a-trainer-context"),
      choices: root.querySelector("#verbs-a-trainer-choices"),
      unknown: root.querySelector("#verbs-a-trainer-unknown"),
      feedback: root.querySelector("#verbs-a-trainer-feedback"),
      next: root.querySelector("#verbs-a-trainer-next")
    }
  });
})();
