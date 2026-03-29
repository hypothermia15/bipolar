import { useState, useEffect, useRef, useCallback } from "react";

const W = 800, H = 420, PAD = 52, BALL_R = 14;
const X_LO = -1.12, X_HI = 1.12, Y_LO = -2.5, Y_HI = 2.8;
const BARRIER = { cx: -0.38, w: 0.10 };

// ── Konfiguracje lekow ──────────────────────────────────────────────────────
// halfLife: czas polowicznego rozpadu w sekundach symulacji (1s sim ~ kilka godzin IRL)
// onset: sekundy do osiagniecia pelnej koncentracji

const DRUGS = {
  lithium: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 0.65, w: 0.20 },
      { cx:  0.00, depth: 2.10, w: 0.30 },
      { cx:  0.68, depth: 0.65, w: 0.20 },
    ],
    damping: 0.985, gravity: 14, barrierH: 0, jitter: 0,
    label: "Lit", icon: "⚛️", color: "#27ae60",
    halfLife: 25, onset: 8,
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
      { heading: "Hipoteza systemowa (potwierdzona modelami dynamicznymi)",
        items: [
          "Bipolarnosc to choroba dynamiki atraktorow — mozg ma zbyt gleboke, niestabilne baseny (mania/depresja) i splaszczony srodek (eutymia)",
          "Lit nie celuje w jeden receptor — zmniejsza 'gain' w petlach sprzezenia zwrotnego na wielu poziomach jednoczesnie (synapsa, szlaki, obwody)",
          "Dziala jak reduktor szumu sieciowego — stabilizuje metabolizm mitochondrialny w wezlach sieci, przywracajac synchronizacje",
          "Przywraca elastycznosc metaboliczna — poszerza zakres stabilnosci przelacznika miedzy trybem glikolitycznym (mania) a oksydacyjnym (depresja)",
          "Modele dynamiczne potwierdzaja: lit zmienia topologie krajobrazu energetycznego, nie tylko sile poszczegolnych sygnalow",
        ],
      },
    ],
    detail: null,
    refs: [
      { label: "Geddes et al. 2004 — meta-analiza litu w bipolar", url: "https://pubmed.ncbi.nlm.nih.gov/15056503/" },
      { label: "Cipriani et al. 2013 — lit a ryzyko samobojstwa", url: "https://pubmed.ncbi.nlm.nih.gov/23472047/" },
      { label: "Malhi et al. 2013 — mechanizm dzialania litu", url: "https://pubmed.ncbi.nlm.nih.gov/23362251/" },
      { label: "Machado-Vieira 2018 — lit, mitochondria i GSK-3", url: "https://pubmed.ncbi.nlm.nih.gov/29307493/" },
      { label: "Bauer et al. 2022 — modele dynamiczne bipolarnosci (TranslPsychiatry)", url: "https://www.nature.com/articles/s41398-022-02194-4" },
      { label: "Mertens et al. 2015 — hiperpobudliwosc neuronow a odpowiedz na lit (Nature)", url: "https://www.nature.com/articles/nature15526" },
    ],
  },
  valproate: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 2.2, w: 0.20 },
      { cx:  0.00, depth: 0.0, w: 0.25 },
      { cx:  0.68, depth: 2.2, w: 0.20 },
    ],
    damping: 0.88, gravity: 4, barrierH: 0, jitter: 0,
    label: "Walproinian", icon: "🛡️", color: "#9b59b6",
    halfLife: 18, onset: 4,
    desc: "Kulka porusza sie w 'miodzie' — przejscia miedzy stanami sa wolniejsze, ale krajobraz sie nie zmienia.",
    detail: "Wzmacnia transmisje GABA-ergiczna i blokuje kanaly sodowe zalezne od napiecia. Skuteczny glownie w ostrej manii i u pacjentow z szybkim cyklowaniem. Nie wykazuje istotnej skutecznosci w depresji bipolarnej. Terrain (studnie) pozostaje bez zmian — lek spowalnia dynamike kulki, ale nie zmienia docelowych stanow.",
    refs: [
      { label: "Bowden et al. 1994 — walproinian vs lit w manii (JAMA)", url: "https://pubmed.ncbi.nlm.nih.gov/8133987/" },
      { label: "Macritchie et al. 2003 — przeglad Cochrane walproinianow", url: "https://pubmed.ncbi.nlm.nih.gov/12535471/" },
    ],
  },
  lamotrigine: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 2.2, w: 0.20 },
      { cx:  0.00, depth: 0.35, w: 0.25 },
      { cx:  0.68, depth: 0.55, w: 0.22 },
    ],
    damping: 0.985, gravity: 14, barrierH: 0, jitter: 0,
    label: "Lamotrigina", icon: "🛡️", color: "#e67e22",
    halfLife: 30, onset: 10,
    desc: "Splyca depresyjny dolek (blokada glutaminianu) — ale mania pozostaje gleboka. Asymetryczna ochrona.",
    detail: "Blokaje napieciozalezne kanaly sodowe i hamuje uwalnianie glutaminianu. Wykazuje dobrze udokumentowana skutecznosc w zapobieganiu epizodom depresji, przy znacznie slabszym dzialaniu przeciwmaniakalnym. Wymaga bardzo wolnego miareczkowania dawki (ryzyko ciezkiej wysypki Stevensa-Johnsona przy zbyt szybkim zwiekszaniu). Asymetria w wizualizacji — depresja splyca sie, ale mania nie.",
    refs: [
      { label: "Calabrese et al. 1999 — lamotrigina w depresji bipolarnej (JClinPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/10084637/" },
      { label: "Geddes et al. 2009 — meta-analiza lamotriginy (BrJPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/19169266/" },
    ],
  },
  aripiprazole: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 1.0, w: 0.20 },
      { cx:  0.00, depth: 0.0, w: 0.25 },
      { cx:  0.68, depth: 2.2, w: 0.20 },
    ],
    damping: 0.982, gravity: 13, barrierH: 1.4, jitter: 0,
    label: "Aripiprazol", icon: "🧠", color: "#3498db",
    halfLife: 22, onset: 4,
    desc: "Splyca dolek manii i stawia umiarkowana bariere ('termostat' D2). Jesli kulka jest w manii — stopniowo z niej wyplywa. Depresji nie dotyka.",
    detail: "Aripiprazol jest unikalny wsrod atypowych antypsychotykow — dziala jako agonista czesciowy receptorow D2 (i 5-HT1A) oraz antagonista 5-HT2A. Zamiast calkowicie blokowac dopamine, 'moduluje' ja — w stanach nadmiaru (mania) obniza aktywnosc, a przy niedoborze moze ja delikatnie wzmocnic. W ostrej manii redukuje glebokosci basenu maniakalnego, a bariera profilaktyczna zapobiega nawrotom. Mniejsze ryzyko metaboliczne niz kwetiapina czy olanzapina.",
    refs: [
      { label: "Keck et al. 2003 — aripiprazol w ostrej manii (AmJPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/12668363/" },
      { label: "Marcus et al. 2008 — aripiprazol jako augmentacja w depresji (JClinPsychopharmacol)", url: "https://pubmed.ncbi.nlm.nih.gov/18344725/" },
      { label: "Shapiro et al. 2003 — aripiprazol: agonista czesciowy D2 (Neuropsychopharmacol)", url: "https://pubmed.ncbi.nlm.nih.gov/12700681/" },
    ],
  },
  quetiapine: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 0.9, w: 0.20 },
      { cx:  0.00, depth: 0.0, w: 0.25 },
      { cx:  0.68, depth: 1.2, w: 0.20 },
    ],
    damping: 0.94, gravity: 8, barrierH: 1.6, jitter: 0,
    label: "Kwetiapina", icon: "🧠", color: "#2980b9",
    halfLife: 16, onset: 2.5,
    desc: "Splyca oba dolki (mania i depresja) + sedacja + bariera. Dwukierunkowa, ale ciezka metabolicznie.",
    detail: "Kwetiapina ma szeroki profil receptorowy — blokuje D2, 5-HT2A, H1 (sedacja) i alfa-1. Jedyny atypowy antypsychotyk z udowodniona skutecznoscia zarowno w manii JAK i depresji bipolarnej (badania BOLDER). Spytca studnie manii silniej, depresji slabiej. Niska grawitacja w wizualizacji oddaje sedacje — kulka porusza sie wolno, ale moze uciec z obu patologicznych studzien. Glowna wada: znaczny przyrost masy ciala i ryzyko metaboliczne.",
    refs: [
      { label: "Calabrese et al. 2005 — kwetiapina w depresji bipolarnej BOLDER I (AmJPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/16135615/" },
      { label: "Thase et al. 2006 — kwetiapina w depresji bipolarnej BOLDER II", url: "https://pubmed.ncbi.nlm.nih.gov/17196055/" },
      { label: "Bowden et al. 2005 — kwetiapina w manii (JClinPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/15889941/" },
    ],
  },
  olanzapine: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 0.5, w: 0.20 },
      { cx:  0.00, depth: 0.0, w: 0.25 },
      { cx:  0.68, depth: 2.2, w: 0.20 },
    ],
    damping: 0.93, gravity: 6, barrierH: 2.0, jitter: 0,
    label: "Olanzapina", icon: "🧠", color: "#5dade2",
    halfLife: 20, onset: 2,
    desc: "Najsilniejsze splycenie dolka manii — kulka wypycha sie nawet z glebokiej manii. Silna sedacja. Depresji nie dotyka.",
    detail: "Olanzapina to atypowy antypsychotyk o silnym powinowactwie do receptorow D2, 5-HT2A, H1 i muskarynowych. Uznawana za jeden z najskuteczniejszych lekow w ostrej manii. Agresywnie redukuje glebokosci basenu maniakalnego — nawet przy poczatkowej pozycji w manii kulka stopniowo wypywa ku eutymii (silna sedacja spowalnia ruch). W polaczeniu z fluoksetyna wykazuje skutecznosc w depresji bipolarnej. Glowna wada: najwyzsze ryzyko metaboliczne.",
    refs: [
      { label: "Tohen et al. 1999 — olanzapina w ostrej manii (AmJPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/10025435/" },
      { label: "Tohen et al. 2003 — olanzapina + fluoksetyna w depresji bipolarnej", url: "https://pubmed.ncbi.nlm.nih.gov/14702556/" },
    ],
  },
  risperidone: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 0.75, w: 0.20 },
      { cx:  0.00, depth: 0.0,  w: 0.25 },
      { cx:  0.68, depth: 2.2,  w: 0.20 },
    ],
    damping: 0.975, gravity: 11, barrierH: 1.8, jitter: 0,
    label: "Risperidon", icon: "🧠", color: "#85c1e9",
    halfLife: 18, onset: 2.5,
    desc: "Wyrazne splycenie manii + bariera. Szybki efekt, ale ryzyko sztywnosci i hiperprolaktynemii.",
    detail: "Risperidon to silny antagonista D2 i 5-HT2A. Skutecznie redukuje glebokosci basenu maniakalnego i tworzy bariere profilaktyczna. W ostrej manii kulka stopniowo wyplywa ku eutymii. Bardziej 'typowy' profil niz aripiprazol — silniejsza blokada D2 oznacza lepszy efekt antymaniakalny, ale wieksze ryzyko objawow pozapiramidowych (sztywnosc, akatyzja) i hiperprolaktynemii. Dostepny w formie dlugodzialajacych iniekcji.",
    refs: [
      { label: "Hirschfeld et al. 2004 — risperidon w ostrej manii (JClinPsychopharmacol)", url: "https://pubmed.ncbi.nlm.nih.gov/15118480/" },
      { label: "Yatham et al. 2003 — risperidon jako augmentacja stabilizatorow", url: "https://pubmed.ncbi.nlm.nih.gov/12587190/" },
    ],
  },
  clonazepam: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 2.2, w: 0.20 },
      { cx:  0.00, depth: 0.0, w: 0.25 },
      { cx:  0.68, depth: 2.2, w: 0.20 },
    ],
    damping: 0.83, gravity: 2.5, barrierH: 0, jitter: 0,
    label: "Klonazepam", icon: "💊", color: "#1abc9c",
    halfLife: 12, onset: 1.5,
    desc: "Zalewa krajobraz olejem (masywne GABA). Szybka ulga, zero naprawy struktury — po odstawieniu 'odbicie'.",
    detail: "Benzodiazepin dzialajacy przez wzmocnienie receptorow GABA-A — zwiekszenie czestotliwosci otwierania kanalow chlorkowych. Efekt jest szybki i silny (kulka prawie nieruchoma), ale nie zmienia struktury krajobrazu. Przy dluzszym stosowaniu rozwija sie tolerancja i zaleznosc fizyczna. Odstawienie wiaze sie z silnym 'odbiciem' pobudliwosci (rebound anxiety, drgawki). Nie jest uznanym lekiem stabilizujacym nastroj.",
    refs: [
      { label: "Chouinard et al. 1983 — klonazepam w manii (BiolPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/6135288/" },
      { label: "Ashton 2005 — syndrom odstawienny benzodiazepin (JSubstAbuse)", url: "https://pubmed.ncbi.nlm.nih.gov/15963697/" },
    ],
  },
  thc: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 2.6, w: 0.20 },
      { cx:  0.00, depth: 0.0, w: 0.25 },
      { cx:  0.68, depth: 2.4, w: 0.20 },
    ],
    damping: 0.985, gravity: 14, barrierH: 0, jitter: 0.45,
    label: "THC", icon: "🌿", color: "#f39c12",
    halfLife: 8, onset: 1,
    desc: "Rozregulowuje krajobraz — dolki oscyluja losowo. Chwilowa ulga, ale z czasem wieksze ryzyko epizodow.",
    detail: "THC dziala na receptory CB1 w ukladzie limbicznym i korze przedczolowej, zaburzajac regulacje dopaminy i serotoniny. U osob z bipolarem zwieksza ryzyko epizodow maniakalnych i przyspiesza cyklowanie. Jitter w wizualizacji oddaje niestabilnosc 'termostatu' — kazdy dolek zmienia glebokoscia w sposob nieprzewidywalny. Metaanaliza wykazuje, ze regularne uzywanie cannabis wiaze sie z 2-krotnie wyzszym ryzykiem nawrotu.",
    refs: [
      { label: "Gibbs et al. 2015 — cannabis i mania: przeglad systematyczny (JAffectDisord)", url: "https://pubmed.ncbi.nlm.nih.gov/25534936/" },
      { label: "Mammen et al. 2018 — cannabis a dlugoterminowe objawy nastroju (JClinPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/29995353/" },
    ],
  },
  ketamine: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 2.2, w: 0.20 },
      { cx:  0.00, depth: 0.0, w: 0.25 },
      { cx:  0.68, depth: 0.12, w: 0.22 },
    ],
    damping: 0.985, gravity: 14, barrierH: 0, jitter: 0,
    label: "Ketamina", icon: "💉", color: "#f39c12",
    halfLife: 5, onset: 0.5,
    desc: "Blyskawicznie zasypuje depresyjny dolek (blokada NMDA). Efekt spektakularny, ale krotkotrwaly — krajobraz wraca do normy w minuty/godziny.",
    detail: "Antagonista receptorow NMDA. Powoduje szybka synaptogeneze w korze przedczolowej (wzrost polaczen synaptycznych w ciagu godzin). Jedyny znany lek dajacy efekt antydepresyjny w ciagu minut, nie tygodni. Nie zmienia trwale krajobrazu — zasypuje depresyjny dolek chwilowo. Stosowany w depresji opornej na leczenie, w tym bipolarnej. Ryzyko naduzywania i dysocjacji.",
    refs: [
      { label: "Zarate et al. 2006 — ketamina w depresji opornej (ArchGenPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/16894061/" },
      { label: "Diazgranados et al. 2010 — ketamina w depresji bipolarnej", url: "https://pubmed.ncbi.nlm.nih.gov/20679587/" },
    ],
  },
  mdma: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 1.5, w: 0.22 },
      { cx:  0.00, depth: 0.0, w: 0.25 },
      { cx:  0.68, depth: 1.3, w: 0.22 },
    ],
    damping: 0.985, gravity: 14, barrierH: 0, jitter: 0.60,
    label: "MDMA", icon: "💊", color: "#e91e8c",
    halfLife: 3, onset: 0.5,
    desc: "Splyca oba dolki (masywne 5-HT/DA) + silny chaos. Chwilowa ulga i otwartosc, ale nieprzewidywalny tor kulki — ryzyko manii.",
    detail: "MDMA powoduje masywne uwolnienie serotoniny, dopaminy i norepinefryny. W badaniach nad PTSD wykazuje obiecujace efekty terapeutyczne (Mitchell et al. 2021, Nature Medicine). W kontekscie bipolarnosci jest substancja wysokiego ryzyka — masywna stymulacja dopaminergiczna moze wyzwolic epizod maniakalny, a faza 'po' czesto zwieksza depresje (crash serotonergiczny). Jitter w wizualizacji oddaje nieprzewidywalnosc trajektorii: kulka moze trafic do eutymii, ale rownie dobrze w manie. Badania nad terapeutycznym MDMA wykluczaja zazwyczaj osoby z ChAD.",
    refs: [
      { label: "Mitchell et al. 2021 — MDMA-assisted therapy for PTSD (Nature Medicine)", url: "https://pubmed.ncbi.nlm.nih.gov/34031603/" },
      { label: "Reiff et al. 2020 — psychedelics and mood disorders: review (JClinPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/32100483/" },
      { label: "Strajhar et al. 2016 — MDMA pharmacology (JPharmacol)", url: "https://pubmed.ncbi.nlm.nih.gov/27107462/" },
    ],
  },
  ayahuasca: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 1.9, w: 0.20 },
      { cx:  0.00, depth: 0.0, w: 0.25 },
      { cx:  0.68, depth: 0.35, w: 0.24 },
    ],
    damping: 0.985, gravity: 14, barrierH: 0, jitter: 0.28,
    label: "Ajauaska", icon: "🌿", color: "#8d6e63",
    halfLife: 2.5, onset: 0.5,
    desc: "Silne i szybkie splycenie dolka depresji (agonizm 5-HT2A + MAOI). Pewien chaos, ale mniejszy niz MDMA. Manii prawie nie dotyka.",
    detail: "Ajauaska to mieszanina DMT (agonista 5-HT2A) i alkaloidow beta-karbolinowych (harmalina/harmina — inhibitory MAO). Badania kliniczne wykazuja szybki efekt antydepresyjny — Palhano-Fontes et al. 2019 (RCT, Psychological Medicine) pokazal redukcje depresji w ciagu 7 dni u pacjentow opornych na leczenie. Mechanizm: masywna stymulacja 5-HT2A nasila neuroplasticite i zmienia wzorce sieci domyslnej (DMN). W bipolarze: ryzyko wyzwolenia hipomanii/manii — inhibitory MAO wzmacniaja dopamine. Brak RCT swoiście dla ChAD. Jitter mniejszy niz MDMA — psychedeliki dzialaja bardziej 'ukierunkowanie'.",
    refs: [
      { label: "Palhano-Fontes et al. 2019 — RCT ajauaski w depresji opornej (PsycholMed)", url: "https://pubmed.ncbi.nlm.nih.gov/29903051/" },
      { label: "Osório et al. 2015 — ajauaska w depresji: otwarte badanie (RevBrasPsiquiatr)", url: "https://pubmed.ncbi.nlm.nih.gov/26154898/" },
      { label: "Dos Santos et al. 2016 — ajauaska: profil bezpieczenstwa i interakcje (Medicine)", url: "https://pubmed.ncbi.nlm.nih.gov/27741115/" },
    ],
  },
  ect: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 0.25, w: 0.20 },
      { cx:  0.00, depth: 0.65, w: 0.35 },
      { cx:  0.68, depth: 0.25, w: 0.20 },
    ],
    damping: 0.985, gravity: 19, barrierH: 0, jitter: 0,
    label: "EW", icon: "⚡", color: "#ffe600",
    halfLife: 9, onset: 0.2,
    desc: "Reset krajobrazu — mania i depresja prawie plaskie, eutymia staje sie prawdziwym atraktorem. Najsilniejsza interwencja w psychiatrii.",
    detail: "Elektrowstrzasy (EW) to jedna z najskuteczniejszych interwencji w psychiatrii — wskazania obejmuja ciazka depresje bipolarna, ostry stan maniakalny i depresje z ryzykiem samobojstwa. Mechanizm nie jest w pelni poznany: masywna synchroniczna aktywacja neuronalna normalizuje patologicznie utrwalone wzorce sieci. W wizualizacji: dramatyczna zmiana topologii krajobrazu — studnie manii i depresji spieszczaja sie niemal do zera, a eutymia (cx=0) staje sie prawdziwym atraktorem (kulka sama tam dazy). Efekt utrzymuje sie tygodniami po serii zabiegow. Glowne ograniczenia kliniczne: przejsciowe zaburzenia pamieci i napietnowosc spoleczna procedury.",
    refs: [
      { label: "UK ECT Review Group 2003 — skutecznosc EW w depresji (Lancet)", url: "https://pubmed.ncbi.nlm.nih.gov/14643118/" },
      { label: "Dierckx et al. 2012 — EW w depresji bipolarnej: meta-analiza (BrJPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/22450444/" },
      { label: "Versiani et al. 2011 — EW w manii: systematyczny przeglad (RevBrasPsiquiatr)", url: "https://pubmed.ncbi.nlm.nih.gov/22189930/" },
    ],
  },
};

// Bazowy krajobraz (bez leku)
const BASE = {
  wallStr: 1.5,
  wells: [
    { cx: -0.68, depth: 2.2, w: 0.20 },
    { cx:  0.00, depth: 0.0, w: 0.25 },
    { cx:  0.68, depth: 2.2, w: 0.20 },
  ],
  damping: 0.985, gravity: 14, barrierH: 0, jitter: 0,
};


// ── Pomocnicze ──────────────────────────────────────────────────────────────

function hexRgb(h) {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}
function toX(lx) { return PAD + ((lx - X_LO) / (X_HI - X_LO)) * (W - 2 * PAD); }
function toY(ly) { return PAD + ((Y_HI - ly) / (Y_HI - Y_LO)) * (H - 2 * PAD); }
function fromX(cx){ return X_LO + ((cx - PAD) / (W - 2 * PAD)) * (X_HI - X_LO); }

function lerp(a, b, t) { return a + (b - a) * t; }

// Blend wielu zestawow parametrow z wagami (concentrations)
function blendParams(activeDrugs) {
  // Start from BASE
  let totalWeight = 0;
  const result = {
    wallStr: BASE.wallStr,
    wells: BASE.wells.map(w => ({ ...w })),
    damping: BASE.damping,
    gravity: BASE.gravity,
    barrierH: BASE.barrierH,
    jitter: BASE.jitter,
  };

  for (const { key, conc } of activeDrugs) {
    if (conc < 0.001) continue;
    const d = DRUGS[key];
    totalWeight += conc;

    // Additive blend: kazdy lek przesuwa parametry od BASE w strone swojego targetu
    result.wallStr  = lerp(result.wallStr,  d.wallStr,  conc / (totalWeight));
    result.damping  = lerp(result.damping,  d.damping,  conc / (totalWeight));
    result.gravity  = lerp(result.gravity,  d.gravity,  conc / (totalWeight));
    result.barrierH = Math.max(result.barrierH, d.barrierH * conc); // bariera — max, nie mean
    result.jitter   = Math.max(result.jitter, d.jitter * conc);     // jitter — max
    for (let i = 0; i < 3; i++) {
      result.wells[i].depth = lerp(result.wells[i].depth, d.wells[i].depth, conc / (totalWeight));
      result.wells[i].w     = lerp(result.wells[i].w,     d.wells[i].w,     conc / (totalWeight));
    }
  }
  return result;
}

// ── Fizyka ──────────────────────────────────────────────────────────────────

function energy(x, p) {
  let y = p.wallStr * x * x;
  for (const w of p.wells) {
    if (w.depth < 0.001) continue;
    const d = x - w.cx;
    y -= w.depth * Math.exp(-d * d / (2 * w.w * w.w));
  }
  if (p.barrierH > 0.01) {
    const d = x - BARRIER.cx;
    y += p.barrierH * Math.exp(-d * d / (2 * BARRIER.w * BARRIER.w));
  }
  return y;
}

function grad(x, p) {
  let dy = 2 * p.wallStr * x;
  for (const w of p.wells) {
    if (w.depth < 0.001) continue;
    const d = x - w.cx;
    dy += w.depth * (d / (w.w * w.w)) * Math.exp(-d * d / (2 * w.w * w.w));
  }
  if (p.barrierH > 0.01) {
    const d = x - BARRIER.cx;
    dy += p.barrierH * (-d / (BARRIER.w * BARRIER.w)) * Math.exp(-d * d / (2 * BARRIER.w * BARRIER.w));
  }
  return dy;
}

// ── Komponent ───────────────────────────────────────────────────────────────

export default function App() {
  const canvasRef = useRef(null);

  // activeDrugs: { [key]: { on: bool, conc: number (0-1), phase: "onset"|"steady"|"decay" } }
  const [activeDrugs, setActiveDrugs] = useState({});
  const drugsRef = useRef({});
  const [, forceUpdate] = useState(0);

  const sim = useRef({
    ball: { x: 0.68, vx: 0, dragging: false },
    p: { ...BASE, wells: BASE.wells.map(w => ({ ...w })) },
    trail: [],
    lastTime: null,
  });

  const rafRef = useRef(null);

  // Toggle lek: klik = nowa dawka, ponowny klik = odklikniecie (szybszy zanik)
  const toggleDrug = useCallback((key) => {
    const cur = drugsRef.current[key];
    if (cur && cur.on) {
      // Odkliknij — natychmiastowe usuniecie
      drugsRef.current[key] = { on: false, conc: 0, phase: "decay" };
    } else {
      // Nowa dawka — onset od aktualnej koncentracji (mozna "dolaczyc")
      drugsRef.current[key] = { on: true, conc: cur ? cur.conc : 0, phase: "onset" };
    }
    setActiveDrugs({ ...drugsRef.current });
  }, []);

  // ── Petla animacji ──────────────────────────────────────────────────────

  const loop = useCallback((ts) => {
    const s = sim.current;
    if (!s.lastTime) s.lastTime = ts;
    const dt = Math.min((ts - s.lastTime) / 1000, 0.04);
    s.lastTime = ts;

    // Update koncentracji lekow
    let changed = false;
    const drugs = drugsRef.current;
    for (const key of Object.keys(drugs)) {
      const d = drugs[key];
      const cfg = DRUGS[key];
      if (d.phase === "onset") {
        // Narasta do peak
        const rate = dt / cfg.onset;
        d.conc = Math.min(1, d.conc + rate);
        if (d.conc >= 0.999) { d.conc = 1; d.phase = "decay"; }
        changed = true;
      } else if (d.phase === "decay") {
        // Exponential decay: conc *= 0.5^(dt/halfLife)
        // Jesli odklikniety (on=false), zanik 3x szybszy
        const hl = d.on ? cfg.halfLife : cfg.halfLife / 3;
        d.conc *= Math.pow(0.5, dt / hl);
        if (d.conc < 0.005) { d.conc = 0; }
        changed = true;
      }
    }
    if (changed) forceUpdate(n => n + 1);

    // Build blended target z aktywnych lekow
    const activeList = Object.entries(drugs)
      .filter(([, d]) => d.conc > 0.001)
      .map(([key, d]) => ({ key, conc: d.conc }));

    const target = activeList.length > 0 ? blendParams(activeList) : BASE;

    const t = Math.min(dt * 3.5, 1);

    // Interpoluj parametry w strone celu
    s.p.wallStr  += (target.wallStr  - s.p.wallStr)  * t;
    s.p.damping  += (target.damping  - s.p.damping)  * t;
    s.p.gravity  += (target.gravity  - s.p.gravity)  * t;
    s.p.barrierH += (target.barrierH - s.p.barrierH) * t;
    s.p.jitter   += (target.jitter   - s.p.jitter)   * t;

    for (let i = 0; i < 3; i++) {
      const tD = target.wells[i].depth;
      const tW = target.wells[i].w;
      s.p.wells[i].depth += (tD - s.p.wells[i].depth) * t;
      s.p.wells[i].w     += (tW - s.p.wells[i].w)     * t;
    }

    // THC jitter
    const physP = {
      wallStr: s.p.wallStr, barrierH: s.p.barrierH,
      wells: s.p.wells.map((w, i) => {
        if (s.p.jitter < 0.01 || i === 1) return w;
        const time = ts / 1000;
        const j = s.p.jitter * (
          Math.sin(time * (i === 0 ? 2.3 : 1.7) + i * 1.5) * 0.35 +
          Math.sin(time * (i === 0 ? 3.9 : 4.3) + i * 0.8) * 0.2
        );
        return { ...w, depth: Math.max(0.3, w.depth + j) };
      }),
    };

    // Fizyka kulki
    if (!s.ball.dragging) {
      const slope = grad(s.ball.x, physP);
      s.ball.vx += -slope * s.p.gravity * dt;
      s.ball.vx *= Math.pow(s.p.damping, dt * 60);
      s.ball.x  += s.ball.vx * dt;
      if (s.ball.x < X_LO + 0.02) { s.ball.x = X_LO + 0.02; s.ball.vx *= -0.3; }
      if (s.ball.x > X_HI - 0.02) { s.ball.x = X_HI - 0.02; s.ball.vx *= -0.3; }
    }

    s.trail.push(s.ball.x);
    if (s.trail.length > 28) s.trail.shift();

    // ── Rysowanie ─────────────────────────────────────────────────────────

    const canvas = canvasRef.current;
    if (!canvas) { rafRef.current = requestAnimationFrame(loop); return; }
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#0d0d1b";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let yv = -2; yv <= 2.5; yv += 0.5) {
      const cy = toY(yv);
      ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(W - PAD, cy); ctx.stroke();
    }

    // ── Oblicz krzywe ─────────────────────────────────────────────────
    const N = 500;

    // Bazowy krajobraz bipolarny (zawsze widoczny)
    const basePts = [];
    for (let i = 0; i <= N; i++) {
      const lx = X_LO + (X_HI - X_LO) * (i / N);
      basePts.push([toX(lx), toY(energy(lx, BASE))]);
    }

    // Efektywny krajobraz (fizyka kulki)
    const physPts = [];
    for (let i = 0; i <= N; i++) {
      const lx = X_LO + (X_HI - X_LO) * (i / N);
      physPts.push([toX(lx), toY(energy(lx, physP))]);
    }

    // Czy lit jest aktywny? Tylko lit zmienia sam teren
    const lithConc = (drugs.lithium && drugs.lithium.conc) || 0;
    const hasNonLithium = activeList.some(a => a.key !== "lithium" && a.conc > 0.01);

    // Dominant color
    const sorted = [...activeList].sort((a, b) => b.conc - a.conc);
    const domKey = sorted.length > 0 ? sorted[0].key : null;
    const col = domKey ? DRUGS[domKey].color : "#e74c3c";
    const [cr, cg, cb] = hexRgb(col);

    // ── 1. Bazowy krajobraz (ghost) ─────────────────────────────────
    // Wypelnienie pod baza
    ctx.beginPath();
    ctx.moveTo(basePts[0][0], H);
    for (const [px, py] of basePts) ctx.lineTo(px, py);
    ctx.lineTo(basePts[basePts.length - 1][0], H);
    ctx.closePath();
    const baseFg = ctx.createLinearGradient(0, 0, 0, H);
    baseFg.addColorStop(0, "rgba(231,76,60,0.02)");
    baseFg.addColorStop(1, "rgba(231,76,60,0.08)");
    ctx.fillStyle = baseFg;
    ctx.fill();

    // Linia bazowa (ghost — przyciemniona)
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      if (i === 0) ctx.moveTo(basePts[i][0], basePts[i][1]);
      else ctx.lineTo(basePts[i][0], basePts[i][1]);
    }
    ctx.strokeStyle = activeList.length > 0 ? "rgba(231,76,60,0.25)" : "#e74c3c";
    ctx.lineWidth = activeList.length > 0 ? 1.5 : 2.5;
    ctx.stroke();

    // ── 2. Kolorowe wypelnienia — leki "zasypuja" dolki ─────────────
    // Rysuj fill miedzy baza a efektywnym krajobrazem tam, gdzie efektywny jest WYZEJ
    // (dolek jest plytszy = zasypany)
    if (hasNonLithium || lithConc > 0.01) {
      // Per-drug fills: kazdy lek zasypuje swoim kolorem
      for (const { key, conc } of activeList) {
        if (conc < 0.01) continue;
        const d = DRUGS[key];
        const [dr, dg, db] = hexRgb(d.color);

        if (key === "lithium") {
          // Lit zmienia teren — rysuj nowa linie terenu zamiast fill
          continue;
        }

        // Oblicz krajobraz TYLKO tego leku (bez mieszania z innymi)
        // ale skalowany przez jego koncentracje
        const drugTarget = blendParams([{ key, conc }]);
        const drugPts = [];
        for (let i = 0; i <= N; i++) {
          const lx = X_LO + (X_HI - X_LO) * (i / N);
          drugPts.push(toY(energy(lx, drugTarget)));
        }

        // Rysuj fill miedzy baza a drug-modified tam gdzie drug jest wyzej (dolek zasypany)
        ctx.beginPath();
        let drawing = false;
        for (let i = 0; i <= N; i++) {
          const baseY = basePts[i][1];
          const drugY = drugPts[i];
          const x = basePts[i][0];
          // Rysuj fill gdzie lek "podnosi" teren (drugY < baseY w pikselach = wyzej)
          if (drugY < baseY - 0.5) {
            if (!drawing) { ctx.moveTo(x, baseY); drawing = true; }
            ctx.lineTo(x, drugY);
          } else {
            if (drawing) { ctx.lineTo(x, basePts[i][1]); drawing = false; }
          }
        }
        if (drawing) ctx.lineTo(basePts[N][0], basePts[N][1]);
        ctx.closePath();

        // Wypelnienie z gradientem — wyglada jak sypany material
        const fillAlpha = Math.min(0.35, conc * 0.4);
        ctx.fillStyle = `rgba(${dr},${dg},${db},${fillAlpha})`;
        ctx.fill();

        // Delikatna gorna krawedz wypelnienia
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const baseY = basePts[i][1];
          const drugY = drugPts[i];
          const x = basePts[i][0];
          if (drugY < baseY - 0.5) {
            if (i === 0 || !(drugPts[i-1] < basePts[i-1][1] - 0.5)) ctx.moveTo(x, drugY);
            else ctx.lineTo(x, drugY);
          }
        }
        ctx.strokeStyle = `rgba(${dr},${dg},${db},${fillAlpha + 0.15})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // ── 3. Lit — rysuj zmieniony teren jako pelna krzywa ────────────
    if (lithConc > 0.01) {
      const [lr, lg, lb] = hexRgb(DRUGS.lithium.color);
      // Wypelnienie pod nowym terenem litu
      ctx.beginPath();
      ctx.moveTo(physPts[0][0], H);
      for (const [px, py] of physPts) ctx.lineTo(px, py);
      ctx.lineTo(physPts[physPts.length - 1][0], H);
      ctx.closePath();
      const litFg = ctx.createLinearGradient(0, 0, 0, H);
      litFg.addColorStop(0, `rgba(${lr},${lg},${lb},0.03)`);
      litFg.addColorStop(1, `rgba(${lr},${lg},${lb},${0.12 * lithConc})`);
      ctx.fillStyle = litFg;
      ctx.fill();

      // Linia terenu litu
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        if (i === 0) ctx.moveTo(physPts[i][0], physPts[i][1]);
        else ctx.lineTo(physPts[i][0], physPts[i][1]);
      }
      ctx.strokeStyle = `rgba(${lr},${lg},${lb},${Math.min(1, lithConc + 0.3)})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // ── 4. Efektywna krzywa (cienka, po ktorej jedzie kulka) ────────
    if (hasNonLithium) {
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        if (i === 0) ctx.moveTo(physPts[i][0], physPts[i][1]);
        else ctx.lineTo(physPts[i][0], physPts[i][1]);
      }
      ctx.strokeStyle = `rgba(255,255,255,0.15)`;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }


    // ── 6. Bariera antypsychotykow ──────────────────────────────────
    if (s.p.barrierH > 0.15) {
      const bx = toX(BARRIER.cx);
      const bTop = toY(energy(BARRIER.cx, physP));
      const alpha = Math.min(0.75, s.p.barrierH / 4);
      const bg = ctx.createLinearGradient(bx, bTop - 50, bx, H);
      bg.addColorStop(0,   `rgba(52,152,219,0)`);
      bg.addColorStop(0.15,`rgba(52,152,219,${alpha * 0.7})`);
      bg.addColorStop(0.7, `rgba(52,152,219,${alpha * 0.3})`);
      bg.addColorStop(1,   `rgba(52,152,219,0)`);
      ctx.fillStyle = bg;
      ctx.fillRect(bx - 5, bTop - 50, 10, H - bTop + 50);
      ctx.fillStyle = `rgba(52,152,219,${alpha})`;
      ctx.font = "bold 8px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("BARIERA D2", bx, bTop - 55);
    }

    // ── 7. Etykiety stref ───────────────────────────────────────────
    const zones = [
      { lx: -0.68, label: "MANIA",    zc: "#e74c3c" },
      { lx:  0.00, label: "EUTYMIA",  zc: "#f1c40f" },
      { lx:  0.68, label: "DEPRESJA", zc: "#3498db" },
    ];
    for (const z of zones) {
      const ly  = energy(z.lx, physP);
      const cx  = toX(z.lx);
      const cy  = toY(ly);
      const g2  = grad(z.lx + 0.01, physP) - grad(z.lx - 0.01, physP);
      const stb = g2 > 0;
      ctx.strokeStyle = z.zc + "44";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy + (stb ? 4 : -4));
      ctx.lineTo(cx, cy + (stb ? 26 : -26));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = z.zc + "bb";
      ctx.font = "bold 9px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(z.label, cx, cy + (stb ? 38 : -36));
      ctx.font = "8px system-ui";
      ctx.fillStyle = z.zc + "77";
      ctx.fillText(stb ? "▼" : "▲", cx, cy + (stb ? 27 : -26));
    }

    // ── 8. Klonazepam olej ──────────────────────────────────────────
    if (s.p.damping < 0.86 && s.p.gravity < 4) {
      const oilAlpha = Math.min(0.18, (0.86 - s.p.damping) * 2);
      ctx.beginPath();
      ctx.moveTo(basePts[0][0], H);
      for (const [px, py] of basePts) ctx.lineTo(px, py);
      ctx.lineTo(basePts[basePts.length - 1][0], H);
      ctx.closePath();
      ctx.fillStyle = `rgba(26,188,156,${oilAlpha})`;
      ctx.fill();
      ctx.fillStyle = `rgba(26,188,156,${oilAlpha + 0.15})`;
      ctx.font = "bold 9px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("GABA 'OLEJ'", W / 2, PAD - 8);
    }

    // ── 9. Walproinian trail ────────────────────────────────────────
    if (s.p.damping < 0.96 && s.p.damping >= 0.86 && s.trail.length > 4) {
      for (let i = 0; i < s.trail.length - 1; i++) {
        const a = (i / s.trail.length) * 0.28;
        const tx = s.trail[i];
        const ty = energy(tx, physP);
        ctx.fillStyle = `rgba(155,89,182,${a})`;
        ctx.beginPath();
        ctx.arc(toX(tx), toY(ty) - BALL_R, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ── 10. Kulka ───────────────────────────────────────────────────
    const bly = energy(s.ball.x, physP);
    const bCX = toX(s.ball.x);
    const bCY = toY(bly) - BALL_R;

    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "#8ab";
    ctx.beginPath();
    ctx.ellipse(bCX, toY(bly) + 3, BALL_R * 1.3, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const glow = ctx.createRadialGradient(bCX, bCY, 0, bCX, bCY, 26);
    glow.addColorStop(0, "rgba(160,200,255,0.26)");
    glow.addColorStop(1, "rgba(100,150,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bCX, bCY, 26, 0, Math.PI * 2);
    ctx.fill();

    const ballG = ctx.createRadialGradient(bCX - 3, bCY - 3, 2, bCX, bCY, BALL_R);
    ballG.addColorStop(0,    "#ffffff");
    ballG.addColorStop(0.45, "#c8dcff");
    ballG.addColorStop(1,    "#3355aa");
    ctx.fillStyle = ballG;
    ctx.beginPath();
    ctx.arc(bCX, bCY, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  // ── Obsluga myszy / dotyku ────────────────────────────────────────────────

  const mouseX = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const c = e.touches ? e.touches[0].clientX : e.clientX;
    return (c - r.left) * (canvasRef.current.width / r.width);
  };

  const onDown = (e) => {
    const s = sim.current;
    if (Math.abs(mouseX(e) - toX(s.ball.x)) < 30) {
      s.ball.dragging = true; s.ball.vx = 0;
    }
  };
  const onMove = (e) => {
    const s = sim.current;
    if (!s.ball.dragging) return;
    s.ball.x = Math.max(X_LO + 0.02, Math.min(X_HI - 0.02, fromX(mouseX(e))));
  };
  const onUp = () => { sim.current.ball.dragging = false; };

  // ── Akcje ───────────────────────────────────────────────────────────────────

  const disturb = () => {
    sim.current.ball.vx += (Math.random() > 0.5 ? 1 : -1) * (3.5 + Math.random() * 1.2);
  };


  // ── Render ──────────────────────────────────────────────────────────────────

  const pill = (active, color) => ({
    padding: "8px 14px", borderRadius: 8, cursor: "pointer",
    fontWeight: 600, fontSize: 13, transition: "all 0.25s", lineHeight: 1,
    border: `2px solid ${active ? color : "rgba(255,255,255,0.14)"}`,
    background: active ? `${color}22` : "transparent",
    color: active ? color : "rgba(255,255,255,0.42)",
    whiteSpace: "nowrap",
  });

  const actionBtn = (color) => ({
    padding: "8px 16px", borderRadius: 8, cursor: "pointer",
    fontWeight: 600, fontSize: 13, lineHeight: 1, transition: "all 0.25s",
    border: `2px solid ${color}55`,
    background: "transparent",
    color: `${color}bb`,
    whiteSpace: "nowrap",
  });

  // Collect active descriptions
  const activeDescs = Object.entries(drugsRef.current)
    .filter(([, d]) => d.conc > 0.01)
    .sort((a, b) => b[1].conc - a[1].conc);

  const noActive = activeDescs.length === 0;

  return (
    <div style={{
      background: "#0d0d1b", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-start",
      gap: 16, padding: "20px 10px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#dde",
    }}>
      <style>{`
        @media (max-width: 600px) {
          h2 { fontSize: 18px !important; }
          .canvas-container { gap: 10px !important; }
          .pill-button { padding: 6px 10px !important; font-size: 11px !important; }
          .section-label { font-size: 9px !important; min-width: auto !important; margin-bottom: 4px; }
          .drug-section { flex-direction: column !important; align-items: center !important; gap: 4px !important; }
          .bars-container { width: 100%; justify-content: center; }
        }
        @media (max-width: 1100px) {
          .main-content { flex-direction: column !important; align-items: center !important; }
          .description-panel { max-width: 800px !important; width: 100% !important; max-height: none !important; }
        }
        canvas {
          max-width: 100%;
          height: auto !important;
          background: #0d0d1b;
        }
      `}</style>

      <h2 style={{ color: "#dde", margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: 0.4, textAlign: "center" }}>
        Krajobraz energetyczny — atraktory w chorobie dwubiegunowej
      </h2>
      <p style={{ color: "rgba(255,255,255,0.35)", margin: 0, fontSize: 13, textAlign: "center", maxWidth: 700 }}>
        Klikaj leki aby je wlaczac/wylaczac. Mozesz laczyc wiele naraz. Obserwuj onset i zanik.
      </p>

      {/* ── Sekcje lekow ── */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 12, alignItems: "center",
        width: "100%", maxWidth: 1000,
      }}>
        {[
          { title: "Stabilizatory nastroju", keys: ["lithium", "valproate", "lamotrigine"] },
          { title: "Antypsychotyki", keys: ["aripiprazole", "quetiapine", "olanzapine", "risperidone"] },
          { title: "Substancje", keys: ["ketamine", "mdma", "ayahuasca", "clonazepam", "thc"] },
          { title: "Inne", keys: ["ect"] },
        ].map((sec) => (
          <div key={sec.title} className="drug-section" style={{
            display: "flex", alignItems: "center", gap: 10,
            flexWrap: "wrap", justifyContent: "center",
            width: "100%",
          }}>
            <span className="section-label" style={{
              color: "rgba(255,255,255,0.25)", fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 1.2, minWidth: 100,
              textAlign: "right",
            }}>{sec.title}</span>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {sec.keys.map(k => {
                const d = DRUGS[k];
                const state = drugsRef.current[k];
                const isOn = state && state.on;
                return (
                  <button key={k} className="pill-button" onClick={() => toggleDrug(k)} style={pill(isOn, d.color)}>
                    {d.icon} {d.label}
                  </button>
                );
              })}
              {sec.actions && sec.actions.map((act, i) => (
                <button key={i} className="pill-button" onClick={act.onClick} style={actionBtn(act.color)}>
                  {act.label}
                </button>
              ))}
            </div>

            <div className="bars-container" style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {sec.keys.map(k => {
                const d = DRUGS[k];
                const state = drugsRef.current[k];
                const conc = state ? state.conc : 0;
                if (conc < 0.005 && !(state && state.on)) return null;
                return (
                  <div key={k + "_bar"} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 8px", borderRadius: 6,
                    background: "rgba(255,255,255,0.04)",
                    fontSize: 11, color: d.color, minWidth: 80,
                  }}>
                    <span style={{ opacity: 0.7 }}>{d.icon}</span>
                    <div style={{
                      width: 40, height: 4, borderRadius: 2,
                      background: "rgba(255,255,255,0.08)", overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${conc * 100}%`, height: "100%",
                        background: d.color,
                        transition: "width 0.1s linear",
                      }} />
                    </div>
                    <span style={{ fontSize: 10, opacity: 0.6, width: 24, textAlign: "right" }}>
                      {Math.round(conc * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Glowna sekcja: wykres + opis obok siebie ── */}
      <div className="main-content" style={{
        display: "flex", gap: 16, alignItems: "flex-start",
        maxWidth: 1240, width: "100%", justifyContent: "center",
        flexWrap: "wrap",
      }}>
        {/* Plotno */}
        <div className="canvas-container" style={{ position: "relative", flexShrink: 1, minWidth: 0 }}>
          <canvas ref={canvasRef} width={W} height={H}
            style={{
              borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)",
              cursor: "grab", touchAction: "none",
              display: "block",
            }}
            onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
            onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
          />
          
          {/* Przycisk Stresor nakladany na wykres */}
          <button 
            onClick={(e) => { e.stopPropagation(); disturb(); }}
            style={{
              ...actionBtn("#ffbe3c"),
              position: "absolute",
              bottom: 15,
              left: 15,
              background: "rgba(255,190,60,0.1)",
              backdropFilter: "blur(4px)",
              fontSize: 12,
              padding: "6px 12px",
              zIndex: 10,
            }}
            onMouseOver={e => e.target.style.background = "rgba(255,190,60,0.2)"}
            onMouseOut={e => e.target.style.background = "rgba(255,190,60,0.1)"}
          >
            ⚡ Stresor
          </button>
        </div>

        {/* Opis aktywnych lekow — panel po prawej */}
        <div className="description-panel" style={{
          flex: "1 1 340px", maxWidth: 440, minWidth: 280,
          padding: "16px 20px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)",
          maxHeight: H, overflowY: "auto",
        }}>
          {noActive ? (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0, lineHeight: 1.7 }}>
              ⚡ Bez leku: Eutymia to szczyt — kazde zaburzenie straca kulke w manie lub depresje.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activeDescs.map(([key, state]) => {
                const d = DRUGS[key];
                const pct = Math.round(state.conc * 100);
                const phaseLabel = state.phase === "onset"
                  ? " (narasta)"
                  : state.on ? " (zanika)" : " (odstawiony)";
                return (
                  <div key={key} style={{
                    borderLeft: `3px solid ${d.color}55`,
                    paddingLeft: 12,
                    display: "flex", flexDirection: "column", gap: 5,
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ color: d.color, fontWeight: 700, fontSize: 15 }}>
                        {d.icon} {d.label}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                        {pct}%{phaseLabel}
                      </span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>
                      {d.desc}
                    </p>
                    {d.detail && (
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>
                        {d.detail}
                      </p>
                    )}
                    {d.sections && d.sections.map((sec, si) => (
                      <div key={si} style={{ marginTop: si === 0 ? 4 : 0 }}>
                        <p style={{ color: d.color, opacity: 0.75, fontSize: 12, margin: "0 0 4px 0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                          {sec.heading}
                        </p>
                        {sec.items.map((item, ii) => (
                          <p key={ii} style={{ color: "rgba(255,255,255,0.45)", fontSize: 12.5, margin: "2px 0", lineHeight: 1.55, paddingLeft: 12 }}>
                            <span style={{ color: d.color, opacity: 0.5, marginRight: 5 }}>&#8227;</span>{item}
                          </p>
                        ))}
                      </div>
                    ))}
                    {d.refs && d.refs.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 4 }}>
                        {d.refs.map((ref, i) => (
                          <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer"
                            style={{
                              color: d.color, opacity: 0.7, fontSize: 11.5,
                              textDecoration: "none", borderBottom: `1px dotted ${d.color}55`,
                            }}
                            onMouseOver={e => e.target.style.opacity = 1}
                            onMouseOut={e => e.target.style.opacity = 0.7}
                          >
                            📄 {ref.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
