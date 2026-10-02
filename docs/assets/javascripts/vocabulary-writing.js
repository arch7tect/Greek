(() => {
  const letters = ["αά", "β", "γ", "δ", "εέ", "ζ", "ηή", "θ", "ιίϊΐ", "κ", "λ", "μ", "ν", "ξ", "οό", "π", "ρ", "σς", "τ", "υύϋΰ", "φ", "χ", "ψ", "ωώ"];
  const normalize = (text) => text.normalize("NFC").toLocaleLowerCase("el")
    .trim().replace(/\s+/g, " ");
  // Keep diaeresis: it changes pronunciation, unlike a missing/misplaced accent.
  const withoutStress = (text) => normalize(text).normalize("NFD")
    .replace(/\u0301/g, "").normalize("NFC");
  const variants = (greek) => {
    const parts = greek.split(/\s*\/\s*/).map(normalize).filter(Boolean);
    const article = parts[0]?.match(/^(ο|η|το|οι|τα)\s+/)?.[0];
    return parts.map((part) => article && !/^(ο|η|το|οι|τα)\s+/.test(part)
      ? article + part : part);
  };
  const compare = (text, accepted) => {
    const actual = normalize(text);
    if (!actual) return { kind: "empty" };
    if (accepted.includes(actual)) return { kind: "correct", expected: actual };
    const accentMatch = accepted.find((value) => withoutStress(value) === withoutStress(actual));
    if (accentMatch) return { kind: "stress", expected: accentMatch };
    return { kind: "letters", expected: accepted[0] };
  };
  const api = { letters, normalize, variants, compare };
  if (typeof window !== "undefined") window.GreekWriting = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
