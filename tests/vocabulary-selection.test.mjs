import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const context = { window: {} };
vm.runInNewContext(await readFile("docs/assets/data/vocabulary-data.js", "utf8"), context);
vm.runInNewContext(await readFile("docs/assets/javascripts/vocabulary-selection.js", "utf8"), context);
const data = context.window.GREEK_VOCABULARY;
const { belongsToSet, originLabel } = context.window.GreekVocabularySelection;

test("every lesson separates first introductions from explicit review without changing ids", () => {
  for (const lesson of Object.keys(data.lessons)) {
    const fresh = data.words.filter(word => belongsToSet(word, lesson, "new", data.topics));
    const review = data.words.filter(word => belongsToSet(word, lesson, "review", data.topics));
    assert.deepEqual(fresh.map(word => word.id), data.words.filter(word => word.lesson === lesson).map(word => word.id));
    assert.equal(review.length, data.lessons[lesson].total);
    assert.ok(fresh.every(word => review.includes(word)), lesson);
    assert.ok(review.every(word => word.lessons.includes(lesson)), lesson);
    assert.equal(new Set(review.map(word => word.id)).size, review.length);
  }
});

test("lesson 11 defaults to 56 new words and optionally includes its 47 reviews", () => {
  const fresh = data.words.filter(word => belongsToSet(word, "11", "new", data.topics));
  const review = data.words.filter(word => belongsToSet(word, "11", "review", data.topics));
  assert.equal(fresh.length, 56);
  assert.equal(fresh.filter(word => word.core).length, 50);
  assert.equal(review.length, 103);
  assert.ok(!fresh.some(word => word.lesson === "01"));
  const book = data.words.find(word => word.id === "το βιβλίο");
  assert.equal(belongsToSet(book, "11", "new", data.topics), false);
  assert.equal(belongsToSet(book, "11", "review", data.topics), true);
  assert.equal(originLabel(book, "11", data.topics), "Повторение из урока 01 · Урок 11");
  assert.equal(originLabel(fresh[0], "11", data.topics), "Новое слово урока 11");
});

test("topic selection ignores lesson coverage and retains all professions", () => {
  for (const coverage of ["new", "review"]) {
    const words = data.words.filter(word => belongsToSet(word, "professions", coverage, data.topics));
    assert.equal(words.length, data.topics.professions.total);
    assert.equal(words.length, 84);
    assert.ok(words.every(word => originLabel(word, "professions", data.topics).startsWith("Впервые: урок ")));
  }
});

test("legacy words without a review array still filter correctly", () => {
  const word = { lesson: "03" };
  assert.equal(belongsToSet(word, "03", "review"), true);
  assert.equal(belongsToSet(word, "11", "review"), false);
  assert.equal(belongsToSet(word, "03", "new"), true);
});
