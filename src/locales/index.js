export const translations = {
  pl: {
    title: "Krajobraz energetyczny — atraktory w chorobie dwubiegunowej",
    subtitle: "Klikaj leki aby je wlaczac/wylaczac. Mozesz laczyc wiele naraz. Obserwuj onset i zanik.",
    sections: {
      stabilizers: "Stabilizatory nastroju",
      antipsychotics: "Antypsychotyki",
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
      },
      valproate: {
        label: "Walproinian",
        desc: "Kulka porusza sie w 'miodzie' — przejscia miedzy stanami sa wolniejsze, ale krajobraz sie nie zmienia.",
        detail: "Wzmacnia transmisje GABA-ergiczna i blokuje kanaly sodowe zalezne od napiecia. Skuteczny glownie w ostrej manii i u pacjentow z szybkim cyklowaniem. Nie wykazuje istotnej skutecznosci w depresji bipolarnej. Terrain (studnie) pozostaje bez zmian — lek spowalnia dynamike kulki, ale nie zmienia docelowych stanow.",
      },
      lamotrigine: {
        label: "Lamotrigina",
        desc: "Splyca depresyjny dolek (blokada glutaminianu) — ale mania pozostaje gleboka. Asymetryczna ochrona.",
        detail: "Blokuje napieciozalezne kanaly sodowe i hamuje uwalnianie glutaminianu. Wykazuje dobrze udokumentowana skutecznosc w zapobieganiu epizodom depresji, przy znacznie slabszym dzialaniu przeciwmaniakalnym. Wymaga bardzo wolnego miareczkowania dawki.",
      },
      aripiprazole: {
        label: "Aripiprazol",
        desc: "Splyca dolek manii i stawia umiarkowana bariere ('termostat' D2). Jesli kulka jest w manii — stopniowo z niej wyplywa. Depresji nie dotyka.",
        detail: "Dziala jako agonista czesciowy receptorow D2 oraz antagonista 5-HT2A. Zamiast calkowicie blokowac dopamine, 'moduluje' ja. W ostrej manii redukuje glebokosc basenu maniakalnego, a bariera profilaktyczna zapobiega nawrotom.",
      },
      quetiapine: {
        label: "Kwetiapina",
        desc: "Splyca oba dolki (mania i depresja) + sedacja + bariera. Dwukierunkowa, ale ciezka metabolicznie.",
        detail: "Blokuje D2, 5-HT2A, H1 i alfa-1. Jedyny atypowy antypsychotyk z udowodniona skutecznoscia zarowno w manii JAK i depresji bipolarnej (badania BOLDER). Niska grawitacja oddaje sedacje — kulka porusza sie wolno.",
      },
      olanzapine: {
        label: "Olanzapina",
        desc: "Najsilniejsze splycenie dolka manii — kulka wypycha sie nawet z glebokiej manii. Silna sedacja. Depresji nie dotyka.",
        detail: "Silne powinowactwo do receptorow D2, 5-HT2A, H1 i muskarynowych. Agresywnie redukuje glebokosc basenu maniakalnego. W polaczeniu z fluoksetyna wykazuje skutecznosc w depresji bipolarnej.",
      },
      risperidone: {
        label: "Risperidon",
        desc: "Wyrazne splycenie manii + bariera. Szybki efekt, ale ryzyko sztywnosci i hiperprolaktynemii.",
        detail: "Silny antagonista D2 i 5-HT2A. Skutecznie redukuje glebokosc basenu maniakalnego i tworzy bariere profilaktyczna. Szybkie dzialanie antymaniakalne.",
      },
      clonazepam: {
        label: "Klonazepam",
        desc: "Zalewa krajobraz olejem (masywne GABA). Szybka ulga, zero naprawy struktury — po odstawieniu 'odbicie'.",
        detail: "Wzmocnienie receptorow GABA-A. Efekt jest szybki i silny (kulka prawie nieruchoma), ale nie zmienia struktury krajobrazu. Przy dluzszym stosowaniu ryzyko tolerancji i zaleznosci.",
      },
      thc: {
        label: "THC",
        desc: "Rozregulowuje krajobraz — dolki oscyluja losowo. Chwilowa ulga, ale z czasem wieksze ryzyko epizodow.",
        detail: "Zaburza regulacje dopaminy i serotoniny. U osob z bipolarem zwieksza ryzyko epizodow maniakalnych i przyspiesza cyklowanie. Jitter w wizualizacji oddaje niestabilnosc 'termostatu'.",
      },
      ketamine: {
        label: "Ketamina",
        desc: "Blyskawicznie zasypuje depresyjny dolek (blokada NMDA). Efekt spektakularny, ale krotkotrwaly.",
        detail: "Antagonista receptorow NMDA. Powoduje szybka synaptogeneze w korze przedczolowej. Jedyny lek dajacy efekt antydepresyjny w ciagu minut, nie tygodni. Nie zmienia trwale krajobrazu.",
      },
      mdma: {
        label: "MDMA",
        desc: "Splyca oba dolki (masywne 5-HT/DA) + silny chaos. Chwilowa ulga, ale ryzyko manii.",
        detail: "Powoduje masywne uwolnienie serotoniny, dopaminy i norepinefryny. W bipolarze wysokiego ryzyka — moze wyzwolic epizod maniakalny, a faza 'po' czesto poglebia depresje.",
      },
      ayahuasca: {
        label: "Ajauaska",
        desc: "Silne i szybkie splycenie dolka depresji (agonizm 5-HT2A + MAOI). Pewien chaos. Manii prawie nie dotyka.",
        detail: "Mieszanina DMT i MAOI. Szybki efekt antydepresyjny przez stymulacje neuroplastycznosci. Ryzyko wyzwolenia manii przez wplyw na dopamine.",
      },
      ect: {
        label: "EW",
        desc: "Reset krajobrazu — mania i depresja prawie plaskie, eutymia staje sie prawdziwym atraktorem.",
        detail: "Najskuteczniejsza interwencja w ciezkich stanach. Masywna synchroniczna aktywacja neuronalna normalizuje patologicznie utrwalone wzorce sieci.",
      }
    }
  },
  en: {
    title: "Energy Landscape — Attractors in Bipolar Disorder",
    subtitle: "Click drugs to toggle. You can combine many. Observe onset and decay.",
    sections: {
      stabilizers: "Mood Stabilizers",
      antipsychotics: "Antipsychotics",
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
        desc: "The ONLY drug that reshapes the entire landscape. Euthymia becomes a deep, stable well.",
        sections: [
          { heading: "Proven mechanisms", items: ["Inositol depletion", "GSK-3beta inhibition", "Neuroprotection (BDNF)", "Glutamate/GABA modulation", "Mitochondrial health"] }
        ]
      },
      valproate: {
        label: "Valproate",
        desc: "The ball moves through 'honey' — transitions between states are slower, but the landscape remains the same."
      },
      lamotrigine: {
        label: "Lamotrigine",
        desc: "Shallows the depressive well (glutamate blockade) — but mania remains deep. Asymmetric protection."
      },
      aripiprazole: {
        label: "Aripiprazole",
        desc: "Shallows the manic well and sets a moderate barrier ('D2 thermostat')."
      },
      quetiapine: {
        label: "Quetiapine",
        desc: "Shallows both wells (mania and depression) + sedation + barrier. Bidirectional."
      },
      olanzapine: {
        label: "Olanzapine",
        desc: "Strongest shallowing of the manic well. Strong sedation. Does not touch depression."
      },
      risperidone: {
        label: "Risperidone",
        desc: "Significant shallowing of mania + barrier. Rapid effect."
      },
      ketamine: {
        label: "Ketamine",
        desc: "Instantly fills the depressive well (NMDA blockade). Spectacular but short-lived effect."
      },
      mdma: {
        label: "MDMA",
        desc: "Shallows both wells (massive 5-HT/DA release) + high chaos. Mania risk."
      },
      ayahuasca: {
        label: "Ayahuasca",
        desc: "Strong and rapid shallowing of the depressive well. Some chaos."
      },
      clonazepam: {
        label: "Clonazepam",
        desc: "Floods the landscape with oil (massive GABA). Rapid relief, no structural repair."
      },
      thc: {
        label: "THC",
        desc: "Dysregulates the landscape — wells oscillate randomly. Temporary relief but higher risk of episodes."
      },
      ect: {
        label: "ECT",
        desc: "Landscape reset — mania and depression become almost flat, euthymia becomes a true attractor."
      }
    }
  },
  de: {
    title: "Energielandschaft — Attraktoren bei bipolarer Störung",
    subtitle: "Medikamente zum Umschalten anklicken. Mehrere kombinierbar. Onset und Abklingen beobachten.",
    sections: {
      stabilizers: "Stimmungsstabilisierer",
      antipsychotics: "Antipsychotika",
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
        sections: [
          { heading: "Nachgewiesene Mechanismen", items: ["Inositol-Depletion", "GSK-3beta-Hemmung", "Neuroprotektion (BDNF)", "Glutamat/GABA-Modulation", "Mitochondriale Gesundheit"] }
        ]
      },
      valproate: {
        label: "Valproat",
        desc: "Der Ball bewegt sich wie durch 'Honig' — Übergänge zwischen Zuständen sind langsamer, aber die Landschaft bleibt gleich."
      },
      lamotrigine: {
        label: "Lamotrigin",
        desc: "Flacht die depressive Mulde ab (Glutamat-Blockade) — aber die Manie bleibt tief. Asymmetrischer Schutz."
      },
      aripiprazole: {
        label: "Aripiprazol",
        desc: "Flacht die manische Mulde ab und setzt eine moderate Barriere ('D2-Thermostat')."
      },
      quetiapine: {
        label: "Quetiapin",
        desc: "Flacht beide Mulden ab (Manie und Depression) + Sedierung + Barriere. Bidirektional."
      },
      olanzapine: {
        label: "Olanzapin",
        desc: "Stärkste Abflachung der manischen Mulde. Starke Sedierung. Berührt Depression nie."
      },
      risperidone: {
        label: "Risperidon",
        desc: "Deutliche Abflachung der Manie + Barriere. Schnelle Wirkung."
      },
      ketamine: {
        label: "Ketamin",
        desc: "Füllt die depressive Mulde sofort auf (NMDA-Blockade). Spektakulär, ale kurzlebige Wirkung."
      },
      mdma: {
        label: "MDMA",
        desc: "Flacht beide Mulden ab (massive 5-HT/DA-Ausschüttung) + hohes Chaos. Manierisiko."
      },
      ayahuasca: {
        label: "Ayahuasca",
        desc: "Starke und schnelle Abflachung der depressiven Mulde. Gewisses Chaos."
      },
      clonazepam: {
        label: "Clonazepam",
        desc: "Flutet die Landschaft mit Öl (massive GABA). Schnelle Linderung, keine strukturelle Reparatur."
      },
      thc: {
        label: "THC",
        desc: "Dysreguliert die Landschaft — Mulden oszillieren zufällig. Vorübergehende Linderung, ale höheres Episodenrisiko."
      },
      ect: {
        label: "EKT",
        desc: "Landschafts-Reset — Manie und Depression fast flach, Euthymie wird zum wahren Attraktor."
      }
    }
  }
};
