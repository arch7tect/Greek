import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";


const loadConfig = async (dataPath, trainerPath) => {
  let config;
  const root = {
    querySelectorAll: () => [],
    querySelector: () => ({})
  };
  const context = {
    document: { getElementById: () => root },
    window: { GreekTrainer: { createQuiz: (value) => { config = value; } } }
  };
  vm.runInNewContext(await readFile(dataPath, "utf8"), context, { filename: dataPath });
  vm.runInNewContext(await readFile(trainerPath, "utf8"), context, { filename: trainerPath });
  return config;
};


const assertStableIds = (datasets) => {
  Object.values(datasets).forEach((cards) => {
    const ids = cards.map((card) => card.id);
    assert.ok(ids.every(Boolean));
    assert.equal(new Set(ids).size, ids.length);
    cards.forEach((card) => assert.match(card.lesson, /^\d{2}$/));
  });
};


test("alphabet datasets retain their card counts and stable ids", async () => {
  const config = await loadConfig(
    "docs/assets/data/alphabet-data.js",
    "docs/assets/javascripts/alphabet-trainer.js"
  );

  assert.deepEqual(
    Object.fromEntries(Object.entries(config.datasets).map(([mode, cards]) => [mode, cards.length])),
    { "letter-to-sound": 24, "sound-to-letter": 21, combinations: 18 }
  );
  assert.equal(config.storageKey, "greek-trainer:alphabet:v2");
  assertStableIds(config.datasets);
});


test("numbers datasets retain their card counts and stable ids", async () => {
  const config = await loadConfig(
    "docs/assets/data/numbers-data.js",
    "docs/assets/javascripts/numbers-trainer.js"
  );

  assert.deepEqual(
    Object.fromEntries(Object.entries(config.datasets).map(([mode, cards]) => [mode, cards.length])),
    { "digit-to-word": 11, "word-to-digit": 11, "digit-to-word-100": 18, "word-to-digit-100": 18, composite: 11, phone: 6, addresses: 3 }
  );
  assert.equal(config.storageKey, "greek-trainer:numbers:v2");
  assertStableIds(config.datasets);
});


test("accusative datasets retain their card counts and stable ids", async () => {
  const config = await loadConfig(
    "docs/assets/data/accusative-data.js",
    "docs/assets/javascripts/accusative-trainer.js"
  );

  assert.deepEqual(
    Object.fromEntries(Object.entries(config.datasets).map(([mode, cards]) => [mode, cards.length])),
    { apo: 13, se: 11, prepositions: 10 }
  );
  assert.equal(config.storageKey, "greek-trainer:accusative:v2");
  assertStableIds(config.datasets);
});


test("greetings keeps existing modes and starts with the lesson 01 handout", async () => {
  const config = await loadConfig(
    "docs/assets/data/greetings-data.js",
    "docs/assets/javascripts/greetings-trainer.js"
  );

  assert.deepEqual(
    Object.fromEntries(Object.entries(config.datasets).map(([mode, cards]) => [mode, cards.length])),
    { "lesson-01": 8, "lesson-01-dialogue": 6, greet: 12, meet: 13, "how-are-you": 10 }
  );
  assert.equal(config.storageKey, "greek-trainer:greetings:v2");
  assert.equal(config.defaultMode, "lesson-01");
  assertStableIds(config.datasets);
  const phrases = config.datasets["lesson-01"];
  const answers = new Set(phrases.map((card) => card.answer));
  for (const card of [...phrases, ...config.datasets["lesson-01-dialogue"]]) {
    assert.equal(card.lesson, "01");
    assert.ok(card.prompt && card.detail);
    assert.match(card.answer, /\[[^\]]+\]/);
  }
  for (const card of config.datasets["lesson-01-dialogue"]) {
    assert.match(card.context, /\[[^\]]+\]/);
    assert.equal(card.choices.length, 4);
    assert.equal(new Set(card.choices).size, 4);
    assert.equal(card.choices.filter((choice) => choice === card.answer).length, 1);
    assert.ok(card.choices.every((choice) => answers.has(choice)));
  }
  const informal = config.datasets["lesson-01-dialogue"].find((card) => card.id === "name-informal");
  const formal = config.datasets["lesson-01-dialogue"].find((card) => card.id === "name-formal");
  assert.equal(informal.answer, formal.answer);
  assert.notEqual(informal.context, formal.context);
});


test("first-conjugation datasets retain their card counts and stable ids", async () => {
  const config = await loadConfig(
    "docs/assets/data/verbs-a-data.js",
    "docs/assets/javascripts/verbs-a-trainer.js"
  );

  assert.deepEqual(
    Object.fromEntries(Object.entries(config.datasets).map(([mode, cards]) => [mode, cards.length])),
    { endings: 6, meno: 6, phrases: 11 }
  );
  assert.equal(config.storageKey, "greek-trainer:verbs-a:v2");
  config.datasets.phrases.forEach((card) => {
    assert.equal(card.choices.length, 6);
    assert.ok(card.choices.includes(card.answer));
  });
  assertStableIds(config.datasets);
});


test("eimai datasets retain their card counts and stable ids", async () => {
  const config = await loadConfig(
    "docs/assets/data/eimai-data.js",
    "docs/assets/javascripts/eimai-trainer.js"
  );

  assert.deepEqual(
    Object.fromEntries(Object.entries(config.datasets).map(([mode, cards]) => [mode, cards.length])),
    { "pronoun-to-form": 6, "form-to-pronoun": 5, phrases: 6 }
  );
  assert.equal(config.storageKey, "greek-trainer:eimai:v2");
  assertStableIds(config.datasets);
});
