import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";


test("lesson 11 covers every taught adjective without duplicating known lemmas", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  const words = data.words.filter(word => word.lessons.includes("11"));
  const adjectives = ["καλός","κακός","μεγάλος","μικρός","όμορφος","άσχημος","φτηνός","ακριβός","ψηλός","κοντός","χοντρός","λεπτός","ζεστός","καθαρός","βρώμικος","εύκολος","δύσκολος","φτωχός","έξυπνος","γεμάτος","έτοιμος","ανοιχτός","κλειστός","γρήγορος","αργός","ευγενικός","αυστηρός","ήσυχος","απλός","στενός","καινούργιος","νέος","παλιός","πλούσιος","ωραίος","κρύος","άδειος","μοντέρνος","σκούρος","γκρίζος","φρέσκος","γλυκός","ηλικιωμένος"];
  for (const lemma of adjectives) {
    assert.ok(words.some(word => word.greek.split(" / ")[0] === lemma), lemma);
  }
  assert.equal(adjectives.length, 43);
  assert.equal(data.words.filter(word => word.lesson === "11").length, 56);
  assert.equal(words.length, 103);
  for (const lemma of ["η τυρόπιτα", "το κορίτσι", "το ποτήρι", "η φίλη",
                       "η εβδομάδα", "εκείνος / εκείνη / εκείνο"]) {
    assert.ok(words.some(word => word.greek === lemma), lemma);
  }
  const cards = JSON.parse(await readFile("scripts/mobile-data/lesson-11.json", "utf8"));
  assert.equal(cards.length, 4);
  const core = JSON.parse(await readFile("scripts/mobile-data/core.json", "utf8"));
  assert.equal(core.length, 20);
  assert.ok(core[11].sources.includes("docs/lessons/lesson-11-current.md"));
  const lesson = await readFile("docs/lessons/lesson-11-current.md", "utf8");
  assert.ok(lesson.includes("если успеешь"));
});


test("lesson 12 separates its new words and preserves the corrected assignment and listening key", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  assert.equal(data.words.filter(word => word.lesson === "12").length, 23);
  assert.equal(data.lessons["12"].total, 106);
  for (const id of ["το ποδήλατο", "ο αναπτήρας", "η ομπρέλα", "το πιάτο", "το ρολόι", "το λεπτό", "οδηγώ", "ο οδηγός ταξί"]) {
    assert.ok(data.words.some(word => word.id === id && word.lesson === "12"), id);
  }
  const cards = JSON.parse(await readFile("scripts/mobile-data/lesson-12.json", "utf8"));
  assert.equal(cards.length, 3);
  const homework = await readFile("docs/homework/lesson-12-current.md", "utf8");
  assert.ok(homework.includes("с. 22 №6"));
  assert.ok(homework.includes('src="../../assets/audio/lesson-12-exercise-15.mp3"'));
  assert.ok(homework.includes('??? note "Ключ и объяснения'));
  assert.ok(homework.includes("Είμαι οδηγός ταξί."));
  assert.ok((await readFile("docs/assets/audio/lesson-12-exercise-15.mp3")).length > 0);
});

test("core professions card is a small source-backed selection", async () => {
  const core = JSON.parse(await readFile("scripts/mobile-data/core.json", "utf8"));
  const card = core[12];
  assert.equal(card.title, "Профессии и места работы");
  assert.equal(card.rows.length, 6);
  for (const source of card.sources) await readFile(source, "utf8");
  const content = card.rows.join("\n");
  for (const word of ["δάσκαλος", "γιατρός", "σερβιτόρος", "πωλητής", "κομμωτής", "προγραμματιστής", "πληροφορική"]) {
    assert.ok(content.includes(word), word);
  }
  assert.ok(card.rows.every(row => row.includes("[") && row.includes("]")));
  assert.ok(card.note.includes("IT — сфера, не место"));
});

test("lesson 13 includes calendar, the full supplied dialogue and the exact written assignment", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  const newWords = data.words.filter(word => word.lesson === "13");
  assert.equal(newWords.length, 115);
  assert.equal(newWords.filter(word => word.core).length, 99);
  assert.equal(data.lessons["13"].total, 164);
  for (const id of ["η Δευτέρα", "η Κυριακή", "ο Ιανουάριος", "ο Δεκέμβριος", "η άνοιξη", "ο χειμώνας", "παρά", "η ώρα", "τρώω", "ακούω", "βρέχει", "χιονίζει"]) {
    assert.ok(newWords.some(word => word.id === id), id);
  }
  const cards = JSON.parse(await readFile("scripts/mobile-data/lesson-13.json", "utf8"));
  assert.equal(cards.length, 5);
  assert.equal(cards[3].rows.length, 12);
  const homework = await readFile("docs/homework/lesson-13-current.md", "utf8");
  for (const marker of ["с. 26 №2", "144: №14 и №15", "№16: письменно", "Πότε πάει για μπάνιο στη θάλασσα;"]) assert.ok(homework.includes(marker), marker);
  const lesson = await readFile("docs/lessons/lesson-13-current.md", "utf8");
  for (const phrase of ["Πού πας πρωί πρωί;", "Ποιος τραγουδάει;", "Καλή τύχη στις εξετάσεις!", "Τον Δεκέμβριο είναι τα Χριστούγεννα."]) assert.ok(lesson.includes(phrase), phrase);
});

test("time topic trains core formulas and preserves standard mode selection", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  const core = JSON.parse(await readFile("scripts/mobile-data/core.json", "utf8"));
  const card = core.find(card => card.title === "Время: который час и во сколько");
  assert.equal(card.rows.length, 7);
  for (const marker of ["π.μ. = πριν το μεσημέρι", "[prin to mesiˈmeri]", "μ.μ. = μετά το μεσημέρι", "[meˈta to mesiˈmeri]"]) assert.ok(card.print_note_extra.includes(marker), marker);
  assert.ok(card.sources.includes("scripts/mobile-data/lesson-13.json"));
  for (const marker of ["2 и 5–12 не меняются", "στη [sti]", "στις [stis]", "ед. ч.", "мн. ч."]) assert.ok(card.note.includes(marker), marker);
  const lessonCards = JSON.parse(await readFile("scripts/mobile-data/lesson-13.json", "utf8"));
  const notes = lessonCards[0].notes.join(" ");
  for (const marker of ["π.μ. = a.m.", "μ.μ. = p.m.", "π.μ. ≠ p.m."]) assert.ok(card.note.includes(marker), marker);
  const dayNotes = lessonCards[1].notes.join(" ");
  assert.ok(dayNotes.includes("π.μ. ≠ английское p.m."));
  assert.ok(dayNotes.includes("23:05 = 11:05 μ.μ."));
  for (const marker of ["12:30", "17:00", "21:00", "το μεσημέρι", "το απόγευμα", "το βράδυ"]) {
    assert.ok(card.note.includes(marker), marker);
    assert.ok(dayNotes.includes(marker), marker);
  }
  for (const marker of ["2 и 5–12", "στη [sti]", "στις [stis]"]) assert.ok(notes.includes(marker), marker);
  const topic = data.topics.time;
  assert.equal(topic.title, "Время");
  assert.equal(topic.total, 16);
  assert.equal(new Set(topic.ids).size, 16);
  for (const id of ["Τι ώρα είναι;", "Τι ώρα;", "δύο και μισή", "τρεις παρά τέταρτο", "στη μία", "στις τρεις", "σε μισή ώρα"]) {
    assert.ok(topic.ids.includes(id), id);
    assert.ok(data.words.some(word => word.id === id && word.core && word.lesson === "13"), id);
  }
  const source = await readFile("docs/assets/javascripts/vocabulary-trainer.js", "utf8");
  assert.ok(source.includes("vocabulary.topics[lesson].title"));
});

test("core prepositions distinguish place from future time interval", async () => {
  const core = JSON.parse(await readFile("scripts/mobile-data/core.json", "utf8"));
  const card = core.find(card => card.title === "Артикли и предлоги");
  const text = card.rows.join(" ");
  assert.ok(text.includes("место: в / на / к; время: через"));
  assert.ok(text.includes("σε μία ώρα [se ˈmia ˈora] — через час"));
  assert.ok(card.sources.includes("scripts/mobile-data/lesson-13.json"));
  const reference = await readFile("docs/reference/grammar/prepositions-accusative.md", "utf8");
  for (const marker of ["#se-time", "σε μισή ώρα", "στις τρεις", "через два дня"]) assert.ok(reference.includes(marker));
});

test("calendar topic covers all days, months and accusative answers without duplicate Saturday", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  const topic = data.topics.calendar;
  assert.equal(topic.total, 38);
  assert.equal(topic.core, 38);
  assert.equal(new Set(topic.ids).size, 38);
  const selection = JSON.parse(await readFile("scripts/topic-data/calendar.json", "utf8"));
  assert.deepEqual(selection.groups.map(group => group.ids.length), [7, 12, 6, 12, 1]);
  assert.equal(topic.ids.filter(id => id === "το Σάββατο").length, 1);
  for (const id of ["τη Δευτέρα", "την Κυριακή", "τον Ιανουάριο", "τον Δεκέμβριο"]) {
    assert.ok(topic.ids.includes(id));
    assert.ok(data.words.some(word => word.id === id && word.lesson === "13"));
  }
  const core = JSON.parse(await readFile("scripts/mobile-data/core.json", "utf8"));
  const card = core.find(card => card.title === "Календарь: дни, месяцы, сезоны");
  assert.equal(card.columns, 2);
  assert.ok(card.sources.includes("scripts/mobile-data/lesson-13.json"));
  const rows = card.rows.join(" ");
  for (const marker of ["Δευτέρα", "Κυριακή", "Ιανουάριο", "Δεκέμβριο", "Без σε"]) assert.ok(rows.includes(marker));
  for (const marker of ["την άνοιξη", "[tin ˈaniksi]", "το καλοκαίρι", "[to kaloˈkeri]", "το φθινόπωρο", "[to fθiˈnoporo]", "τον χειμώνα", "[ton hiˈmona]"]) assert.ok(rows.includes(marker), marker);
});

test("lesson 14 includes weather, AB verbs and frequency with explicit review", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  const fresh = data.words.filter(word => word.lesson === "14");
  assert.equal(fresh.length, 68);
  assert.equal(fresh.filter(word => word.core).length, 63);
  for (const id of ["φταίω", "καίω", "κλαίω", "η βροχή", "συνήθως", "ποτέ", "το δέντρο", "ανθίζω"]) assert.ok(fresh.some(word => word.id === id), id);
  for (const id of ["πάω", "ακούω", "λέω", "τρώω", "ο χειμώνας"]) assert.ok(data.words.find(word => word.id === id).lessons.includes("14"), id);
  const cards = JSON.parse(await readFile("scripts/mobile-data/lesson-14.json", "utf8"));
  assert.equal(cards.length, 4);
  assert.ok(cards[0].rows.some(row => row[0] === "Ο ήλιος λάμπει." && row[1] === "o ˈilios ˈlambi"));
  const shine = fresh.find(word => word.id === "λάμπω");
  assert.ok(shine.core);
  assert.ok(shine.note.includes("λάμπει [ˈlambi]"));
  const core = JSON.parse(await readFile("scripts/mobile-data/core.json", "utf8"));
  assert.ok(core.find(card => card.title === "Погода").rows.some(row => row.includes("Ο ήλιος λάμπει.")));
  for (const title of ["Короткие глаголы АВ", "Погода", "Как часто: от никогда до всегда"]) assert.ok(core.some(card => card.title === title));
});

test("core activities card selects learned phrases including swimming and skiing", async () => {
  const cards = JSON.parse(await readFile("scripts/mobile-data/core.json", "utf8"));
  const card = cards.find(card => card.title === "Занятия и отдых: что я делаю");
  assert.equal(card.rows.length, 9);
  assert.ok(card.sources.includes("scripts/mobile-data/lesson-14.json"));
  for (const phrase of ["κάνω μπάνιο στη θάλασσα", "[ˈkano ˈbanyo sti ˈθalasa]", "κάνω σκι", "[ˈkano ski]", "πάω βόλτα", "πάω για ψώνια", "πάω για ύπνο"]) assert.ok(card.rows.join(" ").includes(phrase), phrase);
});

test("lesson 15 covers frequency and the precise four-part assignment", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  const fresh = data.words.filter(word => word.lesson === "15");
  assert.equal(fresh.length, 24);
  assert.equal(fresh.filter(word => word.core).length, 24);
  for (const id of ["παραγγέλνω", "γυρίζω", "επιστρέφω", "κάνω ντους", "παίρνω έναν υπνάκο", "η φορά", "όταν"]) {
    assert.ok(fresh.some(word => word.id === id), id);
  }
  for (const id of ["κοιμάμαι", "περνάω", "ποτέ", "συνήθως", "κάνει ζέστη"]) {
    const word = data.words.find(word => word.id === id);
    assert.ok(word.lessons.includes("15"), id);
    assert.notEqual(word.lesson, "15", id);
  }
  const cards = JSON.parse(await readFile("scripts/mobile-data/lesson-15.json", "utf8"));
  assert.equal(cards.length, 2);
  assert.ok(cards[0].rows.some(row => row[0].includes("Δεν βλέπω ποτέ")));
  const homework = await readFile("docs/homework/lesson-15-current.md", "utf8");
  for (const text of ["12 пропусков", "восемь предложений", "четыре ответа", "девять строк", "следующему четвергу", "70 записей"]) {
    assert.ok(homework.includes(text), text);
  }
  const lesson = await readFile("docs/lessons/lesson-15-current.md", "utf8");
  assert.ok(lesson.includes("Вся таблица привычек"));
  assert.ok(lesson.includes("παραγγέλνω φαγητό απ’ έξω"));
  assert.ok(lesson.includes("γύρω στα μεσάνυχτα"));
});

test("weather topic covers all months, seasons and assigned activities in three directions", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  const topic = data.topics.weather;
  assert.equal(topic.total, 70);
  assert.equal(topic.core, 70);
  assert.equal(new Set(topic.ids).size, 70);
  assert.equal(topic.afterLesson, "14");
  assert.deepEqual([...topic.directions], ["greek-to-russian", "russian-to-greek", "writing"]);
  const spec = JSON.parse(await readFile("scripts/topic-data/weather.json", "utf8"));
  assert.equal(spec.groups.find(group => group.title === "Месяцы").ids.length, 12);
  assert.equal(spec.groups.find(group => group.title === "Когда: месяцы").ids.length, 12);
  for (const id of ["την άνοιξη", "τον χειμώνα", "το καλοκαίρι", "το φθινόπωρο",
    "κάνω μπάνιο στη θάλασσα", "κάνω σκι", "πίνω κρύο νερό", "τρώω παγωτό",
    "ο ήλιος λάμπει", "τρώμε παγωτά", "πηγαίνουμε για κολύμπι στη θάλασσα", "κάνω διακοπές",
    "τα λουλούδια ανθίζουν", "τα δέντρα πρασινίζουν"]) {
    assert.ok(topic.ids.includes(id), id);
    assert.equal(data.words.filter(word => word.id === id).length, 1, id);
  }
  const { compare, variants } = await import("../docs/assets/javascripts/vocabulary-writing.js").then(module => module.default);
  for (const id of topic.ids) assert.equal(compare(id, variants(id)).kind, "correct", id);
});

test("lesson repetitions reuse stable vocabulary ids and accurate counts", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  assert.equal(new Set(data.words.map(word => word.id)).size, data.total);
  for (const [lesson, counts] of Object.entries(data.lessons)) {
    const words = data.words.filter(word => word.lessons.includes(lesson));
    assert.equal(words.length, counts.total);
    assert.equal(words.filter(word => word.core).length, counts.core);
  }
  const doctor = data.words.find(word => word.id === "ο γιατρός / η γιατρός");
  assert.equal(doctor.lesson, "07");
  assert.ok(doctor.lessons.includes("10"));
  assert.equal(data.words.filter(word => word.id === doctor.id).length, 1);
  assert.equal(data.lessons["10"].total, 118);
  const source = await readFile("docs/assets/javascripts/vocabulary-trainer.js", "utf8");
  assert.ok(source.includes("selection.belongsToSet(word, activeLesson, activeCoverage, vocabulary.topics)"));
});

test("dictation topic contains only existing unique nouns and covers people and places", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  const topic = data.topics.professions;
  const selection = JSON.parse(await readFile("scripts/topic-data/professions.json", "utf8"));
  const expected = selection.groups.flatMap(group => group.ids);
  assert.deepEqual([...topic.ids], expected);
  assert.equal(topic.total, 84);
  assert.equal(new Set(topic.ids).size, topic.total);
  for (const id of topic.ids) {
    assert.ok(data.words.some(word => word.id === id));
    assert.match(id, /^(ο|η|το) /u);
  }
  for (const id of ["ο γυμναστής", "η γυμνάστρια", "το γυμναστήριο", "ο φούρναρης", "ο φούρνος", "η κομμώτρια", "η πωλήτρια", "ο προγραμματιστής", "η πληροφορική"]) {
    assert.ok(topic.ids.includes(id), id);
  }
  for (const id of ["η ηλικία", "η τίγρη", "ο πρόσφυγας", "η σύζυγος"]) {
    assert.ok(!topic.ids.includes(id), id);
  }
  for (const id of ["η πληροφορική", "ο προγραμματιστής"]) {
    const word = data.words.find(word => word.id === id);
    assert.equal(word.core, true);
    assert.ok(word.lessons.includes("10"));
    assert.equal(data.words.filter(word => word.id === id).length, 1);
  }
  const source = await readFile("docs/assets/javascripts/vocabulary-trainer.js", "utf8");
  assert.ok(source.includes('params.get("topic")'));
  assert.ok(source.includes('let activeScope = "core";'));
  assert.ok(!source.includes('activeScope = "all"'));
  assert.ok(source.includes('? requestedDirection : "greek-to-russian"'));
  assert.ok(source.includes('vocabulary.words.filter(belongsToSet).map((word) => word.id)'));
});
