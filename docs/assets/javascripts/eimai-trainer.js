(() => {
  const root = document.getElementById("eimai-trainer");
  if (!root) return;

  const pronounToForm = [
    ["εγώ", "[eˈɣo] — я", "είμαι [ˈime]", "Пример:\nΕγώ είμαι από τη Γαλλία.\n[eˈɣo ˈime aˈpo ti ɣaˈlia] — Я из Франции."],
    ["εσύ", "[eˈsi] — ты", "είσαι [ˈise]", "Пример:\nΕσύ είσαι από την Τουρκία;\n[eˈsi ˈise aˈpo tin turˈkia] — Ты из Турции?"],
    ["αυτός / αυτή / αυτό", "[afˈtos / afˈti / afˈto] — он / она / оно", "είναι [ˈine]", "Пример:\nΑυτό είναι το βιβλίο μου.\n[afˈto ˈine to viˈvlio mu] — Это моя книга."],
    ["εμείς", "[eˈmis] — мы", "είμαστε [ˈimaste]", "Пример:\nΕμείς είμαστε από τη Βραζιλία.\n[eˈmis ˈimaste aˈpo ti vraziˈlia] — Мы из Бразилии."],
    ["εσείς", "[eˈsis] — вы", "είστε / είσαστε [ˈiste / ˈisaste]", "Пример:\nΕσείς είστε από την Τουρκία;\n[eˈsis ˈiste aˈpo tin turˈkia] — Вы из Турции?"],
    ["αυτοί / αυτές / αυτά", "[afˈti / afˈtes / afˈta] — они", "είναι [ˈine]", "Пример:\nΑυτές είναι από την Ελλάδα.\n[afˈtes ˈine aˈpo tin eˈlaða] — Они из Греции."]
  ].map(([prompt, context, answer, detail]) => ({ prompt, context, answer, detail }));

  const formToPronoun = [
    ["είμαι [ˈime]", "Кто соответствует этой форме?", "εγώ [eˈɣo]", "Пример:\nΕγώ είμαι από τη Γαλλία.\n[eˈɣo ˈime aˈpo ti ɣaˈlia] — Я из Франции."],
    ["είσαι [ˈise]", "Кто соответствует этой форме?", "εσύ [eˈsi]", "Пример:\nΕσύ είσαι από την Τουρκία;\n[eˈsi ˈise aˈpo tin turˈkia] — Ты из Турции?"],
    ["είναι [ˈine]", "Кто соответствует этой форме?", "αυτός / αυτή / αυτό; αυτοί / αυτές / αυτά", "Пример:\nΑυτές είναι από την Ελλάδα.\n[afˈtes ˈine aˈpo tin eˈlaða] — Они из Греции."],
    ["είμαστε [ˈimaste]", "Кто соответствует этой форме?", "εμείς [eˈmis]", "Пример:\nΕμείς είμαστε από τη Βραζιλία.\n[eˈmis ˈimaste aˈpo ti vraziˈlia] — Мы из Бразилии."],
    ["είστε / είσαστε [ˈiste / ˈisaste]", "Кто соответствует этой форме?", "εσείς [eˈsis]", "Пример:\nΕσείς είστε από την Τουρκία;\n[eˈsis ˈiste aˈpo tin turˈkia] — Вы из Турции?" ]
  ].map(([prompt, context, answer, detail]) => ({ prompt, context, answer, detail }));

  const phrases = [
    ["Εγώ ___ από τη Γαλλία.", "[eˈɣo … aˈpo ti ɣaˈlia] — Я из Франции.", "είμαι [ˈime]", "Полная фраза:\nΕγώ είμαι από τη Γαλλία.\n[eˈɣo ˈime aˈpo ti ɣaˈlia] — Я из Франции."],
    ["Εσύ ___ από την Τουρκία;", "[eˈsi … aˈpo tin turˈkia] — Ты из Турции?", "είσαι [ˈise]", "Полная фраза:\nΕσύ είσαι από την Τουρκία;\n[eˈsi ˈise aˈpo tin turˈkia] — Ты из Турции?"],
    ["Αυτό ___ το βιβλίο μου.", "[afˈto … to viˈvlio mu] — Это моя книга.", "είναι [ˈine]", "Полная фраза:\nΑυτό είναι το βιβλίο μου.\n[afˈto ˈine to viˈvlio mu] — Это моя книга."],
    ["Εμείς ___ από τη Βραζιλία.", "[eˈmis … aˈpo ti vraziˈlia] — Мы из Бразилии.", "είμαστε [ˈimaste]", "Полная фраза:\nΕμείς είμαστε από τη Βραζιλία.\n[eˈmis ˈimaste aˈpo ti vraziˈlia] — Мы из Бразилии."],
    ["Εσείς ___ από την Τουρκία;", "[eˈsis … aˈpo tin turˈkia] — Вы из Турции?", "είστε / είσαστε [ˈiste / ˈisaste]", "Полная фраза:\nΕσείς είστε από την Τουρκία;\n[eˈsis ˈiste aˈpo tin turˈkia] — Вы из Турции?"],
    ["Αυτές ___ από την Ελλάδα.", "[afˈtes … aˈpo tin eˈlaða] — Они из Греции.", "είναι [ˈine]", "Полная фраза:\nΑυτές είναι από την Ελλάδα.\n[afˈtes ˈine aˈpo tin eˈlaða] — Они из Греции." ]
  ].map(([prompt, context, answer, detail]) => ({ prompt, context, answer, detail }));

  const datasets = {
    "pronoun-to-form": pronounToForm,
    "form-to-pronoun": formToPronoun,
    phrases
  };

  const modeButtons = [...root.querySelectorAll("[data-eimai-mode]")];
  const restart = root.querySelector("#eimai-trainer-restart");
  const progress = root.querySelector("#eimai-trainer-progress");
  const score = root.querySelector("#eimai-trainer-score");
  const prompt = root.querySelector("#eimai-trainer-prompt");
  const context = root.querySelector("#eimai-trainer-context");
  const choices = root.querySelector("#eimai-trainer-choices");
  const unknown = root.querySelector("#eimai-trainer-unknown");
  const feedback = root.querySelector("#eimai-trainer-feedback");
  const next = root.querySelector("#eimai-trainer-next");

  let queue = [];
  let activeMode = "pronoun-to-form";
  let current = null;
  let answered = false;
  let attempts = 0;
  let correct = 0;
  let initialCount = 0;

  const shuffle = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

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
      feedback.textContent = `Верно.\n${current.detail}`;
    } else {
      queue.push(current);
      feedback.textContent = `Правильный ответ: ${current.answer}.\n${current.detail}`;
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
    context.textContent = current.context;
    feedback.textContent = "";
    next.hidden = true;
    unknown.hidden = false;

    const distractors = shuffle(choiceValues().filter((value) => value !== current.answer)).slice(0, 3);
    const variants = shuffle([current.answer, ...distractors]);
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
      activeMode = button.dataset.eimaiMode;
      modeButtons.forEach((candidate) => {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
      start();
    });
  });
  restart.addEventListener("click", start);
  unknown.addEventListener("click", () => answer(null));
  next.addEventListener("click", showQuestion);
  document.addEventListener("keydown", (event) => {
    if (!root.isConnected) return;
    if (["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName) || event.target.isContentEditable) return;
    if (!answered && /^[1-4]$/.test(event.key)) {
      event.preventDefault();
      choices.querySelectorAll("button")[Number(event.key) - 1]?.click();
    } else if (answered && event.key === "Enter" && event.target.tagName !== "BUTTON") {
      event.preventDefault();
      next.click();
    }
  });

  start();
})();
