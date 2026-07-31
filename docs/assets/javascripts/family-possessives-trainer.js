(() => {
  const root = document.getElementById("family-possessives-trainer");
  if (!root) return;

  const data = window.GREEK_FAMILY_POSSESSIVES_DATA;
  window.GreekTrainer.createQuiz({
    root,
    datasets: Object.fromEntries(data.modes.map((mode) => [mode.key, mode.cards])),
    defaultMode: "relations",
    modeDataKey: "familyPossessivesMode",
    storageKey: data.storageKey,
    elements: {
      modeButtons: [...root.querySelectorAll("[data-family-possessives-mode]")],
      restart: root.querySelector("#family-possessives-trainer-restart"),
      lessonSelect: root.querySelector("#family-possessives-trainer-lesson-filter"),
      progress: root.querySelector("#family-possessives-trainer-progress"),
      score: root.querySelector("#family-possessives-trainer-score"),
      prompt: root.querySelector("#family-possessives-trainer-prompt"),
      context: root.querySelector("#family-possessives-trainer-context"),
      choices: root.querySelector("#family-possessives-trainer-choices"),
      unknown: root.querySelector("#family-possessives-trainer-unknown"),
      feedback: root.querySelector("#family-possessives-trainer-feedback"),
      next: root.querySelector("#family-possessives-trainer-next")
    }
  });
})();
