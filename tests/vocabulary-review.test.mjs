import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

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
  assert.equal(data.lessons["10"].total, 116);
  const source = await readFile("docs/assets/javascripts/vocabulary-trainer.js", "utf8");
  assert.ok(source.includes("(word.lessons || [word.lesson]).includes(activeLesson)"));
});

test("dictation topic contains only existing unique nouns and covers people and places", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  const topic = data.topics.professions;
  const selection = JSON.parse(await readFile("scripts/topic-data/professions.json", "utf8"));
  const expected = selection.groups.flatMap(group => group.ids);
  assert.deepEqual([...topic.ids], expected);
  assert.equal(topic.total, 82);
  assert.equal(new Set(topic.ids).size, topic.total);
  for (const id of topic.ids) {
    assert.ok(data.words.some(word => word.id === id));
    assert.match(id, /^(ο|η|το) /u);
  }
  for (const id of ["ο γυμναστής", "η γυμνάστρια", "το γυμναστήριο", "ο φούρναρης", "ο φούρνος", "η κομμώτρια", "η πωλήτρια"]) {
    assert.ok(topic.ids.includes(id), id);
  }
  for (const id of ["η ηλικία", "η τίγρη", "ο πρόσφυγας", "η σύζυγος"]) {
    assert.ok(!topic.ids.includes(id), id);
  }
  const source = await readFile("docs/assets/javascripts/vocabulary-trainer.js", "utf8");
  assert.ok(source.includes('params.get("topic")'));
  assert.ok(source.includes('let activeScope = "core";'));
  assert.ok(!source.includes('activeScope = "all"'));
  assert.ok(source.includes('? requestedDirection : "greek-to-russian"'));
  assert.ok(source.includes('vocabulary.words.filter(belongsToSet).map((word) => word.id)'));
});
