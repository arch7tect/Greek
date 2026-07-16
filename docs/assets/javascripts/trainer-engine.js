(() => {
  const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

  const shuffle = (items, random = Math.random) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  };

  const createStore = (key, storageOverride) => {
    let storage = storageOverride;
    if (storage === undefined) {
      try {
        storage = globalThis.localStorage;
      } catch {
        storage = null;
      }
    }

    let state = {};
    try {
      const parsed = JSON.parse(storage?.getItem(key) || "{}");
      if (isRecord(parsed)) state = parsed;
    } catch {
      state = {};
    }

    return {
      get: () => state,
      set: (nextState) => {
        state = isRecord(nextState) ? nextState : {};
        try {
          storage?.setItem(key, JSON.stringify(state));
        } catch {
          // Keep the in-memory state when browser storage is unavailable.
        }
      }
    };
  };

  const normalizeCardProgress = (progress) => ({
    errors: Number.isInteger(progress?.errors) && progress.errors > 0 ? progress.errors : 0,
    streak: Number.isInteger(progress?.streak) && progress.streak > 0 ? progress.streak : 0
  });

  const updateCardProgress = (progress, isCorrect) => {
    const current = normalizeCardProgress(progress);
    if (!isCorrect) return { errors: current.errors + 1, streak: 0 };
    const streak = current.streak + 1;
    return { errors: streak >= 2 ? 0 : current.errors, streak };
  };

  const weakCards = (cards, progress) => cards.filter((card) => (
    normalizeCardProgress(progress?.[card.id]).errors > 0
  ));

  const orderCards = (cards, progress, random = Math.random) => {
    const weakIds = new Set(weakCards(cards, progress).map((card) => card.id));
    const weak = cards.filter((card) => weakIds.has(card.id));
    const other = cards.filter((card) => !weakIds.has(card.id));
    return [...shuffle(weak, random), ...shuffle(other, random)];
  };

  const countWeakCards = (cards, progress) => weakCards(cards, progress).length;

  const buildChoices = (card, modeValues, random = Math.random) => {
    const pool = card.choices || modeValues;
    const distractors = shuffle(
      pool.filter((value) => value !== card.answer),
      random
    ).slice(0, 3);
    return shuffle([card.answer, ...distractors], random);
  };

  const summarizeQuizProgress = (cards, progress) => {
    let confident = 0;
    let weak = 0;
    cards.forEach((card) => {
      const current = normalizeCardProgress(progress?.[card.id]);
      if (current.errors > 0) weak += 1;
      else if (current.streak > 0) confident += 1;
    });
    return { total: cards.length, confident, weak };
  };

  const summarizeVocabularyProgress = (words, progress, now) => {
    let started = 0;
    let learned = 0;
    let due = 0;
    words.forEach((word) => {
      const entry = progress?.[word.id];
      if (!isRecord(entry)) return;
      started += 1;
      if (Number.isInteger(entry.level) && entry.level >= 1) learned += 1;
      if (typeof entry.due === "number" && entry.due <= now) due += 1;
    });
    return { total: words.length, started, learned, due };
  };

  const validateDatasets = (datasets) => {
    Object.entries(datasets).forEach(([mode, cards]) => {
      const ids = new Set();
      cards.forEach((card) => {
        if (!card.id || ids.has(card.id)) {
          throw new Error(`Missing or duplicate card id in mode ${mode}: ${card.id || "(empty)"}`);
        }
        ids.add(card.id);
      });
    });
  };

  const createQuiz = ({
    root,
    datasets,
    defaultMode,
    modeDataKey,
    elements,
    detailSeparator = " ",
    storageKey = null
  }) => {
    validateDatasets(datasets);
    const {
      modeButtons,
      restart,
      progress,
      score,
      prompt,
      context,
      choices,
      unknown,
      feedback,
      next
    } = elements;
    const store = storageKey ? createStore(storageKey) : null;
    let progressState = store?.get() || {};
    let queue = [];
    let activeMode = defaultMode;
    let current = null;
    let answered = false;
    let attempts = 0;
    let correct = 0;
    let initialCount = 0;

    const modeProgress = () => (
      isRecord(progressState[activeMode]) ? progressState[activeMode] : {}
    );

    const choiceValues = () => [...new Set(datasets[activeMode].map((item) => item.answer))];

    const updateStatus = () => {
      const currentCard = current && !answered ? 1 : 0;
      progress.textContent = `Осталось карточек: ${queue.length + currentCard}`;
      score.textContent = `Верно: ${correct} из ${attempts}`;
    };

    const finish = () => {
      current = null;
      prompt.textContent = "Сессия завершена";
      context.textContent = "";
      choices.replaceChildren();
      unknown.hidden = true;
      next.hidden = true;
      const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
      const weakCount = countWeakCards(datasets[activeMode], modeProgress());
      const weakSummary = weakCount
        ? ` Слабых карточек: ${weakCount} — в следующей сессии они будут в начале.`
        : "";
      feedback.textContent = (
        `Пройдено карточек: ${initialCount}. Точность ответов: ${accuracy}%.${weakSummary}`
      );
      updateStatus();
    };

    const saveAnswerProgress = (isCorrect) => {
      if (!store) return;
      const currentMode = modeProgress();
      currentMode[current.id] = updateCardProgress(currentMode[current.id], isCorrect);
      progressState[activeMode] = currentMode;
      store.set(progressState);
    };

    const answer = (value) => {
      if (answered || !current) return;
      answered = true;
      attempts += 1;
      const isCorrect = value === current.answer;
      saveAnswerProgress(isCorrect);
      if (isCorrect) {
        correct += 1;
        feedback.textContent = `Верно.${detailSeparator}${current.detail}`;
      } else {
        queue.push(current);
        feedback.textContent = `Правильный ответ: ${current.answer}.${detailSeparator}${current.detail}`;
      }

      choices.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
        if (button.dataset.answer === current.answer) button.classList.add("is-correct");
        if (value && button.dataset.answer === value && !isCorrect) button.classList.add("is-wrong");
      });
      unknown.hidden = true;
      next.hidden = false;
      next.focus();
      updateStatus();
    };

    const showQuestion = () => {
      if (!queue.length) {
        finish();
        return;
      }

      current = queue.shift();
      answered = false;
      prompt.textContent = current.prompt;
      context.textContent = current.context || "";
      feedback.textContent = "";
      next.hidden = true;
      unknown.hidden = false;

      const variants = buildChoices(current, choiceValues());
      const document = root.ownerDocument;
      choices.replaceChildren(...variants.map((value, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "trainer__choice";
        button.dataset.answer = value;
        button.innerHTML = `<span>${index + 1}</span><strong></strong>`;
        button.querySelector("strong").textContent = value;
        button.addEventListener("click", () => answer(value));
        return button;
      }));
      updateStatus();
    };

    const start = () => {
      const cards = datasets[activeMode];
      queue = store ? orderCards(cards, modeProgress()) : shuffle(cards);
      initialCount = queue.length;
      current = null;
      attempts = 0;
      correct = 0;
      showQuestion();
    };

    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeMode = button.dataset[modeDataKey];
        modeButtons.forEach((candidate) => {
          candidate.setAttribute("aria-pressed", String(candidate === button));
        });
        start();
      });
    });
    restart.addEventListener("click", start);
    unknown.addEventListener("click", () => answer(null));
    next.addEventListener("click", showQuestion);
    root.ownerDocument.addEventListener("keydown", (event) => {
      if (!root.isConnected) return;
      if (
        ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName)
        || event.target.isContentEditable
      ) return;
      if (!answered && /^[1-4]$/.test(event.key)) {
        event.preventDefault();
        choices.querySelectorAll("button")[Number(event.key) - 1]?.click();
      } else if (answered && event.key === "Enter" && event.target.tagName !== "BUTTON") {
        event.preventDefault();
        next.click();
      }
    });

    start();
  };

  const api = {
    shuffle,
    createStore,
    updateCardProgress,
    orderCards,
    countWeakCards,
    buildChoices,
    summarizeQuizProgress,
    summarizeVocabularyProgress,
    createQuiz
  };

  if (typeof window !== "undefined") window.GreekTrainer = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
