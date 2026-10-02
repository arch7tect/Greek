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
  const writing = root.querySelector("#vocabulary-trainer-writing");
  const input = root.querySelector("#vocabulary-trainer-input");
  const keyboard = root.querySelector("#vocabulary-trainer-keyboard");
  const check = root.querySelector("#vocabulary-trainer-check");
  const feedback = root.querySelector("#vocabulary-trainer-writing-feedback");
  const next = root.querySelector("#vocabulary-trainer-next");
  const { letters, normalize, variants, compare } = window.GreekWriting;
  const storageKey = "greek-vocabulary-progress-v3";
  const progressStore = createStore(storageKey);
  const writingStore = createStore("greek-vocabulary-writing-progress-v1");
  const day = 24 * 60 * 60 * 1000;
  const intervals = [1, 3, 7, 14, 30];
  const articlePattern = /^(ο|η|το|οι|τα)\s+/;

  const firstLesson = lessonButtons[0]?.dataset.vocabularyLesson;
  let activeLesson = new URLSearchParams(window.location.search).get("lesson") || firstLesson;
  if (!Object.hasOwn(vocabulary.lessons, activeLesson)) activeLesson = firstLesson;
  let activeScope = "core";
  const requestedDirection = new URLSearchParams(window.location.search).get("direction");
  let activeDirection = directionButtons.some((button) => button.dataset.vocabularyDirection === requestedDirection)
    ? requestedDirection : "greek-to-russian";
  let queue = [];
  let current = null;
  let shownCount = 0;
  let progressState = progressStore.get();
  let writingFirstResult = null;
  let writingResolved = false;
  const isWriting = () => activeDirection === "writing";

  letters.forEach((group) => {
    const container = document.createElement("span");
    container.className = "vocabulary-trainer__key-group";
    [...group].forEach((letter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = letter;
      button.lang = "el";
      button.addEventListener("pointerdown", (event) => event.preventDefault());
      button.addEventListener("click", () => {
        if (!current || writingResolved) return;
        input.setRangeText(letter, input.selectionStart, input.selectionEnd, "end");
        input.focus({ preventScroll: true });
      });
      container.append(button);
    });
    keyboard.append(container);
  });

  function saveProgress(rating) {
    const previous = progressState[current.id] || { level: 0, due: 0 };
    if (rating !== "know") progressState[current.id] = { level: 0, due: 0 };
    else {
      const level = Math.min(previous.level + 1, intervals.length);
      progressState[current.id] = { level, due: Date.now() + intervals[level - 1] * day };
    }
    (isWriting() ? writingStore : progressStore).set(progressState);
  }

  function acceptedAnswers() {
    // Different entries with exactly the same meaning are not distinguishable
    // from the Russian prompt; accept their attested spellings too.
    return [...new Set(vocabulary.words
      .filter((word) => normalize(word.meaning) === normalize(current.meaning))
      .flatMap((word) => variants(word.greek)))];
  }

  function showDifference(actual, expected) {
    const chars = [...normalize(actual)];
    const target = [...expected];
    let start = 0;
    while (start < chars.length && start < target.length && chars[start] === target[start]) start += 1;
    let end = target.length;
    let actualEnd = chars.length;
    while (end > start && actualEnd > start && target[end - 1] === chars[actualEnd - 1]) {
      end -= 1;
      actualEnd -= 1;
    }
    feedback.append("\nПравильно: ", target.slice(0, start).join(""));
    const mark = document.createElement("mark");
    mark.textContent = target.slice(start, end).join("") || "[убрать лишнее]";
    feedback.append(mark, target.slice(end).join(""));
  }

  function finishWriting(correct) {
    if (writingFirstResult === null) {
      writingFirstResult = correct;
      saveProgress(correct ? "know" : "again");
    }
    writingResolved = correct;
    input.readOnly = correct;
    check.hidden = correct;
    keyboard.querySelectorAll("button").forEach((button) => { button.disabled = correct; });
    next.hidden = false;
    if (correct) next.focus();
    updateProgress();
  }

  writing.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!current || !isWriting() || writingResolved) return;
    const result = compare(input.value, acceptedAnswers());
    if (result.kind === "empty") {
      feedback.textContent = "Сначала напишите ответ.";
      input.focus();
      return;
    }
    feedback.textContent = result.kind === "correct" ? "Верно!"
      : result.kind === "stress" ? "Буквы верные — проверьте ударение."
        : "Есть ошибка в написании. Сверьте выделенный участок.";
    if (result.kind !== "correct") showDifference(input.value, result.expected);
    finishWriting(result.kind === "correct");
    if (result.kind === "correct") {
      reveal.hidden = true;
      answer.textContent = formatAnswer(current);
      answer.hidden = false;
    }
  });
  next.addEventListener("click", () => {
    if (!current || !isWriting() || writingFirstResult === null) return;
    if (!writingFirstResult) queue.push(current);
    current = null;
    showCard();
  });

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
    writing.hidden = true;
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
    writing.hidden = !isWriting();
    writingFirstResult = null;
    writingResolved = false;
    input.value = "";
    input.readOnly = false;
    check.hidden = false;
    next.hidden = true;
    feedback.textContent = "";
    keyboard.querySelectorAll("button").forEach((button) => { button.disabled = false; });
    if (isWriting()) {
      promptLabel.textContent = "Напишите греческое слово или фразу";
      input.focus();
    }
    updateProgress();
  }

  function startSession() {
    progressState = (isWriting() ? writingStore : progressStore).get();
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
    if (isWriting()) {
      ratings.hidden = true;
      finishWriting(false);
      writingResolved = true;
      input.readOnly = true;
      check.hidden = true;
      keyboard.querySelectorAll("button").forEach((button) => { button.disabled = true; });
      feedback.textContent = "Ответ открыт. Слово вернётся для письменного повторения.";
      next.focus();
    }
  }

  function rate(rating) {
    if (!current || ratings.hidden) return;
    saveProgress(rating);
    if (rating === "again") {
      queue.push(current);
    }
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
    if (button.dataset.vocabularyDirection === activeDirection) setPressed(directionButtons, button);
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
