(() => {
  const root = document.getElementById("alphabet-trainer");
  if (!root) return;

  const letterToSound = [
    ["Α α", "[a]", "άλφα [ˈalfa]", "Как русское «а»."],
    ["Β β", "[v]", "βήτα [ˈvita]", "Как русское «в»."],
    ["Γ γ", "[ɣ] / перед e, i — [y]", "γάμμα [ˈɣama]", "Перед α, ο, ου звучит [ɣ], перед ε и звуком [i] — мягко, приближённо [y]."],
    ["Δ δ", "[ð]", "δέλτα [ˈðelta]", "Звонкий th, как в английском this."],
    ["Ε ε", "[e]", "έψιλον [ˈepsilon]", "Как русское «э»."],
    ["Ζ ζ", "[z]", "ζήτα [ˈzita]", "Как русское «з»."],
    ["Η η", "[i]", "ήτα [ˈita]", "Один из способов записать звук [i]."],
    ["Θ θ", "[θ]", "θήτα [ˈθita]", "Глухой th, как в английском think."],
    ["Ι ι", "[i]", "γιώτα [ˈyota]", "Один из способов записать звук [i]."],
    ["Κ κ", "[k]", "κάππα [ˈkapa]", "Перед e и i естественно звучит мягче, но пишем [k]."],
    ["Λ λ", "[l]", "λάμδα [ˈlamða]", "Как русское «л»."],
    ["Μ μ", "[m]", "μι [mi]", "Как русское «м»."],
    ["Ν ν", "[n]", "νι [ni]", "Как русское «н»."],
    ["Ξ ξ", "[ks]", "ξι [ksi]", "Два звука: [k] + [s]."],
    ["Ο ο", "[o]", "όμικρον [ˈomikron]", "Один из способов записать звук [o]."],
    ["Π π", "[p]", "πι [pi]", "Как русское «п»."],
    ["Ρ ρ", "[r]", "ρο [ro]", "Раскатистое «р»."],
    ["Σ σ/ς", "[s], иногда [z]", "σίγμα [ˈsiɣma]", "Форма ς используется только в конце слова; перед звонким согласным может звучать [z]."],
    ["Τ τ", "[t]", "ταυ [taf]", "Как русское «т»."],
    ["Υ υ", "[i]", "ύψιλον [ˈipsilon]", "Один из способов записать звук [i]."],
    ["Φ φ", "[f]", "φι [fi]", "Как русское «ф»."],
    ["Χ χ", "[h]", "χι [hi]", "Греческое «х»; перед e и i звучит мягче, но пишем [h]."],
    ["Ψ ψ", "[ps]", "ψι [psi]", "Два звука: [p] + [s]."],
    ["Ω ω", "[o]", "ωμέγα [oˈmeɣa]", "Один из способов записать звук [o]."]
  ].map(([prompt, answer, name, hint]) => ({ prompt, answer, detail: `${name}. ${hint}` }));

  const soundToLetter = [
    ["[a]", "Α α", "άλφα [ˈalfa]"],
    ["[e]", "Ε ε", "έψιλον [ˈepsilon]"],
    ["[i]", "Η η · Ι ι · Υ υ", "ήτα [ˈita], γιώτα [ˈyota], ύψιλον [ˈipsilon]"],
    ["[o]", "Ο ο · Ω ω", "όμικρον [ˈomikron], ωμέγα [oˈmeɣa]"],
    ["[v]", "Β β", "βήτα [ˈvita]"],
    ["[ɣ] / [y]", "Γ γ", "γάμμα [ˈɣama]"],
    ["[ð]", "Δ δ", "δέλτα [ˈðelta]"],
    ["[z]", "Ζ ζ", "ζήτα [ˈzita]"],
    ["[θ]", "Θ θ", "θήτα [ˈθita]"],
    ["[k]", "Κ κ", "κάππα [ˈkapa]"],
    ["[l]", "Λ λ", "λάμδα [ˈlamða]"],
    ["[m]", "Μ μ", "μι [mi]"],
    ["[n]", "Ν ν", "νι [ni]"],
    ["[ks]", "Ξ ξ", "ξι [ksi]"],
    ["[p]", "Π π", "πι [pi]"],
    ["[r]", "Ρ ρ", "ρο [ro]"],
    ["[s]", "Σ σ/ς", "σίγμα [ˈsiɣma]"],
    ["[t]", "Τ τ", "ταυ [taf]"],
    ["[f]", "Φ φ", "φι [fi]"],
    ["[h]", "Χ χ", "χι [hi]"],
    ["[ps]", "Ψ ψ", "ψι [psi]"]
  ].map(([prompt, answer, detail]) => ({ prompt, answer, detail }));

  const combinations = [
    ["αι", "[e]", "Как в και [ke]."],
    ["ει", "[i]", "Как в είμαι [ˈime]."],
    ["οι", "[i]", "Как в φοιτητής [fitiˈtis]."],
    ["υι", "[i]", "Редкое сочетание для звука [i]."],
    ["ου", "[u]", "Как в ούζο [ˈuzo]."],
    ["αυ", "[av]", "Перед гласной или звонкой согласной: αύριο [ˈavrio].", "перед гласной или звонкой согласной"],
    ["αυ", "[af]", "Перед глухой согласной: αυτός [afˈtos].", "перед глухой согласной"],
    ["ευ", "[ev]", "Перед гласной или звонкой согласной: Ευρώπη [eˈvropi].", "перед гласной или звонкой согласной"],
    ["ευ", "[ef]", "Перед глухой согласной: ευχαριστώ [efhariˈsto].", "перед глухой согласной"],
    ["μπ", "[b]", "В начале слова: μπάλα [ˈbala].", "в начале слова"],
    ["μπ", "[mb] или [b]", "Внутри слова: ταμπέλα [taˈmbela].", "внутри слова"],
    ["ντ", "[d]", "В начале слова: ντεκόρ [deˈkor].", "в начале слова"],
    ["ντ", "[nd] или [d]", "Внутри слова: πάντα [ˈpanda].", "внутри слова"],
    ["γκ", "[g]", "В начале слова: γκάζι [ˈgazi].", "в начале слова"],
    ["γκ", "[ŋg] или [g]", "Внутри слова: αγκινάρα [aŋgiˈnara].", "внутри слова"],
    ["γγ", "[ŋg]", "Внутри слова: άγγελος [ˈaŋgelos]."],
    ["τσ", "[ts]", "Как в τσάντα [ˈtsanda]."],
    ["τζ", "[dz] или [ndz]", "Как в τζάμι [ˈdzami] и ταξιτζής [taksiˈdzis]."]
  ].map(([prompt, answer, detail, context = ""]) => ({ prompt, answer, detail, context }));

  const datasets = {
    "letter-to-sound": letterToSound,
    "sound-to-letter": soundToLetter,
    combinations
  };

  const modeButtons = [...root.querySelectorAll("[data-mode]")];
  const restart = root.querySelector("#alphabet-trainer-restart");
  const progress = root.querySelector("#alphabet-trainer-progress");
  const score = root.querySelector("#alphabet-trainer-score");
  const prompt = root.querySelector("#alphabet-trainer-prompt");
  const context = root.querySelector("#alphabet-trainer-context");
  const choices = root.querySelector("#alphabet-trainer-choices");
  const unknown = root.querySelector("#alphabet-trainer-unknown");
  const feedback = root.querySelector("#alphabet-trainer-feedback");
  const next = root.querySelector("#alphabet-trainer-next");

  let queue = [];
  let activeMode = "letter-to-sound";
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

  const answer = (value) => {
    if (answered || !current) return;
    answered = true;
    attempts += 1;
    const isCorrect = value === current.answer;
    if (isCorrect) {
      correct += 1;
      feedback.textContent = `Верно. ${current.detail}`;
    } else {
      queue.push(current);
      feedback.textContent = `Правильный ответ: ${current.answer}. ${current.detail}`;
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
      activeMode = button.dataset.mode;
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
