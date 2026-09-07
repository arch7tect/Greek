window.GREEK_ARTICLES_STUDIES_DATA = {
  storageKey: "greek-trainer:articles-studies:v2",
  modes: [
    {
      key: "articles",
      title: "Известный или новый",
      cards: [
        ["art-known-marker", "Указать на уже известный маркер", "ο μαρκαδόρος [o markaˈðoros]", ["ο μαρκαδόρος [o markaˈðoros]", "ένας μαρκαδόρος [ˈenas markaˈðoros]", "η μαρκαδόρος [i markaˈðoros]", "το μαρκαδόρος [to markaˈðoros]"], "ο μαρκαδόρος [o markaˈðoros]: мужской род и определённый артикль, потому что предмет уже известен."],
        ["art-new-marker", "Ввести в разговор один ещё не уточнённый маркер", "ένας μαρκαδόρος [ˈenas markaˈðoros]", ["ο μαρκαδόρος [o markaˈðoros]", "ένας μαρκαδόρος [ˈenas markaˈðoros]", "η μαρκαδόρος [i markaˈðoros]", "το μαρκαδόρος [to markaˈðoros]"], "ένας μαρκαδόρος [ˈenas markaˈðoros]: мужской род, один новый предмет."],
        ["art-known-library", "Назвать уже известную библиотеку", "η βιβλιοθήκη [i vivlioˈθiki]", ["η βιβλιοθήκη [i vivlioˈθiki]", "μία βιβλιοθήκη [ˈmia vivlioˈθiki]", "ο βιβλιοθήκη [o vivlioˈθiki]", "το βιβλιοθήκη [to vivlioˈθiki]"], "η βιβλιοθήκη [i vivlioˈθiki]: женский род и известный объект."],
        ["art-new-library", "Ввести в разговор одну библиотеку", "μία βιβλιοθήκη [ˈmia vivlioˈθiki]", ["η βιβλιοθήκη [i vivlioˈθiki]", "μία βιβλιοθήκη [ˈmia vivlioˈθiki]", "ο βιβλιοθήκη [o vivlioˈθiki]", "το βιβλιοθήκη [to vivlioˈθiki]"], "μία βιβλιοθήκη [ˈmia vivlioˈθiki]: женский род и один новый объект."],
        ["art-known-museum", "Назвать уже известный музей", "το μουσείο [to muˈsio]", ["το μουσείο [to muˈsio]", "ένα μουσείο [ˈena muˈsio]", "ο μουσείο [o muˈsio]", "η μουσείο [i muˈsio]"], "το μουσείο [to muˈsio]: средний род и известный объект."],
        ["art-new-museum", "Ввести в разговор один музей", "ένα μουσείο [ˈena muˈsio]", ["το μουσείο [to muˈsio]", "ένα μουσείο [ˈena muˈsio]", "ο μουσείο [o muˈsio]", "η μουσείο [i muˈsio]"], "ένα μουσείο [ˈena muˈsio]: средний род и один новый объект."],
        ["art-known-computer", "Указать на уже известный компьютер", "ο υπολογιστής [o ipoloyiˈstis]", ["ο υπολογιστής [o ipoloyiˈstis]", "ένας υπολογιστής [ˈenas ipoloyiˈstis]", "η υπολογιστής [i ipoloyiˈstis]", "το υπολογιστής [to ipoloyiˈstis]"], "ο υπολογιστής [o ipoloyiˈstis]: мужской род и определённый артикль."],
        ["art-new-computer", "Ввести в разговор один компьютер", "ένας υπολογιστής [ˈenas ipoloyiˈstis]", ["ο υπολογιστής [o ipoloyiˈstis]", "ένας υπολογιστής [ˈenas ipoloyiˈstis]", "η υπολογιστής [i ipoloyiˈstis]", "το υπολογιστής [to ipoloyiˈstis]"], "ένας υπολογιστής [ˈenas ipoloyiˈstis]: мужской род и один новый предмет."],
        ["art-known-cafe", "Назвать уже известное кафе", "η καφετέρια [i kafeˈteria]", ["η καφετέρια [i kafeˈteria]", "μία καφετέρια [ˈmia kafeˈteria]", "ο καφετέρια [o kafeˈteria]", "το καφετέρια [to kafeˈteria]"], "η καφετέρια [i kafeˈteria]: женский род и известное место."],
        ["art-new-cafe", "Ввести в разговор одно кафе", "μία καφετέρια [ˈmia kafeˈteria]", ["η καφετέρια [i kafeˈteria]", "μία καφετέρια [ˈmia kafeˈteria]", "ο καφετέρια [o kafeˈteria]", "το καφετέρια [to kafeˈteria]"], "μία καφετέρια [ˈmia kafeˈteria]: женский род и одно новое место."],
        ["art-known-restaurant", "Назвать уже известный ресторан", "το εστιατόριο [to estiaˈtorio]", ["το εστιατόριο [to estiaˈtorio]", "ένα εστιατόριο [ˈena estiaˈtorio]", "ο εστιατόριο [o estiaˈtorio]", "η εστιατόριο [i estiaˈtorio]"], "το εστιατόριο [to estiaˈtorio]: средний род и известное место."],
        ["art-new-restaurant", "Ввести в разговор один ресторан", "ένα εστιατόριο [ˈena estiaˈtorio]", ["το εστιατόριο [to estiaˈtorio]", "ένα εστιατόριο [ˈena estiaˈtorio]", "ο εστιατόριο [o estiaˈtorio]", "η εστιατόριο [i estiaˈtorio]"], "ένα εστιατόριο [ˈena estiaˈtorio]: средний род и одно новое место."]
      ].map(([id, prompt, answer, choices, detail]) => ({ id, lesson: "07", prompt, answer, choices, detail }))
    },
    {
      key: "studies",
      title: "Разговор об учёбе",
      cards: [
        ["study-ask", "Спросить одного человека на «ты», что он изучает", "Τι σπουδάζεις; [ti spuˈðazis?]", "Τι σπουδάζεις; [ti spuˈðazis?] — одному человеку на «ты». Вежливо или нескольким: Τι σπουδάζετε; [ti spuˈðazete?]."],
        ["study-law", "Сказать: «Я изучаю право»", "Σπουδάζω Νομικά. [spuˈðazo nomiˈka]", "Σπουδάζω Νομικά [spuˈðazo nomiˈka] — Νομικά [nomiˈka] употребляется во множественном числе."],
        ["study-master", "Сказать: «Я учусь в магистратуре»", "Κάνω μεταπτυχιακό. [ˈkano metaptihiaˈko]", "Κάνω μεταπτυχιακό [ˈkano metaptihiaˈko] — модель из диалога урока 07."],
        ["study-psychology", "Сказать: «Я изучаю психологию в Афинском университете»", "Σπουδάζω Ψυχολογία στο Πανεπιστήμιο Αθηνών. [spuˈðazo psiholoˈyia sto panepiˈstimio aθiˈnon]", "После σπουδάζω [spuˈðazo] называется специальность; место вводится слитной формой στο [sto]."],
        ["study-speak", "Похвалить собеседника: «Ты прекрасно говоришь по-гречески!»", "Μιλάς ελληνικά μια χαρά! [miˈlas eliniˈka mya haˈra]", "Μιλάς ελληνικά μια χαρά! [miˈlas eliniˈka mya haˈra] — реплика из диалога."],
        ["study-understand", "Сказать: «Но я понимаю очень хорошо!»", "Καταλαβαίνω, όμως, πολύ καλά! [katalaveˈno, ˈomos, poˈli kaˈla]", "Καταλαβαίνω [katalaveˈno] — «понимаю»; όμως [ˈomos] добавляет контраст «однако»."],
        ["study-friend", "Сказать: «У меня есть подруга-гречанка, и она мне очень помогает»", "Έχω μία φίλη Ελληνίδα και με βοηθάει πολύ. [ˈeho ˈmia ˈfili eliˈniða ke me voiˈθai poˈli]", "μία φίλη Ελληνίδα [ˈmia ˈfili eliˈniða] — новая участница разговора; поэтому используется неопределённый артикль μία [ˈmia]."],
        ["study-doctorate", "Сказать о ней: «Она пишет докторскую работу»", "Αυτή κάνει διδακτορικό. [afˈti ˈkani ðiðaktoriˈko]", "Αυτή κάνει διδακτορικό [afˈti ˈkani ðiðaktoriˈko] — местоимение подчёркивает, что речь идёт именно о подруге."]
      ].map(([id, prompt, answer, detail]) => ({ id, lesson: "07", prompt, answer, detail }))
    },
    {
      key: "country",
      title: "Страна, человек, язык",
      cards: [
        ["country-france-place", "Είμαι από ___ .", "τη Γαλλία [ti ɣaˈlia]", ["τη Γαλλία [ti ɣaˈlia]", "Γάλλος [ˈɣalos]", "Γαλλίδα [ɣaˈliða]", "γαλλικά [ɣaliˈka]"], "Είμαι από τη Γαλλία [ˈime aˈpo ti ɣaˈlia] — после από [aˈpo] называется страна.", "Человек из Франции"],
        ["country-france-person", "Είμαι ___ .", "Γάλλος [ˈɣalos]", ["τη Γαλλία [ti ɣaˈlia]", "Γάλλος [ˈɣalos]", "Γαλλίδα [ɣaˈliða]", "γαλλικά [ɣaliˈka]"], "Είμαι Γάλλος [ˈime ˈɣalos] — национальность мужчины; женщина скажет Είμαι Γαλλίδα [ˈime ɣaˈliða].", "Говорит мужчина-француз"],
        ["country-france-language", "Μιλάω ___ .", "γαλλικά [ɣaliˈka]", ["τη Γαλλία [ti ɣaˈlia]", "Γάλλος [ˈɣalos]", "Γαλλίδα [ɣaˈliða]", "γαλλικά [ɣaliˈka]"], "Μιλάω γαλλικά [miˈlao ɣaliˈka] — после μιλάω [miˈlao] называется язык.", "Я говорю по-французски"],
        ["country-italy-place", "Είμαι από ___ .", "την Ιταλία [tin itaˈlia]", ["την Ιταλία [tin itaˈlia]", "Ιταλός [itaˈlos]", "Ιταλίδα [itaˈliða]", "ιταλικά [italiˈka]"], "Είμαι από την Ιταλία [ˈime aˈpo tin itaˈlia] — перед гласной сохраняется ν [n].", "Человек из Италии"],
        ["country-italy-person", "Είμαι ___ .", "Ιταλίδα [itaˈliða]", ["την Ιταλία [tin itaˈlia]", "Ιταλός [itaˈlos]", "Ιταλίδα [itaˈliða]", "ιταλικά [italiˈka]"], "Είμαι Ιταλίδα [ˈime itaˈliða] — национальность женщины; мужчина скажет Ιταλός [itaˈlos].", "Говорит женщина-итальянка"],
        ["country-italy-language", "Μιλάω ___ .", "ιταλικά [italiˈka]", ["την Ιταλία [tin itaˈlia]", "Ιταλός [itaˈlos]", "Ιταλίδα [itaˈliða]", "ιταλικά [italiˈka]"], "Μιλάω ιταλικά [miˈlao italiˈka] — название языка употребляется во множественном числе.", "Я говорю по-итальянски"],
        ["country-greece-place", "Είμαι από ___ .", "την Ελλάδα [tin eˈlaða]", ["την Ελλάδα [tin eˈlaða]", "Έλληνας [ˈelinas]", "Ελληνίδα [eliˈniða]", "ελληνικά [eliniˈka]"], "Είμαι από την Ελλάδα [ˈime aˈpo tin eˈlaða] — после από [aˈpo] используется страна в винительном.", "Человек из Греции"],
        ["country-greece-person", "Είμαι ___ .", "Ελληνίδα [eliˈniða]", ["την Ελλάδα [tin eˈlaða]", "Έλληνας [ˈelinas]", "Ελληνίδα [eliˈniða]", "ελληνικά [eliniˈka]"], "Είμαι Ελληνίδα [ˈime eliˈniða] — национальность женщины; мужчина скажет Έλληνας [ˈelinas].", "Говорит женщина-гречанка"],
        ["country-greece-language", "Μιλάω ___ .", "ελληνικά [eliniˈka]", ["την Ελλάδα [tin eˈlaða]", "Έλληνας [ˈelinas]", "Ελληνίδα [eliˈniða]", "ελληνικά [eliniˈka]"], "Μιλάω ελληνικά [miˈlao eliniˈka] — «я говорю по-гречески».", "Я говорю по-гречески"],
        ["country-russia-place", "Είμαι από ___ .", "τη Ρωσία [ti roˈsia]", ["τη Ρωσία [ti roˈsia]", "Ρώσος [ˈrosos]", "Ρωσίδα [roˈsiða]", "ρωσικά [rosiˈka]"], "Είμαι από τη Ρωσία [ˈime aˈpo ti roˈsia] — перед ρ [r] конечное ν [n] опускается.", "Человек из России"],
        ["country-russia-person", "Είμαι ___ .", "Ρώσος [ˈrosos]", ["τη Ρωσία [ti roˈsia]", "Ρώσος [ˈrosos]", "Ρωσίδα [roˈsiða]", "ρωσικά [rosiˈka]"], "Είμαι Ρώσος [ˈime ˈrosos] — национальность мужчины; женщина скажет Ρωσίδα [roˈsiða].", "Говорит мужчина-русский"],
        ["country-russia-language", "Μιλάω ___ .", "ρωσικά [rosiˈka]", ["τη Ρωσία [ti roˈsia]", "Ρώσος [ˈrosos]", "Ρωσίδα [roˈsiða]", "ρωσικά [rosiˈka]"], "Μιλάω ρωσικά [miˈlao rosiˈka] — после μιλάω [miˈlao] используется название языка.", "Я говорю по-русски"]
      ].map(([id, prompt, answer, choices, detail, context]) => ({ id, lesson: "07", prompt, context, answer, choices, detail }))
    }
  ]
};
