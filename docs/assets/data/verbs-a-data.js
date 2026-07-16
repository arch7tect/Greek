window.GREEK_VERBS_A_DATA = (() => {
  const endings = [["ω", "o"], ["εις", "is"], ["ει", "i"], ["ουμε", "ume"], ["ετε", "ete"], ["ουν", "un"]];
  const forms = (stem, stemTr) => endings.map(([ending, tr]) => `${stem}${ending} [${stemTr}${tr}]`);
  const verbs = {
    "μένω": forms("μέν", "ˈmen"),
    "έχω": forms("έχ", "ˈeh"),
    "κάνω": forms("κάν", "ˈkan"),
    "διαβάζω": forms("διαβάζ", "ðiaˈvaz"),
    "πηγαίνω": forms("πηγαίν", "piˈyen")
  };
  const persons = [
    "εγώ [eˈɣo]",
    "εσύ [eˈsi]",
    "αυτός / αυτή / αυτό [afˈtos / afˈti / afˈto]",
    "εμείς [eˈmis]",
    "εσείς [eˈsis]",
    "αυτοί / αυτές / αυτά [afˈti / afˈtes / afˈta]"
  ];

  // [id, sentence with gap, verb, person index 0-5, full sentence + transcription]
  const phraseRows = [
    ["ex10-1", "Ο Έλτον είναι από την Αλβανία και τώρα ___ στην Αθήνα.", "μένω", 2, "Ο Έλτον → αυτός → -ει. Ο Έλτον είναι από την Αλβανία και τώρα μένει στην Αθήνα. [o ˈelton ˈine aˈpo tin alvaˈnia ke ˈtora ˈmeni stin aˈθina]"],
    ["ex10-2", "Εσείς ___ μάθημα τώρα;", "έχω", 4, "εσείς → -ετε. Εσείς έχετε μάθημα τώρα; [eˈsis ˈehete ˈmaθima ˈtora?]"],
    ["ex10-3", "Η Ελένη και η Μαρία ___ μάθημα κάθε μέρα.", "έχω", 5, "две женщины → αυτές → -ουν. Η Ελένη και η Μαρία έχουν μάθημα κάθε μέρα. [i eˈleni ke i maˈria ˈehun ˈmaθima ˈkaθe ˈmera]"],
    ["ex10-4a", "Εμείς ___ στην Κυψέλη.", "μένω", 3, "εμείς → -ουμε. Εμείς μένουμε στην Κυψέλη. [eˈmis ˈmenume stin kiˈpseli]"],
    ["ex10-4b", "Εσείς πού ___;", "μένω", 4, "εσείς → -ετε. Εσείς πού μένετε; [eˈsis pu ˈmenete?]"],
    ["ex10-5", "Εγώ και ο Κώστας ___ μάθημα.", "κάνω", 3, "εγώ και ο Κώστας = εμείς → -ουμε. Εγώ και ο Κώστας κάνουμε μάθημα. [eˈɣo ke o ˈkostas ˈkanume ˈmaθima]"],
    ["ex10-6", "Αυτές ___ μία άσκηση.", "κάνω", 5, "αυτές → -ουν. Αυτές κάνουν μία άσκηση. [afˈtes ˈkanun ˈmia ˈaskisi]"],
    ["ex10-7", "Εσύ ___ τον διάλογο.", "διαβάζω", 1, "εσύ → -εις. Εσύ διαβάζεις τον διάλογο. [eˈsi ðiaˈvazis ton ðiˈaloɣo]"],
    ["ex10-8", "Αυτή ___ βιβλίο;", "έχω", 2, "αυτή → -ει. Αυτή έχει βιβλίο; [afˈti ˈehi viˈvlio?]"],
    ["ex10-9", "Εσύ και η Κατερίνα ___ κοντά.", "μένω", 4, "εσύ και η Κατερίνα = εσείς → -ετε. Εσύ και η Κατερίνα μένετε κοντά. [eˈsi ke i kateˈrina ˈmenete koˈnda]"],
    ["ex10-10", "Αυτοί ___ διάλειμμα τώρα.", "έχω", 5, "αυτοί → -ουν. Αυτοί έχουν διάλειμμα τώρα. [afˈti ˈehun ˈðyalima ˈtora]"],
    ["ex10-11", "Εσύ τι ___, Αντόν;", "κάνω", 1, "εσύ → -εις. Εσύ τι κάνεις, Αντόν; [eˈsi ti ˈkanis, aˈndon?]"],
    ["ex10-12", "Εμείς ___ ένα βιβλίο.", "διαβάζω", 3, "εμείς → -ουμε. Εμείς διαβάζουμε ένα βιβλίο. [eˈmis ðiaˈvazume ˈena viˈvlio]"],
    ["ex10-13", "Τα παιδιά ___ βόλτα.", "πηγαίνω", 5, "τα παιδιά → αυτά → -ουν. Τα παιδιά πηγαίνουν βόλτα. [ta peˈðya piˈyenun ˈvolta]"],
    ["ex10-14", "Αυτή ___ Ελληνικά.", "διαβάζω", 2, "αυτή → -ει. Αυτή διαβάζει Ελληνικά. [afˈti ðiaˈvazi eliniˈka]"],
    ["ex10-15", "Αυτοί ___ στο σούπερ μάρκετ.", "πηγαίνω", 5, "αυτοί → -ουν. Αυτοί πηγαίνουν στο σούπερ μάρκετ. [afˈti piˈyenun sto ˈsuper ˈmarket]"],
    ["ex10-16", "Πότε ___ εσείς;", "διαβάζω", 4, "εσείς → -ετε. Πότε διαβάζετε εσείς; [ˈpote ðiaˈvazete eˈsis?]"],
    ["ex10-17", "___ στο σούπερ μάρκετ, Μαρία;", "πηγαίνω", 1, "обращение к Μαρία = εσύ → -εις. Πηγαίνεις στο σούπερ μάρκετ, Μαρία; [piˈyenis sto ˈsuper ˈmarket, maˈria?]"],
    ["ex10-18", "Πού ___ τώρα η Κατερίνα;", "πηγαίνω", 2, "η Κατερίνα → αυτή → -ει. Πού πηγαίνει τώρα η Κατερίνα; [pu piˈyeni ˈtora i kateˈrina?]"],
    ["ex10-19", "Εσύ ___ στον Πειραιά;", "μένω", 1, "εσύ → -εις. Εσύ μένεις στον Πειραιά; [eˈsi ˈmenis ston pireˈa?]"],
    ["ex10-20", "Αυτές δεν ___ ελληνικά.", "διαβάζω", 5, "αυτές → -ουν; δεν стоит перед глаголом. Αυτές δεν διαβάζουν ελληνικά. [afˈtes ðen ðiaˈvazun eliniˈka]"]
  ];

  return {
    storageKey: "greek-trainer:verbs-a:v1",
    modes: [
      {
        key: "endings",
        title: "Окончание → лицо",
        cards: endings.map(([ending, tr], index) => ({
          id: `end-${ending}`,
          prompt: `-${ending} [${tr}]`,
          answer: persons[index],
          detail: `${persons[index]} → ${verbs["μένω"][index]}.`
        }))
      },
      {
        key: "meno",
        title: "Формы μένω",
        cards: persons.map((person, index) => ({
          id: `meno-${index + 1}`,
          prompt: person,
          answer: verbs["μένω"][index],
          detail: `${person} → окончание -${endings[index][0]} [${endings[index][1]}]: ${verbs["μένω"][index]}.`
        }))
      },
      {
        key: "phrases",
        title: "Фраза с пропуском",
        cards: phraseRows.map(([id, prompt, verb, personIndex, detail]) => ({
          id,
          prompt,
          context: `(${verbs[verb][0]})`,
          answer: verbs[verb][personIndex],
          choices: verbs[verb],
          detail
        }))
      }
    ]
  };
})();
