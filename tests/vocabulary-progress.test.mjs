import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { createVocabularyProgress } = require("../docs/assets/javascripts/trainer-engine.js");
const storage = (initial = {}) => {
  const values = new Map(Object.entries(initial).map(([key, value]) => [key, JSON.stringify(value)]));
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
};

test("migration retains old reading and writing but does not mark other skills learned", () => {
  const disk = storage({
    "greek-vocabulary-progress-v3": { book: { level: 2, due: 100 } },
    "greek-vocabulary-writing-progress-v1": { pen: { level: 1, due: 50 } }
  });
  const progress = createVocabularyProgress(disk);
  assert.equal(progress.get("greek-to-russian").book.level, 2);
  assert.equal(progress.get("writing").pen.level, 1);
  assert.deepEqual(progress.get("russian-to-greek"), {});
  assert.deepEqual(progress.get("article"), {});
  assert.equal(JSON.parse(disk.getItem("greek-vocabulary-progress-v3")).book.level, 2);
});

test("four directions persist independently across reloads", () => {
  const disk = storage();
  const progress = createVocabularyProgress(disk);
  for (const [index, mode] of ["greek-to-russian", "russian-to-greek", "writing", "article"].entries()) {
    progress.set(mode, { book: { level: index + 1, due: index * 100 } });
  }
  const restored = createVocabularyProgress(disk);
  assert.equal(restored.get("greek-to-russian").book.level, 1);
  assert.equal(restored.get("russian-to-greek").book.level, 2);
  assert.equal(restored.get("writing").book.level, 3);
  assert.equal(restored.get("article").book.level, 4);
});

test("reset only selected lesson ids in selected direction, without reimporting legacy progress", () => {
  const disk = storage({ "greek-vocabulary-progress-v3": { book: { level: 5, due: 100 } } });
  const progress = createVocabularyProgress(disk);
  progress.set("writing", { book: { level: 3 }, later: { level: 2 } });
  progress.reset("writing", ["book"]);
  assert.deepEqual(progress.get("writing"), { later: { level: 2 } });
  assert.equal(progress.get("greek-to-russian").book.level, 5);
  progress.reset("greek-to-russian", ["book"]);
  assert.deepEqual(createVocabularyProgress(disk).get("greek-to-russian"), {});
  assert.deepEqual(createVocabularyProgress(disk).get("writing"), { later: { level: 2 } });
});

test("unavailable storage still supports independent progress and reset in memory", () => {
  const progress = createVocabularyProgress({ getItem() { throw Error(); }, setItem() { throw Error(); } });
  progress.set("writing", { book: { level: 1 } });
  assert.deepEqual(progress.get("russian-to-greek"), {});
  progress.reset("writing", ["book"]);
  assert.deepEqual(progress.get("writing"), {});
});
