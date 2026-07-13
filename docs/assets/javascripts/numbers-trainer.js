(() => {
  const root = document.getElementById("numbers-trainer");
  if (!root) return;

  const data = window.GREEK_NUMBERS_DATA;
  window.GreekTrainer.createQuiz({
    root,
    datasets: Object.fromEntries(data.modes.map((mode) => [mode.key, mode.cards])),
    defaultMode: "digit-to-word",
    modeDataKey: "numbersMode",
    storageKey: data.storageKey,
    elements: {
      modeButtons: [...root.querySelectorAll("[data-numbers-mode]")],
      restart: root.querySelector("#numbers-trainer-restart"),
      progress: root.querySelector("#numbers-trainer-progress"),
      score: root.querySelector("#numbers-trainer-score"),
      prompt: root.querySelector("#numbers-trainer-prompt"),
      context: root.querySelector("#numbers-trainer-context"),
      choices: root.querySelector("#numbers-trainer-choices"),
      unknown: root.querySelector("#numbers-trainer-unknown"),
      feedback: root.querySelector("#numbers-trainer-feedback"),
      next: root.querySelector("#numbers-trainer-next")
    }
  });
})();
