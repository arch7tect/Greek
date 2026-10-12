(() => {
  function belongsToSet(word, lesson, coverage, topics = {}) {
    const topic = topics[lesson];
    if (topic) return topic.ids.includes(word.id);
    if (coverage === "new") return word.lesson === lesson;
    return (word.lessons || [word.lesson]).includes(lesson);
  }

  function originLabel(word, lesson, topics = {}) {
    if (topics[lesson]) return `Впервые: урок ${word.lesson}`;
    return word.lesson === lesson
      ? `Новое слово урока ${lesson}`
      : `Повторение из урока ${word.lesson} · Урок ${lesson}`;
  }

  window.GreekVocabularySelection = { belongsToSet, originLabel };
})();
