(() => {
  const root = document.getElementById("reading-trainer");
  if (!root) return;
  const data = window.GREEK_LESSON_02_READING_DATA;
  window.GreekTrainer.createQuiz({
    root,
    datasets: Object.fromEntries(data.modes.map((mode) => [mode.key, mode.cards])),
    defaultMode: "sounds",
    modeDataKey: "readingMode",
    storageKey: data.storageKey,
    elements: {
      modeButtons: [...root.querySelectorAll("[data-reading-mode]")],
      ...Object.fromEntries(["restart", "progress", "score", "prompt", "context", "choices", "unknown", "feedback", "next"]
        .map((key) => [key, root.querySelector(`#reading-trainer-${key}`)]))
    }
  });
})();
