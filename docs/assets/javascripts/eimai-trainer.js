(() => {
  const root = document.getElementById("eimai-trainer");
  if (!root) return;

  const pronounToForm = [
    ["ego-ime", "εγώ", "[eˈɣo] — я", "είμαι [ˈime]", "Пример:\nΕγώ είμαι από τη Γαλλία.\n[eˈɣo ˈime aˈpo ti ɣaˈlia] — Я из Франции."],
    ["esy-ise", "εσύ", "[eˈsi] — ты", "είσαι [ˈise]", "Пример:\nΕσύ είσαι από την Τουρκία;\n[eˈsi ˈise aˈpo tin turˈkia] — Ты из Турции?"],
    ["aftos-ine", "αυτός / αυτή / αυτό", "[afˈtos / afˈti / afˈto] — он / она / оно", "είναι [ˈine]", "Пример:\nΑυτό είναι το βιβλίο μου.\n[afˈto ˈine to viˈvlio mu] — Это моя книга."],
    ["emeis-imaste", "εμείς", "[eˈmis] — мы", "είμαστε [ˈimaste]", "Пример:\nΕμείς είμαστε από τη Βραζιλία.\n[eˈmis ˈimaste aˈpo ti vraziˈlia] — Мы из Бразилии."],
    ["eseis-iste", "εσείς", "[eˈsis] — вы", "είστε / είσαστε [ˈiste / ˈisaste]", "Пример:\nΕσείς είστε από την Τουρκία;\n[eˈsis ˈiste aˈpo tin turˈkia] — Вы из Турции?"],
    ["aftoi-ine", "αυτοί / αυτές / αυτά", "[afˈti / afˈtes / afˈta] — они", "είναι [ˈine]", "Пример:\nΑυτές είναι από την Ελλάδα.\n[afˈtes ˈine aˈpo tin eˈlaða] — Они из Греции."]
  ].map(([id, prompt, context, answer, detail]) => ({ id, prompt, context, answer, detail }));

  const formToPronoun = [
    ["ime-ego", "είμαι [ˈime]", "Кто соответствует этой форме?", "εγώ [eˈɣo]", "Пример:\nΕγώ είμαι από τη Γαλλία.\n[eˈɣo ˈime aˈpo ti ɣaˈlia] — Я из Франции."],
    ["ise-esy", "είσαι [ˈise]", "Кто соответствует этой форме?", "εσύ [eˈsi]", "Пример:\nΕσύ είσαι από την Τουρκία;\n[eˈsi ˈise aˈpo tin turˈkia] — Ты из Турции?"],
    ["ine-third-person", "είναι [ˈine]", "Кто соответствует этой форме?", "αυτός / αυτή / αυτό; αυτοί / αυτές / αυτά", "Пример:\nΑυτές είναι από την Ελλάδα.\n[afˈtes ˈine aˈpo tin eˈlaða] — Они из Греции."],
    ["imaste-emeis", "είμαστε [ˈimaste]", "Кто соответствует этой форме?", "εμείς [eˈmis]", "Пример:\nΕμείς είμαστε από τη Βραζιλία.\n[eˈmis ˈimaste aˈpo ti vraziˈlia] — Мы из Бразилии."],
    ["iste-eseis", "είστε / είσαστε [ˈiste / ˈisaste]", "Кто соответствует этой форме?", "εσείς [eˈsis]", "Пример:\nΕσείς είστε από την Τουρκία;\n[eˈsis ˈiste aˈpo tin turˈkia] — Вы из Турции?" ]
  ].map(([id, prompt, context, answer, detail]) => ({ id, prompt, context, answer, detail }));

  const phrases = [
    ["phrase-ego-france", "Εγώ ___ από τη Γαλλία.", "[eˈɣo … aˈpo ti ɣaˈlia] — Я из Франции.", "είμαι [ˈime]", "Полная фраза:\nΕγώ είμαι από τη Γαλλία.\n[eˈɣo ˈime aˈpo ti ɣaˈlia] — Я из Франции."],
    ["phrase-esy-turkey", "Εσύ ___ από την Τουρκία;", "[eˈsi … aˈpo tin turˈkia] — Ты из Турции?", "είσαι [ˈise]", "Полная фраза:\nΕσύ είσαι από την Τουρκία;\n[eˈsi ˈise aˈpo tin turˈkia] — Ты из Турции?"],
    ["phrase-afto-book", "Αυτό ___ το βιβλίο μου.", "[afˈto … to viˈvlio mu] — Это моя книга.", "είναι [ˈine]", "Полная фраза:\nΑυτό είναι το βιβλίο μου.\n[afˈto ˈine to viˈvlio mu] — Это моя книга."],
    ["phrase-emeis-brazil", "Εμείς ___ από τη Βραζιλία.", "[eˈmis … aˈpo ti vraziˈlia] — Мы из Бразилии.", "είμαστε [ˈimaste]", "Полная фраза:\nΕμείς είμαστε από τη Βραζιλία.\n[eˈmis ˈimaste aˈpo ti vraziˈlia] — Мы из Бразилии."],
    ["phrase-eseis-turkey", "Εσείς ___ από την Τουρκία;", "[eˈsis … aˈpo tin turˈkia] — Вы из Турции?", "είστε / είσαστε [ˈiste / ˈisaste]", "Полная фраза:\nΕσείς είστε από την Τουρκία;\n[eˈsis ˈiste aˈpo tin turˈkia] — Вы из Турции?"],
    ["phrase-aftes-greece", "Αυτές ___ από την Ελλάδα.", "[afˈtes … aˈpo tin eˈlaða] — Они из Греции.", "είναι [ˈine]", "Полная фраза:\nΑυτές είναι από την Ελλάδα.\n[afˈtes ˈine aˈpo tin eˈlaða] — Они из Греции." ]
  ].map(([id, prompt, context, answer, detail]) => ({ id, prompt, context, answer, detail }));

  const datasets = {
    "pronoun-to-form": pronounToForm,
    "form-to-pronoun": formToPronoun,
    phrases
  };

  window.GreekTrainer.createQuiz({
    root,
    datasets,
    defaultMode: "pronoun-to-form",
    modeDataKey: "eimaiMode",
    detailSeparator: "\n",
    elements: {
      modeButtons: [...root.querySelectorAll("[data-eimai-mode]")],
      restart: root.querySelector("#eimai-trainer-restart"),
      progress: root.querySelector("#eimai-trainer-progress"),
      score: root.querySelector("#eimai-trainer-score"),
      prompt: root.querySelector("#eimai-trainer-prompt"),
      context: root.querySelector("#eimai-trainer-context"),
      choices: root.querySelector("#eimai-trainer-choices"),
      unknown: root.querySelector("#eimai-trainer-unknown"),
      feedback: root.querySelector("#eimai-trainer-feedback"),
      next: root.querySelector("#eimai-trainer-next")
    }
  });
})();
