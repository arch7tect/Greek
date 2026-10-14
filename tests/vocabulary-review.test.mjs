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
  assert.equal(core.length, 13);
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
