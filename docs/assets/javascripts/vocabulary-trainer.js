(() => {
  const root = document.getElementById("vocabulary-trainer");
  if (!root) return;

  const vocabulary = window.GREEK_VOCABULARY;
  const { createStore, shuffle } = window.GreekTrainer;
  if (!vocabulary?.words?.length) {
    root.textContent = "Не удалось загрузить словарь тренажёра.";
    return;
  }

  const lessonContainer = root.querySelector("#vocabulary-trainer-lessons");
  const lessonButtons = Object.keys(vocabulary.lessons).sort().map((lesson) => {
    const button = document.createElement("button");
    const count = document.createElement("span");
    button.type = "button";
    button.dataset.vocabularyLesson = lesson;
    button.setAttribute("aria-pressed", "false");
    button.append(`Урок ${lesson} `);
    count.dataset.vocabularyCount = lesson;
    button.append(count);
    lessonContainer.append(button);
    return button;
  });
  const scopeButtons = [...root.querySelectorAll("[data-vocabulary-scope]")];
  const directionButtons = [...root.querySelectorAll("[data-vocabulary-direction]")];
  const ratingButtons = [...root.querySelectorAll("[data-vocabulary-rating]")];
  const restart = root.querySelector("#vocabulary-trainer-restart");
  const progressText = root.querySelector("#vocabulary-trainer-progress");
  const learnedText = root.querySelector("#vocabulary-trainer-learned");
  const promptLabel = root.querySelector("#vocabulary-trainer-prompt-label");
  const prompt = root.querySelector("#vocabulary-trainer-prompt");
  const context = root.querySelector("#vocabulary-trainer-context");
  const hint = root.querySelector("#vocabulary-trainer-hint");
  const hintText = root.querySelector("#vocabulary-trainer-hint-text");
  const reveal = root.querySelector("#vocabulary-trainer-reveal");
  const answer = root.querySelector("#vocabulary-trainer-answer");
  const ratings = root.querySelector("#vocabulary-trainer-ratings");
  const storageKey = "greek-vocabulary-progress-v2";
  const progressStore = createStore(storageKey);
  const day = 24 * 60 * 60 * 1000;
  const intervals = [1, 3, 7, 14, 30];
  const articlePattern = /^(ο|η|το|οι|τα)\s+/;

  const firstLesson = lessonButtons[0]?.dataset.vocabularyLesson;
  let activeLesson = new URLSearchParams(window.location.search).get("lesson") || firstLesson;
  if (!Object.hasOwn(vocabulary.lessons, activeLesson)) activeLesson = firstLesson;
  let activeScope = "core";
  let activeDirection = "greek-to-russian";
  let queue = [];
  let current = null;
  let shownCount = 0;
  let progressState = progressStore.get();

  function selectedWords() {
    return vocabulary.words.filter((word) => (
      word.lesson === activeLesson
      && (activeScope === "all" || word.core)
      && (activeDirection !== "article" || articlePattern.test(word.greek))
    ));
  }

  function setPressed(buttons, active) {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button === active));
    });
  }

  function updateCounts() {
    Object.entries(vocabulary.lessons).forEach(([lesson, counts]) => {
      const target = root.querySelector(`[data-vocabulary-count="${lesson}"]`);
      if (!target) return;
      const count = activeScope === "core" ? counts.core : counts.total;
      target.textContent = `(${count})`;
    });
  }

  function updateProgress() {
    const words = selectedWords();
    const learned = words.filter((word) => (progressState[word.id]?.level || 0) >= 1).length;
    const remaining = queue.length + (current ? 1 : 0);
    progressText.textContent = current ? `Осталось в сессии: ${remaining}` : `Набор: ${words.length} слов`;
    learnedText.textContent = `Изучено: ${learned} из ${words.length}`;
  }

  function makeSession() {
    const now = Date.now();
    const words = selectedWords();
    const due = shuffle(words.filter((word) => progressState[word.id] && progressState[word.id].due <= now));
    const unseen = shuffle(words.filter((word) => !progressState[word.id]));
    const unique = [];
    const seen = new Set();
    [...due, ...unseen].forEach((word) => {
      if (!seen.has(word.id)) {
        seen.add(word.id);
        unique.push(word);
      }
    });
    return unique.slice(0, 10);
  }

  function formatAnswer(word) {
    if (activeDirection === "greek-to-russian") {
      return `${word.meaning}\n${word.greek} ${word.transcription}\n${word.note}`;
    }
    return `${word.greek}\n${word.transcription}\n${word.meaning}\n${word.note}`;
  }

  function articlePrompt(word) {
    return word.greek.replace(articlePattern, "___ ");
  }

  function finish() {
    current = null;
    promptLabel.textContent = shownCount ? "Сессия завершена" : "На сегодня всё";
    prompt.textContent = shownCount ? `Показано карточек: ${shownCount}` : "Нет карточек к повторению";
    context.textContent = shownCount
      ? "Карточки со сроком в будущем вернутся позднее."
      : "Выберите другой урок или вернитесь после следующего срока повторения.";
    hint.hidden = true;
    hintText.textContent = "";
    reveal.hidden = true;
    answer.hidden = true;
    ratings.hidden = true;
    updateProgress();
  }

  function showCard() {
    if (!queue.length) {
      finish();
      return;
    }
    current = queue.shift();
    shownCount += 1;
    const greekFirst = activeDirection === "greek-to-russian";
    if (activeDirection === "article") {
      promptLabel.textContent = "Вспомните артикль";
      prompt.textContent = articlePrompt(current);
      context.textContent = `${current.meaning} · Урок ${current.lesson}`;
    } else {
      promptLabel.textContent = greekFirst ? "Вспомните значение" : "Вспомните греческое слово";
      prompt.textContent = greekFirst ? current.greek : current.meaning;
      context.textContent = `Урок ${current.lesson}`;
    }
    hint.hidden = !greekFirst;
    hintText.textContent = "";
    reveal.hidden = false;
    answer.textContent = "";
    answer.hidden = true;
    ratings.hidden = true;
    updateProgress();
  }

  function startSession() {
    queue = makeSession();
    shownCount = 0;
    current = null;
    updateCounts();
    showCard();
  }

  function revealAnswer() {
    if (!current) return;
    hint.hidden = true;
    reveal.hidden = true;
    answer.textContent = formatAnswer(current);
    answer.hidden = false;
    ratings.hidden = false;
  }

  function rate(rating) {
    if (!current || ratings.hidden) return;
    const previous = progressState[current.id] || { level: 0, due: 0 };
    if (rating === "again") {
      progressState[current.id] = { level: 0, due: 0 };
      queue.push(current);
    } else if (rating === "unsure") {
      progressState[current.id] = { level: 0, due: 0 };
    } else {
      const level = Math.min(previous.level + 1, intervals.length);
      progressState[current.id] = { level, due: Date.now() + intervals[level - 1] * day };
    }
    progressStore.set(progressState);
    current = null;
    showCard();
  }

  lessonButtons.forEach((button) => {
    if (button.dataset.vocabularyLesson === activeLesson) setPressed(lessonButtons, button);
    button.addEventListener("click", () => {
      activeLesson = button.dataset.vocabularyLesson;
      setPressed(lessonButtons, button);
      startSession();
    });
  });
  scopeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeScope = button.dataset.vocabularyScope;
      setPressed(scopeButtons, button);
      startSession();
    });
  });
  directionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeDirection = button.dataset.vocabularyDirection;
      setPressed(directionButtons, button);
      startSession();
    });
  });
  ratingButtons.forEach((button) => {
    button.addEventListener("click", () => rate(button.dataset.vocabularyRating));
  });
  restart.addEventListener("click", startSession);
  hint.addEventListener("click", () => {
    if (!current) return;
    hintText.textContent = current.transcription;
    hint.hidden = true;
  });
  reveal.addEventListener("click", revealAnswer);
  document.addEventListener("keydown", (event) => {
    if (!root.isConnected) return;
    if (["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName) || event.target.isContentEditable) return;
    if (!ratings.hidden && /^[1-3]$/.test(event.key)) {
      event.preventDefault();
      rate(["again", "unsure", "know"][Number(event.key) - 1]);
      return;
    }
    if (event.target.tagName === "BUTTON") return;
    if (event.code === "Space" && !reveal.hidden) {
      event.preventDefault();
      revealAnswer();
    }
  });

  updateCounts();
  startSession();
})();
