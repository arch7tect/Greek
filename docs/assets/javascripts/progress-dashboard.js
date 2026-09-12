(() => {
  const root = document.getElementById("learning-progress");
  if (!root || !window.GreekTrainer) return;

  const {
    createStore,
    summarizeQuizProgress,
    summarizeVocabularyProgress,
    filterByLesson,
    getLessonLimit
  } = window.GreekTrainer;
  const lessonLimit = getLessonLimit();

  const quizSection = (data, title, href, limit = lessonLimit) => {
    if (!data) return null;
    const progress = createStore(data.storageKey).get();
    const modes = data.modes
      .map((mode) => ({ mode, cards: filterByLesson(mode.cards, limit) }))
      .filter(({ cards }) => cards.length > 0);
    if (!modes.length) {
      return { title, href, touched: false, lines: [], later: true };
    }
    const lines = modes.map(({ mode, cards }) => {
      const summary = summarizeQuizProgress(cards, progress[mode.key]);
      const weak = summary.weak ? `, слабых: ${summary.weak}` : "";
      return `${mode.title} — уверенно ${summary.confident} из ${summary.total}${weak}`;
    });
    const touched = modes.some(({ mode, cards }) => {
      const summary = summarizeQuizProgress(cards, progress[mode.key]);
      return summary.confident > 0 || summary.weak > 0;
    });
    return { title, href, touched, lines };
  };

  const vocabularySection = () => {
    const vocabulary = window.GREEK_VOCABULARY;
    if (!vocabulary?.words?.length) return null;
    const progress = createStore("greek-vocabulary-progress-v3").get();
    const words = vocabulary.words.filter((word) => (
      word.core && (lessonLimit === "all" || word.lesson <= lessonLimit)
    ));
    const summary = summarizeVocabularyProgress(words, progress, Date.now());
    const due = summary.due ? `, к повторению сейчас: ${summary.due}` : "";
    return {
      title: "Слова по урокам",
      href: "../training/vocabulary/",
      touched: summary.started > 0,
      lines: [`основных слов изучено ${summary.learned} из ${summary.total}${due}`]
    };
  };

  const sections = [
    quizSection(window.GREEK_LESSON_02_READING_DATA, "Чтение и ударение урока 02", "../training/lesson-02-reading/", "all"),
    quizSection(window.GREEK_ALPHABET_DATA, "Буквы и буквосочетания", "../training/alphabet-and-combinations/"),
    quizSection(window.GREEK_EIMAI_DATA, "είμαι [ˈime] и местоимения", "../training/eimai-and-pronouns/"),
    quizSection(window.GREEK_NUMBERS_DATA, "Числа", "../training/numbers/"),
    quizSection(window.GREEK_REGISTRATION_DATA, "Анкета и секретариат", "../training/registration-and-form/"),
    quizSection(window.GREEK_ACCUSATIVE_DATA, "Предлоги и винительный", "../training/accusative-after-apo-se/"),
    quizSection(window.GREEK_GREETINGS_DATA, "Приветствия и знакомство", "../training/greetings/"),
    quizSection(window.GREEK_VERBS_A_DATA, "Первое спряжение", "../training/present-tense-a/"),
    quizSection(window.GREEK_ARTICLES_STUDIES_DATA, "Артикли и разговор об учёбе", "../training/articles-and-studies/"),
    quizSection(window.GREEK_VERBS_B1_DATA, "Глаголы типа Β1", "../training/present-tense-b1/"),
    quizSection(window.GREEK_FAMILY_POSSESSIVES_DATA, "Семья и формы принадлежности", "../training/family-and-possessives/"),
    vocabularySection()
  ].filter(Boolean);
  if (!sections.length) return;

  const list = document.createElement("ul");
  sections.forEach((section) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = section.href;
    link.textContent = section.title;
    item.append(link);
    if (section.later) {
      item.append(" — материал позже выбранного урока.");
    } else if (!section.touched) {
      item.append(" — ещё нет результатов.");
    } else if (section.lines.length === 1) {
      item.append(` — ${section.lines[0]}.`);
    } else {
      const detail = document.createElement("ul");
      section.lines.forEach((line) => {
        const row = document.createElement("li");
        row.textContent = line;
        detail.append(row);
      });
      item.append(detail);
    }
    list.append(item);
  });
  root.replaceChildren(list);
})();
