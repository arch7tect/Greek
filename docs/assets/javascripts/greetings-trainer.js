(() => {
  const root = document.getElementById("greetings-trainer");
  if (!root) return;

  const data = window.GREEK_GREETINGS_DATA;
  window.GreekTrainer.createQuiz({
    root,
    datasets: Object.fromEntries(data.modes.map((mode) => [mode.key, mode.cards])),
    defaultMode: "greet",
    modeDataKey: "greetingsMode",
    storageKey: data.storageKey,
    elements: {
      modeButtons: [...root.querySelectorAll("[data-greetings-mode]")],
      restart: root.querySelector("#greetings-trainer-restart"),
      lessonSelect: root.querySelector("#greetings-trainer-lesson-filter"),
      progress: root.querySelector("#greetings-trainer-progress"),
      score: root.querySelector("#greetings-trainer-score"),
      prompt: root.querySelector("#greetings-trainer-prompt"),
      context: root.querySelector("#greetings-trainer-context"),
      choices: root.querySelector("#greetings-trainer-choices"),
      unknown: root.querySelector("#greetings-trainer-unknown"),
      feedback: root.querySelector("#greetings-trainer-feedback"),
      next: root.querySelector("#greetings-trainer-next")
    }
  });
})();
