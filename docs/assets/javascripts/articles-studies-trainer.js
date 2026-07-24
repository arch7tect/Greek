(() => {
  const root = document.getElementById("articles-studies-trainer");
  if (!root) return;

  const data = window.GREEK_ARTICLES_STUDIES_DATA;
  window.GreekTrainer.createQuiz({
    root,
    datasets: Object.fromEntries(data.modes.map((mode) => [mode.key, mode.cards])),
    defaultMode: "articles",
    modeDataKey: "articlesStudiesMode",
    storageKey: data.storageKey,
    elements: {
      modeButtons: [...root.querySelectorAll("[data-articles-studies-mode]")],
      restart: root.querySelector("#articles-studies-trainer-restart"),
      lessonSelect: root.querySelector("#articles-studies-trainer-lesson-filter"),
      progress: root.querySelector("#articles-studies-trainer-progress"),
      score: root.querySelector("#articles-studies-trainer-score"),
      prompt: root.querySelector("#articles-studies-trainer-prompt"),
      context: root.querySelector("#articles-studies-trainer-context"),
      choices: root.querySelector("#articles-studies-trainer-choices"),
      unknown: root.querySelector("#articles-studies-trainer-unknown"),
      feedback: root.querySelector("#articles-studies-trainer-feedback"),
      next: root.querySelector("#articles-studies-trainer-next")
    }
  });
})();
