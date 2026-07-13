(() => {
  const root = document.getElementById("learning-progress");
  if (!root || !window.GreekTrainer) return;

  const { createStore, summarizeQuizProgress, summarizeVocabularyProgress } = window.GreekTrainer;

  const quizSection = (data, title, href) => {
    if (!data) return null;
    const progress = createStore(data.storageKey).get();
    const lines = data.modes.map((mode) => {
      const summary = summarizeQuizProgress(mode.cards, progress[mode.key]);
      const weak = summary.weak ? `, слабых: ${summary.weak}` : "";
      return `${mode.title} — уверенно ${summary.confident} из ${summary.total}${weak}`;
    });
    const touched = data.modes.some((mode) => {
      const summary = summarizeQuizProgress(mode.cards, progress[mode.key]);
      return summary.confident > 0 || summary.weak > 0;
    });
    return { title, href, touched, lines };
  };

  const vocabularySection = () => {
    const vocabulary = window.GREEK_VOCABULARY;
    if (!vocabulary?.words?.length) return null;
    const progress = createStore("greek-vocabulary-progress-v2").get();
    const summary = summarizeVocabularyProgress(vocabulary.words, progress, Date.now());
    const due = summary.due ? `, к повторению сейчас: ${summary.due}` : "";
    return {
      title: "Слова по урокам",
      href: "../training/vocabulary/",
      touched: summary.started > 0,
      lines: [`изучено ${summary.learned} из ${summary.total}${due}`]
    };
  };

  const sections = [
    quizSection(window.GREEK_ALPHABET_DATA, "Буквы и буквосочетания", "../training/alphabet-and-combinations/"),
    quizSection(window.GREEK_EIMAI_DATA, "είμαι [ˈime] и местоимения", "../training/eimai-and-pronouns/"),
    quizSection(window.GREEK_NUMBERS_DATA, "Числа от 0 до 10", "../training/numbers/"),
    quizSection(window.GREEK_ACCUSATIVE_DATA, "Винительный после από [aˈpo] и σε [se]", "../training/accusative-after-apo-se/"),
    quizSection(window.GREEK_GREETINGS_DATA, "Приветствия и знакомство", "../training/greetings/"),
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
    if (!section.touched) {
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
