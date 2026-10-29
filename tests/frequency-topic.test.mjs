import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("frequency practice uses learned expressions and accepts every sometimes variant in writing", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  vm.runInNewContext(await readFile("docs/assets/javascripts/vocabulary-writing.js", "utf8"), context);
  const data = context.window.GREEK_VOCABULARY;
  const topic = data.topics.frequency;
  assert.equal(topic.ids.length, 10);
  assert.equal(new Set(topic.ids).size, 10);
  assert.equal(topic.afterLesson, "15");
  assert.deepEqual(Array.from(topic.directions), ["greek-to-russian", "russian-to-greek", "writing"]);
  for (const id of topic.ids) {
    const word = data.words.find(word => word.id === id);
    assert.ok(word?.core, id);
    assert.ok(Number(word.lesson) <= 15, id);
  }
  for (const id of ["ποτέ", "σχεδόν ποτέ", "σπάνια", "μερικές φορές", "συχνά", "πολλές φορές", "συνήθως", "σχεδόν πάντα", "πάντα"]) {
    assert.ok(topic.ids.includes(id), id);
  }
  const { variants, compare } = context.window.GreekWriting;
  const expected = variants("καμιά φορά / κάπου κάπου / πότε πότε");
  for (const answer of ["καμιά φορά", "κάπου κάπου", "πότε πότε"]) {
    assert.equal(compare(answer, expected).kind, "correct");
  }
});
