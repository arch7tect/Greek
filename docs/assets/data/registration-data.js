window.GREEK_REGISTRATION_DATA = {
  storageKey: "greek-trainer:registration:v2",
  modes: [
    {
      key: "ask",
      title: "Вопрос секретаря",
      cards: [
        ["reg-ask-name", "Вежливо спросить имя посетителя", "Πώς λέγεστε, παρακαλώ; [pos ˈleyeste, parakaˈlo?]", "Πώς λέγεστε, παρακαλώ; [pos ˈleyeste, parakaˈlo?] — официальный вопрос в секретариате. Разговорное Πώς σε λένε; [pos se ˈlene?] адресовано одному человеку на «ты»."],
        ["reg-ask-erasmus", "Уточнить, является ли посетительница студенткой Erasmus", "Είστε φοιτήτρια Erasmus; [ˈiste fitiˈtria ˈerasmus?]", "Είστε φοιτήτρια Erasmus; [ˈiste fitiˈtria ˈerasmus?] — вежливая форма для женщины; в диалоге посетительница отвечает Μάλιστα [ˈmalista]."],
        ["reg-ask-nationality", "Уточнить, испанка ли посетительница", "Είστε Ισπανίδα; [ˈiste ispaˈniða?]", "Είστε Ισπανίδα; [ˈiste ispaˈniða?] спрашивает о национальности, а Από πού είστε; [aˈpo pu ˈiste?] — о стране происхождения."],
        ["reg-ask-studies", "Вежливо спросить, что человек изучает", "Και τι σπουδάζετε; [ke ti spuˈðazete?]", "Και τι σπουδάζετε; [ke ti spuˈðazete?] — вежливая форма. Одному человеку на «ты»: Τι σπουδάζεις; [ti spuˈðazis?]."],
        ["reg-ask-residence", "Вежливо спросить, где человек сейчас живёт", "Τώρα πού μένετε; [ˈtora pu ˈmenete?]", "Τώρα πού μένετε; [ˈtora pu ˈmenete?] спрашивает о текущем месте жительства, не о происхождении."],
        ["reg-ask-address", "Попросить назвать адрес", "Μία διεύθυνση; [ˈmia ðiˈefθinsi?]", "Μία διεύθυνση; [ˈmia ðiˈefθinsi?] — краткая реплика секретаря: «адрес?»."],
        ["reg-ask-phone", "Попросить номер телефона", "Ένα τηλέφωνο, παρακαλώ; [ˈena tiˈlefono, parakaˈlo?]", "Ένα τηλέφωνο, παρακαλώ; [ˈena tiˈlefono, parakaˈlo?] — «номер телефона, пожалуйста?»."],
        ["reg-ask-email", "Попросить адрес электронной почты", "Ένα μέιλ; [ˈena ˈmeil?]", "Ένα μέιλ; [ˈena ˈmeil?] — краткий вопрос об электронной почте."],
        ["reg-ask-photo", "Спросить, есть ли фотография", "Έχετε μία φωτογραφία; [ˈehete ˈmia fotoɣraˈfia?]", "Έχετε μία φωτογραφία; [ˈehete ˈmia fotoɣraˈfia?] — Έχετε [ˈehete] является вежливой формой «у вас есть?»."]
      ].map(([id, prompt, answer, detail]) => ({ id, lesson: "06", prompt, answer, detail }))
    },
    {
      key: "reply",
      title: "Ответ посетителя",
      cards: [
        ["reg-reply-name", "Πώς λέγεστε, παρακαλώ; [pos ˈleyeste, parakaˈlo?]", "Με λένε … [me ˈlene …]", "Με λένε … [me ˈlene …] — нейтральная модель «меня зовут …».", "Назовите себя"],
        ["reg-reply-erasmus", "Είστε φοιτήτρια Erasmus; [ˈiste fitiˈtria ˈerasmus?]", "Μάλιστα. [ˈmalista]", "Μάλιστα [ˈmalista] — вежливое подтверждение «да, конечно».", "Подтвердите вежливо"],
        ["reg-reply-nationality", "Είστε Ισπανίδα; [ˈiste ispaˈniða?]", "Ναι, είμαι από την Ισπανία. [ne, ˈime aˈpo tin ispaˈnia]", "В ответе называется страна: είμαι από την Ισπανία [ˈime aˈpo tin ispaˈnia].", "Ответьте утвердительно и назовите страну"],
        ["reg-reply-residence", "Τώρα πού μένετε; [ˈtora pu ˈmenete?]", "Μένω στην Κυψέλη. [ˈmeno stin kiˈpseli]", "Μένω στην Κυψέλη [ˈmeno stin kiˈpseli] отвечает о текущем месте жительства.", "Назовите текущее место жительства"],
        ["reg-reply-phone", "Ένα τηλέφωνο, παρακαλώ; [ˈena tiˈlefono, parakaˈlo?]", "Το κινητό μου είναι … [to kiniˈto mu ˈine …]", "Το κινητό μου είναι … [to kiniˈto mu ˈine …] — «мой мобильный номер …».", "Дайте мобильный номер"],
        ["reg-reply-email", "Ένα μέιλ; [ˈena ˈmeil?]", "Το μέιλ μου είναι … [to ˈmeil mu ˈine …]", "Το μέιλ μου είναι … [to ˈmeil mu ˈine …] — «мой электронный адрес …».", "Дайте электронный адрес"],
        ["reg-reply-photo", "Έχετε μία φωτογραφία; [ˈehete ˈmia fotoɣraˈfia?]", "Ναι, ορίστε. [ne, oˈriste]", "Ναι, ορίστε [ne, oˈriste] — «да, вот, пожалуйста» при передаче фотографии.", "Передайте фотографию"],
        ["reg-reply-wish", "Καλή αρχή! [kaˈli arˈhi]", "Ευχαριστώ πολύ! [efhariˈsto poˈli]", "На пожелание Καλή αρχή! [kaˈli arˈhi] естественно ответить Ευχαριστώ πολύ! [efhariˈsto poˈli].", "Поблагодарите за пожелание"]
      ].map(([id, prompt, answer, detail, context]) => ({ id, lesson: "06", prompt, context, answer, detail }))
    },
    {
      key: "form",
      title: "Анкета и e-mail",
      cards: [
        ["reg-form-registration", "записываться, регистрироваться", "κάνω εγγραφή [ˈkano eŋgraˈfi]", "κάνω εγγραφή [ˈkano eŋgraˈfi] — буквально «делаю регистрацию»."],
        ["reg-form-email", "e-mail", "το μέιλ [to ˈmeil]", "e-mail по-гречески в диалоге — το μέιλ [to ˈmeil]."],
        ["reg-form-at", "символ @", "το παπάκι [to paˈpaki]", "Символ @ называют το παπάκι [to paˈpaki], буквально «утёнок»."],
        ["reg-form-dot", "точка в электронном адресе", "η τελεία [i teˈlia]", "η τελεία [i teˈlia] — «точка». Не путать с τέλεια [ˈtelia] — «отлично»."]
      ].map(([id, prompt, answer, detail]) => ({ id, lesson: "06", prompt, answer, detail }))
    }
  ]
};
