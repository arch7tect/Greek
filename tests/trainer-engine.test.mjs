import assert from "node:assert/strict";
import test from "node:test";

import GreekTrainer from "../docs/assets/javascripts/trainer-engine.js";


const {
  createStore,
  updateCardProgress,
  orderCards,
  countWeakCards,
  summarizeQuizProgress,
  summarizeVocabularyProgress
} = GreekTrainer;


test("an incorrect answer increments errors and resets the streak", () => {
  assert.deepEqual(
    updateCardProgress({ errors: 2, streak: 1 }, false),
    { errors: 3, streak: 0 }
  );
});

test("two consecutive correct answers clear a card from the weak set", () => {
  const first = updateCardProgress({ errors: 2, streak: 0 }, true);
  const second = updateCardProgress(first, true);

  assert.deepEqual(first, { errors: 2, streak: 1 });
  assert.deepEqual(second, { errors: 0, streak: 2 });
});

test("weak cards are shuffled before the remaining cards", () => {
  const cards = [
    { id: "alpha" },
    { id: "beta" },
    { id: "gamma" },
    { id: "delta" }
  ];
  const progress = {
    alpha: { errors: 1, streak: 0 },
    gamma: { errors: 3, streak: 1 }
  };
  const ordered = orderCards(cards, progress, () => 0.999);

  assert.deepEqual(ordered.map((card) => card.id), ["alpha", "gamma", "beta", "delta"]);
});

test("the unknown answer is recorded as an error", () => {
  assert.deepEqual(
    updateCardProgress(undefined, false),
    { errors: 1, streak: 0 }
  );
});

test("storage failures and corrupted JSON fall back to in-memory state", () => {
  const corrupted = {
    getItem: () => "{broken",
    setItem: () => {}
  };
  const throwing = {
    getItem: () => { throw new Error("blocked"); },
    setItem: () => { throw new Error("blocked"); }
  };

  assert.deepEqual(createStore("test", corrupted).get(), {});
  const store = createStore("test", throwing);
  store.set({ mode: { alpha: { errors: 1, streak: 0 } } });
  assert.deepEqual(store.get(), { mode: { alpha: { errors: 1, streak: 0 } } });
});

test("stale card ids do not affect the weak-card count", () => {
  const cards = [{ id: "alpha" }, { id: "beta" }];
  const progress = {
    alpha: { errors: 1, streak: 0 },
    removed: { errors: 10, streak: 0 }
  };

  assert.equal(countWeakCards(cards, progress), 1);
});

test("the store preserves the vocabulary progress format without a wrapper", () => {
  let saved = JSON.stringify({ word: { level: 2, due: 123 } });
  const storage = {
    getItem: () => saved,
    setItem: (_key, value) => { saved = value; }
  };
  const store = createStore("greek-vocabulary-progress-v2", storage);

  assert.deepEqual(store.get(), { word: { level: 2, due: 123 } });
  store.set({ word: { level: 3, due: 456 } });
  assert.deepEqual(JSON.parse(saved), { word: { level: 3, due: 456 } });
});

test("the quiz summary counts only existing cards as confident or weak", () => {
  const cards = [{ id: "alpha" }, { id: "beta" }, { id: "gamma" }];
  const progress = {
    alpha: { errors: 0, streak: 2 },
    beta: { errors: 1, streak: 0 },
    removed: { errors: 5, streak: 0 }
  };

  assert.deepEqual(
    summarizeQuizProgress(cards, progress),
    { total: 3, confident: 1, weak: 1 }
  );
});

test("the quiz summary treats missing progress as untouched", () => {
  assert.deepEqual(
    summarizeQuizProgress([{ id: "alpha" }], undefined),
    { total: 1, confident: 0, weak: 0 }
  );
});

test("the vocabulary summary counts started, learned, and due words", () => {
  const words = [{ id: "α" }, { id: "β" }, { id: "γ" }];
  const progress = {
    "α": { level: 1, due: 100 },
    "β": { level: 0, due: 0 },
    removed: { level: 3, due: 0 }
  };

  assert.deepEqual(
    summarizeVocabularyProgress(words, progress, 50),
    { total: 3, started: 2, learned: 1, due: 1 }
  );
});

test("a weak card remains first after the store is recreated", () => {
  let saved = "{}";
  const storage = {
    getItem: () => saved,
    setItem: (_key, value) => { saved = value; }
  };
  const firstStore = createStore("greek-trainer:alphabet:v1", storage);
  firstStore.set({
    "letter-to-sound": { alpha: { errors: 1, streak: 0 } }
  });

  const restored = createStore("greek-trainer:alphabet:v1", storage).get();
  const cards = [{ id: "beta" }, { id: "alpha" }, { id: "gamma" }];
  const ordered = orderCards(cards, restored["letter-to-sound"], () => 0.999);

  assert.equal(ordered[0].id, "alpha");
});
