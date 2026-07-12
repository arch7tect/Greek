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
    detailSeparator = " "
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
    let queue = [];
    let activeMode = defaultMode;
    let current = null;
    let answered = false;
    let attempts = 0;
    let correct = 0;
    let initialCount = 0;

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
      feedback.textContent = `Пройдено карточек: ${initialCount}. Точность ответов: ${accuracy}%.`;
      updateStatus();
    };

    const answer = (value) => {
      if (answered || !current) return;
      answered = true;
      attempts += 1;
      const isCorrect = value === current.answer;
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

      const distractors = shuffle(
        choiceValues().filter((value) => value !== current.answer)
      ).slice(0, 3);
      const variants = shuffle([current.answer, ...distractors]);
      const document = root.ownerDocument;
      choices.replaceChildren(...variants.map((value, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "alphabet-trainer__choice";
        button.dataset.answer = value;
        button.innerHTML = `<span>${index + 1}</span><strong></strong>`;
        button.querySelector("strong").textContent = value;
        button.addEventListener("click", () => answer(value));
        return button;
      }));
      updateStatus();
    };

    const start = () => {
      queue = shuffle(datasets[activeMode]);
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
    createQuiz
  };

  if (typeof window !== "undefined") window.GreekTrainer = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
