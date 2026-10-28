import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("lesson 16 makes new plural forms and every unannotated object available without duplicating known words", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
  const words = context.window.GREEK_VOCABULARY.words;
  assert.equal(words.filter(word => word.lesson === "16").length, 30);
  for (const id of ["ποιοι / ποιες / ποια", "αυτοί / αυτές / αυτά", "εκείνοι / εκείνες / εκείνα",
    "το μπουφάν", "η φούστα", "το πουκάμισο", "το αναψυκτικό", "το κασκόλ", "ο σκούφος",
    "το καρπούζι", "το πεπόνι", "το ροδάκινο", "το απορρυπαντικό", "τα ρούχα", "το σαπούνι"]) {
    assert.equal(words.filter(word => word.id === id).length, 1, id);
    assert.ok(words.find(word => word.id === id).lessons.includes("16"), id);
  }
  for (const id of ["ποιος / ποια / ποιο", "εκείνος / εκείνη / εκείνο", "το πρωινό", "τα ακουστικά"]) {
    const word = words.find(word => word.id === id);
    assert.notEqual(word.lesson, "16", id);
    assert.ok(word.lessons.includes("16"), id);
  }
  const cards = JSON.parse(await readFile("scripts/mobile-data/lesson-16.json", "utf8"));
  assert.equal(cards.length, 2);
  const questions = JSON.parse(await readFile("scripts/mobile-data/core.json", "utf8"))
    .find(card => card.title === "Вопросительные слова");
  assert.ok(questions.rows.some(row => row.includes("ποιοι / ποιες / ποια")));
  const homework = await readFile("docs/homework/lesson-16-current.md", "utf8");
  for (const marker of ["четыре пункта и девять пропусков", "та же таблица", "По желанию", "№2.2 не назначены"]) {
    assert.ok(homework.includes(marker), marker);
  }
});
