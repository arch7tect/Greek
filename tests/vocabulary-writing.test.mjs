import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { letters, normalize, variants, compare } = require("../docs/assets/javascripts/vocabulary-writing.js");

test("alphabetical groups keep every variant beside its base letter", () => {
  assert.equal(letters.map((group) => group[0]).join(""), "αβγδεζηθικλμνξοπρστυφχψω");
  assert.equal(letters.join(""), "αάβγδεέζηήθιίϊΐκλμνξοόπρσςτυύϋΰφχψωώ");
});
test("case, whitespace and canonical Unicode are normalized, not Greek spelling", () => {
  assert.equal(normalize("  ΤΟ  ΒΙΒΛΙΟ\u0301 "), "το βιβλιό");
  assert.equal(compare("ΤΟ   ΒΙΒΛΊΟ", variants("το βιβλίο")).kind, "correct");
  assert.equal(compare("το βιβλιο", variants("το βιβλίο")).kind, "stress");
  assert.equal(compare("το βίβλιο", variants("το βιβλίο")).kind, "stress");
  assert.equal(compare("το βιυλίο", variants("το βιβλίο")).kind, "letters");
  assert.equal(compare("βιβλίο", variants("το βιβλίο")).kind, "letters");
  assert.equal(compare("to vivlio", variants("το βιβλίο")).kind, "letters");
  assert.equal(compare("  ", variants("το βιβλίο")).kind, "empty");
});
test("diaeresis is preserved when testing an accent-only error", () => {
  assert.equal(compare("Μαΐου", variants("Μαΐου")).kind, "correct");
  assert.equal(compare("Μαϊου", variants("Μαΐου")).kind, "stress");
  assert.equal(compare("Μαίου", variants("Μαΐου")).kind, "letters");
});
test("slash alternatives are accepted individually with their articles", () => {
  assert.deepEqual(variants("η αδερφή / η αδελφή"), ["η αδερφή", "η αδελφή"]);
  assert.deepEqual(variants("η αδερφή / αδελφή"), ["η αδερφή", "η αδελφή"]);
  assert.equal(compare("επτά", variants("εφτά / επτά")).kind, "correct");
  assert.equal(compare("η γιατρός", variants("ο γιατρός / η γιατρός")).kind, "correct");
  assert.equal(compare("οχτο", variants("οχτώ / οκτώ")).kind, "letters");
});
