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
  assert.equal(config.storageKey, "greek-trainer:alphabet:v1");
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
  assert.equal(config.storageKey, "greek-trainer:eimai:v1");
  assertStableIds(config.datasets);
});
