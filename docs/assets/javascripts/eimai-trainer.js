(() => {
  const root = document.getElementById("eimai-trainer");
  if (!root) return;

  const data = window.GREEK_EIMAI_DATA;
  window.GreekTrainer.createQuiz({
    root,
    datasets: Object.fromEntries(data.modes.map((mode) => [mode.key, mode.cards])),
    defaultMode: "pronoun-to-form",
    modeDataKey: "eimaiMode",
    detailSeparator: "\n",
    storageKey: data.storageKey,
    elements: {
      modeButtons: [...root.querySelectorAll("[data-eimai-mode]")],
      restart: root.querySelector("#eimai-trainer-restart"),
      progress: root.querySelector("#eimai-trainer-progress"),
      score: root.querySelector("#eimai-trainer-score"),
      prompt: root.querySelector("#eimai-trainer-prompt"),
      context: root.querySelector("#eimai-trainer-context"),
      choices: root.querySelector("#eimai-trainer-choices"),
      unknown: root.querySelector("#eimai-trainer-unknown"),
      feedback: root.querySelector("#eimai-trainer-feedback"),
      next: root.querySelector("#eimai-trainer-next")
    }
  });
})();
