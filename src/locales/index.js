export const translations = {
  pl: {
    title: "Krajobraz energetyczny — atraktory w chorobie dwubiegunowej",
    subtitle: "Klikaj leki aby je wlaczac/wylaczac. Mozesz laczyc wiele naraz. Obserwuj onset i zanik.",
    sections: {
      stabilizers: "Stabilizatory nastroju",
      antipsychotics: "Antypsychotyki",
      psychedelics: "Psychodeliki",
      substances: "Substancje",
      other: "Inne"
    },
    ui: {
      noActive: "⚡ Bez leku: Eutymia to szczyt — kazde zaburzenie straca kulke w manie lub depresje.",
      phaseOnset: " (narasta)",
      phaseSteady: " (stabilny)",
      phaseDecay: " (zanika)",
      phaseOff: " (odstawiony)",
      stressor: "⚡ Stresor",
      gabaOil: "GABA 'OLEJ'",
      mania: "MANIA",
      euthymia: "EUTYMIA",
      depression: "DEPRESJA",
      barrier: "BARIERA D2"
    },
    drugs: {
      lithium: {
        label: "Lit",
        desc: "JEDYNY lek przebudowujacy caly krajobraz. Eutymia staje sie glebokim, stabilnym dolkiem — mania i depresja plytnieja. Reszta lekow tylko zasypuje dolki lub spowalnia kulke.",
        detail: "Najstarszy i najlepiej udokumentowany stabilizator. Jako jedyny wykazuje silne dzialanie neuroprotekcyjne i istotnie obniza ryzyko samobojstwa.",
        sections: [
          { heading: "Udowodnione mechanizmy",
            items: [
              "Szlak inozytolowy — hamuje IMPaze, ograniczajac nadmierna sygnalizacje w pobudzonych neuronach",
              "Blokada GSK-3beta — stabilizuje plastycznosc synaptyczna i rytmy dobowe (kluczowe w ChAD)",
              "Neuroprotekcja — zwieksza BDNF, odwraca zanik istoty szarej w hipokampie i korze przedczolowej",
              "Modulacja glutaminian/GABA — przesuwa rownowage w strone hamowania",
              "Mitochondria — poprawia oddychanie komorkowe i zmniejsza stres oksydacyjny",
            ],
          },
          { heading: "Kluczowe fakty kliniczne",
            items: [
              "Zmniejsza ryzyko nawrotu o ~40% vs placebo",
              "Jedyny lek psychiatryczny istotnie obnizajacy ryzyko samobojstwa",
              "Odwraca utrate objetosci mozgu towarzyszaca chorobie",
            ],
          },
          { heading: "Hipoteza systemowa",
            items: [
              "Bipolarnosc to choroba dynamiki atraktorow — mozg ma zbyt gleboke, niestabilne baseny (mania/depresja) i splaszczony srodek (eutymia)",
              "Lit nie celuje w jeden receptor — zmniejsza 'gain' w petlach sprzezenia zwrotnego na wielu poziomach jednoczesnie",
              "Dziala jak reduktor szumu sieciowego — stabilizuje metabolizm mitochondrialny w wezlach sieci",
              "Przywraca elastycznosc metaboliczna — poszerza zakres stabilnosci przelacznika miedzy trybem glikolitycznym (mania) a oksydacyjnym (depresja)",
              "Modele dynamiczne potwierdzaja: lit zmienia topologie krajobrazu energetycznego, nie tylko sile poszczegolnych sygnalow",
            ],
          },
        ],
        refs: [
          "Geddes et al. 2004 — meta-analiza litu w bipolar",
          "Cipriani et al. 2013 — lit a ryzyko samobojstwa",
          "Malhi et al. 2013 — mechanizm dzialania litu",
          "Machado-Vieira 2018 — lit, mitochondria i GSK-3",
          "Bauer et al. 2022 — modele dynamiczne bipolarnosci",
          "Mertens et al. 2015 — hiperpobudliwosc neuronow (Nature)"
        ]
      },
      valproate: {
        label: "Walproinian",
        desc: "Kulka porusza sie w 'miodzie' — przejscia miedzy stanami sa wolniejsze, ale krajobraz sie nie zmienia.",
        detail: "Wzmacnia transmisje GABA-ergiczna i blokuje kanaly sodowe zalezne od napiecia. Skuteczny glownie w ostrej manii i u pacjentow z szybkim cyklowaniem. Terrain (studnie) pozostaje bez zmian — lek spowalnia dynamike kulki.",
        refs: ["Bowden et al. 1994 — walproinian vs lit w manii", "Macritchie et al. 2003 — przeglad Cochrane"]
      },
      lamotrigine: {
        label: "Lamotrigina",
        desc: "Splyca depresyjny dolek (blokada glutaminianu) — ale mania pozostaje gleboka. Asymetryczna ochrona.",
        detail: "Blokuje napieciozalezne kanaly sodowe i hamuje uwalnianie glutaminianu. Wykazuje dobrze udokumentowana skutecznosc w zapobieganiu epizodom depresji. Wymaga wolnego miareczkowania dawki.",
        refs: ["Calabrese et al. 1999 — lamotrigina w depresji", "Geddes et al. 2009 — meta-analiza lamotriginy"]
      },
      aripiprazole: {
        label: "Aripiprazol",
        desc: "Splyca dolek manii i stawia umiarkowana bariere ('termostat' D2). Jesli kulka jest w manii — stopniowo z niej wyplywa.",
        detail: "Dziala jako agonista czesciowy receptorow D2 oraz antagonista 5-HT2A. 'Moduluje' dopamine zamiast ja calkowicie blokowac. Zapobiega nawrotom manii.",
        refs: ["Keck et al. 2003 — aripiprazol w ostrej manii", "Marcus et al. 2008 — augmentacja w depresji", "Shapiro et al. 2003 — mechanizm agonizmu D2"]
      },
      quetiapine: {
        label: "Kwetiapina",
        desc: "Splyca oba dolki (mania i depresja) + sedacja + bariera. Dwukierunkowa.",
        detail: "Szeroki profil receptorowy (D2, 5-HT2A, H1). Skuteczna w manii i depresji (badania BOLDER). Niska grawitacja oddaje efekt sedatywny.",
        refs: ["Calabrese et al. 2005 — badanie BOLDER I", "Thase et al. 2006 — badanie BOLDER II", "Bowden et al. 2005 — kwetiapina w manii"]
      },
      olanzapine: {
        label: "Olanzapina",
        desc: "Najsilniejsze splycenie dolka manii — kulka wypycha sie nawet z glebokiej manii. Silna sedacja.",
        detail: "Silny antagonista wielu receptorow. Uznawana za jeden z najskuteczniejszych lekow w ostrej manii. Wysokie ryzyko metaboliczne.",
        refs: ["Tohen et al. 1999 — olanzapina w ostrej manii", "Tohen et al. 2003 — olanzapina + fluoksetyna"]
      },
      risperidone: {
        label: "Risperidon",
        desc: "Wyrazne splycenie manii + bariera. Szybki efekt, ale ryzyko sztywnosci.",
        detail: "Silny antagonista D2. Szybko redukuje pobudzenie maniakalne. Ryzyko objawow pozapiramidowych.",
        refs: ["Hirschfeld et al. 2004 — risperidon w manii", "Yatham et al. 2003 — risperidon jako augmentacja"]
      },
      clonazepam: {
        label: "Klonazepam",
        desc: "Zalewa krajobraz olejem (masywne GABA). Szybka ulga, zero naprawy struktury.",
        detail: "Benzodiazepina. Silne spowolnienie (damping), ale brak wplywu na glebokosc studni. Ryzyko uzaleznienia.",
        refs: ["Chouinard et al. 1983 — klonazepam w manii", "Ashton 2005 — odstawienie benzodiazepin"]
      },
      thc: {
        label: "THC",
        desc: "Rozregulowuje krajobraz — dolki oscyluja losowo. Chwilowa ulga, ale ryzyko epizodow.",
        detail: "Zaburza homeostaze neuroprzekaznikowa. Jitter w wizualizacji oddaje niestabilnosc nastroju.",
        refs: ["Gibbs et al. 2015 — cannabis i mania", "Mammen et al. 2018 — cannabis i nawroty"]
      },
      ketamine: {
        label: "Ketamina",
        desc: "Blyskawicznie zasypuje depresyjny dolek (blokada NMDA). Efekt spektakularny, ale krotkotrwaly.",
        detail: "Szybki efekt antydepresyjny przez blokade NMDA i synaptogeneze. Nie zmienia trwale topologii.",
        refs: ["Zarate et al. 2006 — ketamina w depresji", "Diazgranados et al. 2010 — depresja bipolarna"]
      },
      mdma: {
        label: "MDMA",
        desc: "Splyca oba dolki (masywne 5-HT/DA) + silny chaos. Ryzyko manii.",
        detail: "Masywne uwolnienie monoamin. Ryzykowne w ChAD — moze wywolac manie lub poglebic depresje (crash).",
        refs: ["Mitchell et al. 2021 — MDMA in PTSD (Nature)", "Reiff et al. 2020 — psychedelics review"]
      },
      ayahuasca: {
        label: "Ajauaska",
        desc: "Silne i szybkie splycenie dolka depresji. Pewien chaos. Manii prawie nie dotyka.",
        detail: "Agonizm 5-HT2A. Szybka poprawa nastroju, ale ryzyko indukcji stanow maniakalnych.",
        refs: ["Palhano-Fontes et al. 2019 — RCT ajauaski", "Osório et al. 2015 — badanie otwarte"]
      },
      ect: {
        label: "EW",
        desc: "Reset krajobrazu — mania i depresja prawie plaskie, eutymia staje sie prawdziwym atraktorem.",
        detail: "Elektrowstrzasy. Najsilniejsza metoda przerywania epizodow. Dramatyczna zmiana topologii.",
        refs: ["UK ECT Review Group 2003 (Lancet)", "Dierckx et al. 2012 — meta-analiza", "Versiani et al. 2011 — EW w manii"]
      },
      alcohol: {
        label: "Alkohol",
        desc: "Destabilizuje krajobraz, poglebiajac oba patologiczne baseny. Chwilowe spowolnienie ustepuje miejsca zwiekszonemu chaosowi i ryzyku nawrotu.",
        detail: "Dziala hamujaco na OUN (GABA), co doraźnie spowalnia kulke (sedacja). Jednak metabolity i efekt 'rebound' poglebiaja dolki manii i depresji, czyniac je silniejszymi atraktorami. Zwieksza cyklowanie i ryzyko zachowan impulsywnych.",
        refs: ["Boden & Fergusson 2011 — metaanaliza", "Salloum et al. 2005 — alkohol w ChAD"]
      }
    }
  },
  en: {
    title: "Energy Landscape — Attractors in Bipolar Disorder",
    subtitle: "Click drugs to toggle. You can combine many. Observe onset and decay.",
    sections: {
      stabilizers: "Mood Stabilizers",
      antipsychotics: "Antipsychotics",
      psychedelics: "Psychedelics",
      substances: "Substances",
      other: "Other"
    },
    ui: {
      noActive: "⚡ No medication: Euthymia is a peak — any disturbance pushes the ball into mania or depression.",
      phaseOnset: " (onset)",
      phaseSteady: " (steady)",
      phaseDecay: " (decay)",
      phaseOff: " (withdrawn)",
      stressor: "⚡ Stressor",
      gabaOil: "GABA 'OIL'",
      mania: "MANIA",
      euthymia: "EUTHYMIA",
      depression: "DEPRESSION",
      barrier: "D2 BARRIER"
    },
    drugs: {
      lithium: {
        label: "Lithium",
        desc: "The ONLY drug that reshapes the entire landscape. Euthymia becomes a deep, stable well. Other drugs only fill wells or slow the ball.",
        detail: "The oldest and best-documented stabilizer. The only one with strong neuroprotective effects and significant suicide risk reduction.",
        sections: [
          { heading: "Proven mechanisms",
            items: [
              "Inositol pathway — inhibits IMPase, limiting excessive signaling in overactive neurons",
              "GSK-3beta blockade — stabilizes synaptic plasticity and circadian rhythms",
              "Neuroprotection — increases BDNF, reverses gray matter loss in hippocampus and prefrontal cortex",
              "Glutamate/GABA modulation — shifts the balance towards inhibition",
              "Mitochondria — improves cellular respiration and reduces oxidative stress",
            ],
          },
          { heading: "Key clinical facts",
            items: [
              "Reduces relapse risk by ~40% vs placebo",
              "The only psychiatric drug significantly lowering suicide risk",
              "Reverses brain volume loss associated with the disease",
            ],
          },
          { heading: "Systemic Hypothesis",
            items: [
              "Bipolarity is a disease of attractor dynamics — the brain has too deep, unstable basins (mania/depression) and a flattened center (euthymia)",
              "Lithium doesn't target one receptor — it reduces 'gain' in feedback loops across many levels simultaneously",
              "Acts as a network noise reducer — stabilizes mitochondrial metabolism in network nodes",
              "Restores metabolic flexibility — widens the stability range of the glycolytic (mania) to oxidative (depression) switch",
              "Dynamic models confirm: lithium changes energy landscape topology, not just individual signal strength",
            ],
          },
        ],
        refs: [
          "Geddes et al. 2004 — lithium meta-analysis in bipolar",
          "Cipriani et al. 2013 — lithium and suicide risk",
          "Malhi et al. 2013 — mechanism of lithium action",
          "Machado-Vieira 2018 — lithium, mitochondria and GSK-3",
          "Bauer et al. 2022 — dynamic models of bipolarity",
          "Mertens et al. 2015 — neuronal hyperexcitability (Nature)"
        ]
      },
      valproate: {
        label: "Valproate",
        desc: "The ball moves through 'honey' — transitions between states are slower, but the landscape remains the same.",
        detail: "Enhances GABAergic transmission and blocks voltage-gated sodium channels. Effective mainly in acute mania and rapid cycling. Terrain (wells) remains unchanged — the drug slows ball dynamics.",
        refs: ["Bowden et al. 1994 — valproate vs lithium in mania", "Macritchie et al. 2003 — Cochrane review"]
      },
      lamotrigine: {
        label: "Lamotrigine",
        desc: "Shallows the depressive well (glutamate blockade) — but mania remains deep. Asymmetric protection.",
        detail: "Blocks voltage-gated sodium channels and inhibits glutamate release. Well-documented efficacy in preventing depressive episodes. Requires slow dose titration.",
        refs: ["Calabrese et al. 1999 — lamotrigine in depression", "Geddes et al. 2009 — lamotrigine meta-analysis"]
      },
      aripiprazole: {
        label: "Aripiprazole",
        desc: "Shallows the manic well and sets a moderate barrier ('D2 thermostat'). If the ball is in mania, it gradually flows out.",
        detail: "Acts as a partial D2 agonist and 5-HT2A antagonist. 'Modulates' dopamine rather than blocking it completely. Prevents manic relapse.",
        refs: ["Keck et al. 2003 — aripiprazole in acute mania", "Marcus et al. 2008 — augmentation in depression", "Shapiro et al. 2003 — D2 agonism mechanism"]
      },
      quetiapine: {
        label: "Quetiapine",
        desc: "Shallows both wells (mania and depression) + sedation + barrier. Bidirectional, but metabolically heavy.",
        detail: "Broad receptor profile (D2, 5-HT2A, H1). Effective in both mania AND bipolar depression (BOLDER studies). Low gravity represents sedation.",
        refs: ["Calabrese et al. 2005 — BOLDER I study", "Thase et al. 2006 — BOLDER II study", "Bowden et al. 2005 — quetiapine in mania"]
      },
      olanzapine: {
        label: "Olanzapine",
        desc: "Strongest shallowing of the manic well — ball is pushed out even from deep mania. Strong sedation.",
        detail: "High affinity for D2, 5-HT2A, H1 and muscarinic receptors. One of the most effective drugs for acute mania. High metabolic risk.",
        refs: ["Tohen et al. 1999 — olanzapine in acute mania", "Tohen et al. 2003 — olanzapine + fluoxetine"]
      },
      risperidone: {
        label: "Risperidone",
        desc: "Significant shallowing of mania + barrier. Rapid effect, but risk of stiffness.",
        detail: "Potent D2 antagonist. Rapidly reduces manic agitation. Risk of extrapyramidal symptoms.",
        refs: ["Hirschfeld et al. 2004 — risperidone in mania", "Yatham et al. 2003 — risperidone as augmentation"]
      },
      clonazepam: {
        label: "Clonazepam",
        desc: "Floods the landscape with oil (massive GABA). Rapid relief, no structural repair — 'rebound' after withdrawal.",
        detail: "Benzodiazepine. Potent slowing (damping) but no effect on well depth. Risk of tolerance and dependence.",
        refs: ["Chouinard et al. 1983 — clonazepam in mania", "Ashton 2005 — benzodiazepine withdrawal"]
      },
      thc: {
        label: "THC",
        desc: "Dysregulates the landscape — wells oscillate randomly. Temporary relief but higher risk of episodes over time.",
        detail: "Disrupts neurotransmitter regulation. Jitter in visualization represents mood instability.",
        refs: ["Gibbs et al. 2015 — cannabis and mania", "Mammen et al. 2018 — cannabis and relapse"]
      },
      ketamine: {
        label: "Ketamine",
        desc: "Instantly fills the depressive well (NMDA blockade). Spectacular but short-lived effect.",
        detail: "Rapid antidepressant effect via NMDA blockade and synaptogenesis. Does not permanently change topology.",
        refs: ["Zarate et al. 2006 — ketamine in depression", "Diazgranados et al. 2010 — bipolar depression"]
      },
      mdma: {
        label: "MDMA",
        desc: "Shallows both wells (massive 5-HT/DA) + high chaos. Mania risk.",
        detail: "Massive monoamine release. High risk in bipolar — may trigger mania or worsen depression (crash).",
        refs: ["Mitchell et al. 2021 — MDMA in PTSD (Nature)", "Reiff et al. 2020 — psychedelics review"]
      },
      ayahuasca: {
        label: "Ayahuasca",
        desc: "Strong and rapid shallowing of the depressive well. Some chaos. Does not touch mania.",
        detail: "5-HT2A agonism. Rapid mood improvement but risk of inducing manic states.",
        refs: ["Palhano-Fontes et al. 2019 — ayahuasca RCT", "Osório et al. 2015 — open label study"]
      },
      ect: {
        label: "ECT",
        desc: "Landscape reset — mania and depression become almost flat, euthymia becomes a true attractor.",
        detail: "Electroconvulsive therapy. Most potent method for breaking severe episodes. Dramatic topological change.",
        refs: ["UK ECT Review Group 2003 (Lancet)", "Dierckx et al. 2012 — meta-analysis", "Versiani et al. 2011 — ECT in mania"]
      },
      alcohol: {
        label: "Alcohol",
        desc: "Destabilizes the landscape by deepening both pathological basins. Temporary slowing gives way to increased chaos and relapse risk.",
        detail: "CNS depressant (GABAergic). While initially slowing the ball (sedation), its long-term effects and rebound deepen both manic and depressive wells, making them stronger attractors. Increases cycling and impulsivity.",
        refs: ["Boden & Fergusson 2011 — meta-analysis", "Salloum et al. 2005 — alcohol in bipolar"]
      }
    }
  },
  de: {
    title: "Energielandschaft — Attraktoren bei bipolarer Störung",
    subtitle: "Medikamente zum Umschalten anklicken. Mehrere kombinierbar. Onset und Abklingen beobachten.",
    sections: {
      stabilizers: "Stimmungsstabilisierer",
      antipsychotics: "Antipsychotika",
      psychedelics: "Psychedelika",
      substances: "Substanzen",
      other: "Andere"
    },
    ui: {
      noActive: "⚡ Ohne Medikation: Euthymie ist ein Gipfel — jede Störung stößt den Ball in Manie oder Depression.",
      phaseOnset: " (Beginn)",
      phaseSteady: " (stabil)",
      phaseDecay: " (Abklingen)",
      phaseOff: " (abgesetzt)",
      stressor: "⚡ Stressor",
      gabaOil: "GABA 'ÖL'",
      mania: "MANIE",
      euthymia: "EUTHYMIE",
      depression: "DEPRESSION",
      barrier: "D2 BARRIERE"
    },
    drugs: {
      lithium: {
        label: "Lithium",
        desc: "Das EINZIGE Medikament, das die gesamte Landschaft umgestaltet. Euthymie wird zu einer tiefen, stabilen Mulde.",
        detail: "Der älteste und am besten dokumentierte Stabilisator. Als einziger mit starker neuroprotektiver Wirkung und signifikanter Suizidrisikosenkung.",
        sections: [
          { heading: "Nachgewiesene Mechanismen",
            items: [
              "Inositol-Pfad — hemmt IMPase, begrenzt übermäßige Signalgebung in überaktiven Neuronen",
              "GSK-3beta-Blockade — stabilisiert die synaptische Plastizität und den zirkadianen Rhythmus",
              "Neuroprotektion — erhöht BDNF, kehrt Graue-Substanz-Verlust in Hippocampus und Präfrontalkortex um",
              "Glutamat/GABA-Modulation — verschiebt das Gleichgewicht in Richtung Hemmung",
              "Mitochondrien — verbessert die Zellatmung und reduziert oxidativen Stress",
            ],
          },
          { heading: "Klinische Fakten",
            items: [
              "Reduziert Rückfallrisiko um ~40% vs. Placebo",
              "Einziges psychiatrisches Medikament mit signifikanter Suizidprävention",
              "Kehrt krankheitsbedingten Hirnvolumenverlust um",
            ],
          },
          { heading: "Systemhypothese",
            items: [
              "Bipolarität ist eine Krankheit der Attraktordynamik — das Gehirn hat zu tiefe, instabile Becken (Manie/Depression) und eine flache Mitte (Euthymie)",
              "Lithium zielt nicht auf einen Rezeptor — es reduziert den 'Gain' in Rückkopplungsschleifen auf vielen Ebenen gleichzeitig",
              "Wirkt als Netzwerkrauschunterdrücker — stabilisiert den mitochondrialen Stoffwechsel in Netzwerkknoten",
              "Stellt metabolische Flexibilität wieder her — erweitert den Stabilitätsbereich des Schalters zwischen glykolytisch (Manie) und oxidativ (Depression)",
              "Dynamische Modelle bestätigen: Lithium verändert die Topologie der Energielandschaft, nie nur einzelne Signalstärken",
            ],
          },
        ],
        refs: [
          "Geddes et al. 2004 — Lithium Meta-Analyse",
          "Cipriani et al. 2013 — Lithium und Suizidrisiko",
          "Malhi et al. 2013 — Mechanismus der Lithiumwirkung",
          "Machado-Vieira 2018 — Lithium, Mitochondrien und GSK-3",
          "Bauer et al. 2022 — Dynamische Modelle der Bipolarität",
          "Mertens et al. 2015 — Neuronale Hyperexzitabilität (Nature)"
        ]
      },
      valproate: {
        label: "Valproat",
        desc: "Der Ball bewegt sich wie durch 'Honig' — Übergänge zwischen Zuständen sind langsamer, ale die Landschaft bleibt gleich.",
        detail: "Verstärkt die GABAerge Transmission und blockiert spannungsgesteuerte Natriumkanäle. Wirksam vor allem bei akuter Manie. Die Landschaft (Mulden) bleibt unverändert.",
        refs: ["Bowden et al. 1994 — Valproat vs. Lithium bei Manie", "Macritchie et al. 2003 — Cochrane Review"]
      },
      lamotrigine: {
        label: "Lamotrigin",
        desc: "Flacht die depressive Mulde ab (Glutamat-Blockade) — aber die Manie bleibt tief. Asymmetrischer Schutz.",
        detail: "Blockiert spannungsgesteuerte Natriumkanäle und hemmt die Glutamatfreisetzung. Gut dokumentierte Wirksamkeit bei der Vorbeugung depressiver Episoden.",
        refs: ["Calabrese et al. 1999 — Lamotrigin bei Depression", "Geddes et al. 2009 — Lamotrigin Meta-Analyse"]
      },
      aripiprazole: {
        label: "Aripiprazol",
        desc: "Flacht die manische Mulde ab und setzt eine moderate Barriere ('D2-Thermostat'). Wenn der Ball in Manie ist, fließt er allmählich ab.",
        detail: "Partieller D2-Agonist und 5-HT2A-Antagonist. 'Moduliert' Dopamin, anstatt es vollständig zu blockieren. Verhindert manische Rückfälle.",
        refs: ["Keck et al. 2003 — Aripiprazol bei akuter Manie", "Marcus et al. 2008 — Augmentation bei Depression", "Shapiro et al. 2003 — D2-Agonismus Mechanismus"]
      },
      quetiapine: {
        label: "Quetiapin",
        desc: "Flacht beide Mulden ab (Manie und Depression) + Sedierung + Barriere. Bidirektional.",
        detail: "Breites Rezeptorprofil (D2, 5-HT2A, H1). Wirksam bei Manie UND bipolarer Depression (BOLDER-Studien). Niedrige Gravitation repräsentiert Sedierung.",
        refs: ["Calabrese et al. 2005 — BOLDER I Studie", "Thase et al. 2006 — BOLDER II Studie", "Bowden et al. 2005 — Quetiapin bei Manie"]
      },
      olanzapine: {
        label: "Olanzapin",
        desc: "Stärkste Abflachung der manischen Mulde. Starke Sedierung. Berührt Depression nie.",
        detail: "Hohe Affinität zu D2, 5-HT2A, H1 und muskarinischen Rezeptoren. Eines der effektivsten Medikamente bei akuter Manie.",
        refs: ["Tohen et al. 1999 — Olanzapin bei akuter Manie", "Tohen et al. 2003 — Olanzapin + Fluoxetin"]
      },
      risperidone: {
        label: "Risperidon",
        desc: "Deutliche Abflachung der Manie + Barriere. Schnelle Wirkung, aber Risiko von Steifigkeit.",
        detail: "Potenter D2-Antagonist. Reduziert manische Erregung schnell. Risiko für extrapyramidale Symptome.",
        refs: ["Hirschfeld et al. 2004 — Risperidon bei Manie", "Yatham et al. 2003 — Risperidon als Augmentation"]
      },
      clonazepam: {
        label: "Clonazepam",
        desc: "Flutet die Landschaft mit Öl (massive GABA). Schnelle Linderung, keine strukturelle Reparatur.",
        detail: "Benzodiazepin. Starke Verlangsamung (Damping), aber kein Einfluss auf die Muldentiefe. Abhängigkeitsrisiko.",
        refs: ["Chouinard et al. 1983 — Clonazepam bei Manie", "Ashton 2005 — Benzodiazepin-Entzug"]
      },
      thc: {
        label: "THC",
        desc: "Dysreguliert die Landschaft — Mulden oszillieren zufällig. Vorübergehende Linderung, aber höheres Episodenrisiko.",
        detail: "Stört die Neurotransmitter-Regulation. Jitter in der Visualisierung repräsentiert Stimmungsinstabilität.",
        refs: ["Gibbs et al. 2015 — Cannabis und Manie", "Mammen et al. 2018 — Cannabis und Rückfälle"]
      },
      ketamine: {
        label: "Ketamin",
        desc: "Füllt die depressive Mulde sofort auf (NMDA-Blockade). Spektakulär, ale kurzlebige Wirkung.",
        detail: "Schnelle antidepressive Wirkung über NMDA-Blockade und Synaptogenese. Verändert Topologie nie dauerhaft.",
        refs: ["Zarate et al. 2006 — Ketamin bei Depression", "Diazgranados et al. 2010 — Bipolare Depression"]
      },
      mdma: {
        label: "MDMA",
        desc: "Flacht beide Mulden ab (massive 5-HT/DA-Ausschüttung) + hohes Chaos. Manierisiko.",
        detail: "Massive Monoamin-Freisetzung. Hohes Risiko bei Bipolarität — kann Manie auslösen oder Depression verschlimmern.",
        refs: ["Mitchell et al. 2021 — MDMA in PTSD (Nature)", "Reiff et al. 2020 — Psychedelika Review"]
      },
      ayahuasca: {
        label: "Ayahuasca",
        desc: "Starke und schnelle Abflachung der depressiven Mulde. Gewisses Chaos. Berührt Manie nie.",
        detail: "5-HT2A-Agonismus. Schnelle Stimmungsverbesserung, aber Risiko für manische Zustände.",
        refs: ["Palhano-Fontes et al. 2019 — Ayahuasca RCT", "Osório et al. 2015 — offene Studie"]
      },
      ect: {
        label: "EKT",
        desc: "Landschafts-Reset — Manie und Depression fast flach, Euthymie wird zum wahren Attraktor.",
        detail: "Elektrokonvulsionstherapie. Stärkste Methode zur Unterbrechung schwerer Episoden. Dramatische topologische Veränderung.",
        refs: ["UK ECT Review Group 2003 (Lancet)", "Dierckx et al. 2012 — Meta-Analyse", "Versiani et al. 2011 — EKT bei Manie"]
      },
      alcohol: {
        label: "Alkohol",
        desc: "Destabilisiert die Landschaft, indem beide pathologischen Becken vertieft werden. Kurzzeitige Verlangsamung weicht erhöhtem Chaos und Rückfallrisiko.",
        detail: "ZNS-Depressivum (GABAerg). Während es den Ball anfangs verlangsamt (Sedierung), vertiefen Langzeitfolgen und Rebound-Effekte sowohl manische als auch depressive Mulden. Erhöht das Cycling- und Impulsivitätsrisiko.",
        refs: ["Boden & Fergusson 2011 — Meta-Analyse", "Salloum et al. 2005 — Alkohol bei Bipolarität"]
      }
      }
      }
      };

