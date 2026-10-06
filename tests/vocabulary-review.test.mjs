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
