window.GREEK_VERBS_B1_DATA = (() => {
  const persons = [
    "εγώ [eˈɣo]",
    "εσύ [eˈsi]",
    "αυτός / αυτή / αυτό [afˈtos / afˈti / afˈto]",
    "εμείς [eˈmis]",
    "εσείς [eˈsis]",
    "αυτοί / αυτές / αυτά [afˈti / afˈtes / afˈta]"
  ];
  const endings = [
    ["άω", "ao"],
    ["άς", "as"],
    ["άει", "ai"],
    ["άμε", "ame"],
    ["άτε", "ate"],
    ["άνε", "ane"]
  ];
  const forms = (stem, stemTr) => endings.map(
    ([ending, endingTr]) => `${stem}${ending} [${stemTr}${endingTr}]`
  );
  const verbs = {
    "μιλάω": forms("μιλ", "miˈl"),
    "διψάω": forms("διψ", "ðiˈps"),
    "αγαπάω": forms("αγαπ", "aɣaˈp"),
    "τραγουδάω": forms("τραγουδ", "traɣuˈð"),
    "πεινάω": forms("πειν", "piˈn"),
    "βοηθάω": forms("βοηθ", "voiˈθ"),
    "ρωτάω": forms("ρωτ", "roˈt"),
    "πονάω": forms("πον", "poˈn"),
    "σταματάω": forms("σταματ", "stamaˈt"),
    "φοράω": forms("φορ", "foˈr")
  };
  const dictionaryForms = {
    "μιλάω": "μιλάω [miˈlao]",
    "διψάω": "διψάω [ðiˈpsao]",
    "αγαπάω": "αγαπάω [aɣaˈpao]",
    "τραγουδάω": "τραγουδάω [traɣuˈðao]",
    "πεινάω": "πεινάω [piˈnao]",
    "βοηθάω": "βοηθάω [voiˈθao]",
    "ρωτάω": "ρωτάω [roˈtao]",
    "πονάω": "πονάω [poˈnao]",
    "σταματάω": "σταματάω [stamaˈtao]",
    "φοράω": "φοράω [foˈrao]"
  };

  const conjugationRows = [
    ["conj-thirst-we", "διψάω", 3],
    ["conj-love-they", "αγαπάω", 5],
    ["conj-sing-you-pl", "τραγουδάω", 4],
    ["conj-hunger-she", "πεινάω", 2],
    ["conj-help-he", "βοηθάω", 2],
    ["conj-ask-they", "ρωτάω", 5],
    ["conj-hurt-it", "πονάω", 2],
    ["conj-stop-you-pl", "σταματάω", 4],
    ["conj-wear-we", "φοράω", 3],
    ["conj-love-you", "αγαπάω", 1],
    ["conj-help-i", "βοηθάω", 0],
    ["conj-ask-we", "ρωτάω", 3]
  ];

  const typeA = "тип Α: безударное -ω [o]";
  const typeB1 = "тип Β1: ударное -άω / -ώ [-ˈao / -ˈo]";
  const typeRows = [
    ["type-work", "δουλεύω [ðuˈlevo]", typeA],
    ["type-learn", "μαθαίνω [maˈθeno]", typeA],
    ["type-travel", "ταξιδεύω [taksiˈðevo]", typeA],
    ["type-go", "πηγαίνω [piˈyeno]", typeA],
    ["type-play", "παίζω [ˈpezo]", typeA],
    ["type-cook", "μαγειρεύω [mayiˈrevo]", typeA],
    ["type-speak", "μιλάω [miˈlao]", typeB1],
    ["type-thirst", "διψάω [ðiˈpsao]", typeB1],
    ["type-love", "αγαπάω [aɣaˈpao]", typeB1],
    ["type-sing", "τραγουδάω [traɣuˈðao]", typeB1],
    ["type-ask", "ρωτάω [roˈtao]", typeB1],
    ["type-stop", "σταματάω [stamaˈtao]", typeB1]
  ];

  return {
    storageKey: "greek-trainer:verbs-b1:v2",
    modes: [
      {
        key: "milao",
        title: "Формы μιλάω",
        cards: persons.map((person, index) => ({
          id: `milao-${index + 1}`,
          lesson: "08",
          prompt: person,
          answer: verbs["μιλάω"][index],
          choices: verbs["μιλάω"],
          detail: index === 0
            ? `${person} → ${verbs["μιλάω"][index]}; краткий вариант: μιλώ [miˈlo].`
            : index === 2
              ? `${person} → ${verbs["μιλάω"][index]}; краткий вариант: μιλά [miˈla].`
              : index === 5
                ? `${person} → ${verbs["μιλάω"][index]}; нейтральный вариант: μιλούν [miˈlun].`
                : `${person} → ${verbs["μιλάω"][index]}.`
        }))
      },
      {
        key: "conjugation",
        title: "Другие глаголы Β1",
        cards: conjugationRows.map(([id, verb, personIndex]) => ({
          id,
          lesson: "08",
          prompt: persons[personIndex],
          context: `Словарная форма: ${dictionaryForms[verb]}`,
          answer: verbs[verb][personIndex],
          choices: verbs[verb],
          detail: `${persons[personIndex]} + ${dictionaryForms[verb]} → ${verbs[verb][personIndex]}.`
        }))
      },
      {
        key: "contrast",
        title: "Α или Β1",
        cards: typeRows.map(([id, prompt, answer]) => ({
          id,
          lesson: "08",
          prompt,
          answer,
          choices: [typeA, typeB1],
          detail: answer === typeA
            ? `${prompt}: словарное -ω [o] без ударения, поэтому это тип Α.`
            : `${prompt}: ударение падает на -άω / -ώ [-ˈao / -ˈo], поэтому это тип Β1.`
        }))
      }
    ]
  };
})();
