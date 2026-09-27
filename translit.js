// Romanized-Nepali -> Devanagari, for the website's "Try it" box.
// A line-for-line port of the app engine (nepali_typing: NepaliTransliterator/Mapping.swift +
// Transliterator.swift). Keep the tables in sync with those files.
(function (global) {
  "use strict";

  var HALANT = "्";

  var CONSONANTS = {
    k: "क", kh: "ख", g: "ग", gh: "घ", G: "घ", ng: "ङ",
    c: "च", ch: "च", chh: "छ", x: "छ", j: "ज", jh: "झ", J: "झ", Jh: "झ", Y: "ञ",
    T: "ट", Th: "ठ", D: "ड", Dh: "ढ", N: "ण",
    t: "त", th: "थ", d: "द", dh: "ध", n: "न",
    p: "प", ph: "फ", f: "फ", b: "ब", bh: "भ", m: "म",
    y: "य", r: "र", l: "ल", w: "व", v: "व",
    S: "श", Sh: "ष", SA: "ष", s: "स", h: "ह",
    X: "क्ष", ksh: "क्ष", kX: "क्ष",
    Gy: "ज्ञ", z: "झ"
  };

  var INDEPENDENT_VOWELS = {
    a: "अ", aa: "आ", A: "आ",
    i: "इ", ii: "ई", ee: "ई", I: "ई",
    u: "उ", uu: "ऊ", oo: "ऊ", U: "ऊ",
    R: "ऋ", Ri: "ऋ", ri: "ऋ",
    e: "ए",
    ai: "ऐ", E: "ऐ",
    o: "ओ",
    au: "औ", O: "औ",
    om: "ॐ", Om: "ॐ", OM: "ॐ", oM: "ॐ"
  };

  var MATRAS = {
    a: "",
    aa: "ा",
    i: "ि",
    ii: "ी", ee: "ी",
    u: "ु",
    uu: "ू", oo: "ू",
    R: "ृ", Ri: "ृ", ri: "ृ",
    e: "े",
    ai: "ै",
    o: "ो",
    au: "ौ"
  };

  var SPECIALS = {
    "*": "ं", "**": "ँ", ":": "ः", ";": "्",
    q: "ं", Q: "्", ".": "।",
    M: "ं", C: "ँ", H: "ः", P: "।"
  };

  var DIGITS = "०१२३४५६७८९";

  function transliterate(input, convertDigits) {
    var n = input.length, out = "", i = 0, lastWasConsonant = false, hit;

    function matchLongest(table, maxLen) {
      for (var len = Math.min(maxLen, n - i); len >= 1; len--) {
        var key = input.substr(i, len);
        if (Object.prototype.hasOwnProperty.call(table, key)) return [table[key], len];
      }
      return null;
    }

    while (i < n) {
      if ((hit = matchLongest(CONSONANTS, 3))) {
        if (lastWasConsonant) out += HALANT;
        out += hit[0];
        lastWasConsonant = true;
        i += hit[1];
        continue;
      }
      if (lastWasConsonant) {
        if ((hit = matchLongest(MATRAS, 2))) {
          out += hit[0];
          lastWasConsonant = false;
          i += hit[1];
          continue;
        }
        lastWasConsonant = false;
      }
      if ((hit = matchLongest(INDEPENDENT_VOWELS, 2))) { out += hit[0]; i += hit[1]; continue; }
      if ((hit = matchLongest(SPECIALS, 2))) { out += hit[0]; i += hit[1]; continue; }
      var ch = input.charAt(i);
      if (convertDigits && ch >= "0" && ch <= "9") { out += DIGITS.charAt(+ch); i += 1; continue; }
      out += ch;
      i += 1;
    }
    return out;
  }

  global.NepaliTranslit = { transliterate: transliterate };
  if (typeof module !== "undefined") module.exports = global.NepaliTranslit;
})(typeof window !== "undefined" ? window : globalThis);
