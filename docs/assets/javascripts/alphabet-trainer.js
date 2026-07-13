(() => {
  const root = document.getElementById("alphabet-trainer");
  if (!root) return;

  const data = window.GREEK_ALPHABET_DATA;
  window.GreekTrainer.createQuiz({
    root,
    datasets: Object.fromEntries(data.modes.map((mode) => [mode.key, mode.cards])),
    defaultMode: "letter-to-sound",
    modeDataKey: "mode",
    storageKey: data.storageKey,
    elements: {
      modeButtons: [...root.querySelectorAll("[data-mode]")],
      restart: root.querySelector("#alphabet-trainer-restart"),
      progress: root.querySelector("#alphabet-trainer-progress"),
      score: root.querySelector("#alphabet-trainer-score"),
      prompt: root.querySelector("#alphabet-trainer-prompt"),
      context: root.querySelector("#alphabet-trainer-context"),
      choices: root.querySelector("#alphabet-trainer-choices"),
      unknown: root.querySelector("#alphabet-trainer-unknown"),
      feedback: root.querySelector("#alphabet-trainer-feedback"),
      next: root.querySelector("#alphabet-trainer-next")
    }
  });
})();
