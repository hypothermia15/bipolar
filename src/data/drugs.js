export const DRUGS = {
  lithium: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 0.65, w: 0.20 },
      { cx:  0.00, depth: 2.10, w: 0.30 },
      { cx:  0.68, depth: 0.65, w: 0.20 },
    ],
    damping: 0.985, gravity: 14, barrierH: 0, jitter: 0,
    icon: "⚛️", color: "#27ae60",
    halfLife: 25, onset: 8,
    refs: [
      { label: "Geddes et al. 2004 — meta-analiza litu w bipolar", url: "https://pubmed.ncbi.nlm.nih.gov/15056503/" },
      { label: "Cipriani et al. 2013 — lit a ryzyko samobojstwa", url: "https://pubmed.ncbi.nlm.nih.gov/23472047/" },
      { label: "Malhi et al. 2013 — mechanizm dzialania litu", url: "https://pubmed.ncbi.nlm.nih.gov/23362251/" },
      { label: "Machado-Vieira 2018 — lit, mitochondria i GSK-3", url: "https://pubmed.ncbi.nlm.nih.gov/29307493/" },
      { label: "Bauer et al. 2022 — modele dynamiczne bipolarnosci", url: "https://www.nature.com/articles/s41398-022-02194-4" },
      { label: "Mertens et al. 2015 — hiperpobudliwosc neuronow (Nature)", url: "https://www.nature.com/articles/nature15526" },
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
    icon: "🛡️", color: "#9b59b6",
    halfLife: 18, onset: 4,
    refs: [
      { label: "Bowden et al. 1994 — walproinian vs lit w manii", url: "https://pubmed.ncbi.nlm.nih.gov/8133987/" },
      { label: "Macritchie et al. 2003 — przeglad Cochrane", url: "https://pubmed.ncbi.nlm.nih.gov/12535471/" },
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
    icon: "🛡️", color: "#e67e22",
    halfLife: 30, onset: 10,
    refs: [
      { label: "Calabrese et al. 1999 — lamotrigina w depresji", url: "https://pubmed.ncbi.nlm.nih.gov/10084637/" },
      { label: "Geddes et al. 2009 — meta-analiza lamotriginy", url: "https://pubmed.ncbi.nlm.nih.gov/19169266/" },
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
    icon: "🧠", color: "#3498db",
    halfLife: 22, onset: 4,
    refs: [
      { label: "Keck et al. 2003 — aripiprazol w ostrej manii", url: "https://pubmed.ncbi.nlm.nih.gov/12668363/" },
      { label: "Marcus et al. 2008 — augmentacja w depresji", url: "https://pubmed.ncbi.nlm.nih.gov/18344725/" },
      { label: "Shapiro et al. 2003 — mechanizm agonizmu D2", url: "https://pubmed.ncbi.nlm.nih.gov/12700681/" },
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
    icon: "🧠", color: "#2980b9",
    halfLife: 16, onset: 2.5,
    refs: [
      { label: "Calabrese et al. 2005 — badanie BOLDER I", url: "https://pubmed.ncbi.nlm.nih.gov/16135615/" },
      { label: "Thase et al. 2006 — badanie BOLDER II", url: "https://pubmed.ncbi.nlm.nih.gov/17196055/" },
      { label: "Bowden et al. 2005 — kwetiapina w manii", url: "https://pubmed.ncbi.nlm.nih.gov/15889941/" },
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
    icon: "🧠", color: "#5dade2",
    halfLife: 20, onset: 2,
    refs: [
      { label: "Tohen et al. 1999 — olanzapina w ostrej manii", url: "https://pubmed.ncbi.nlm.nih.gov/10025435/" },
      { label: "Tohen et al. 2003 — olanzapina + fluoksetyna", url: "https://pubmed.ncbi.nlm.nih.gov/14702556/" },
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
    icon: "🧠", color: "#85c1e9",
    halfLife: 18, onset: 2.5,
    refs: [
      { label: "Hirschfeld et al. 2004 — risperidon w manii", url: "https://pubmed.ncbi.nlm.nih.gov/15118480/" },
      { label: "Yatham et al. 2003 — risperidon jako augmentacja", url: "https://pubmed.ncbi.nlm.nih.gov/12587190/" },
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
    icon: "💊", color: "#1abc9c",
    halfLife: 12, onset: 1.5,
    refs: [
      { label: "Chouinard et al. 1983 — klonazepam w manii", url: "https://pubmed.ncbi.nlm.nih.gov/6135288/" },
      { label: "Ashton 2005 — odstawienie benzodiazepin", url: "https://pubmed.ncbi.nlm.nih.gov/15963697/" },
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
    icon: "🌿", color: "#f39c12",
    halfLife: 8, onset: 1,
    refs: [
      { label: "Gibbs et al. 2015 — cannabis i mania", url: "https://pubmed.ncbi.nlm.nih.gov/25534936/" },
      { label: "Mammen et al. 2018 — cannabis i nawroty", url: "https://pubmed.ncbi.nlm.nih.gov/29995353/" },
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
    icon: "💉", color: "#f39c12",
    halfLife: 5, onset: 0.5,
    refs: [
      { label: "Zarate et al. 2006 — ketamina w depresji", url: "https://pubmed.ncbi.nlm.nih.gov/16894061/" },
      { label: "Diazgranados et al. 2010 — depresja bipolarna", url: "https://pubmed.ncbi.nlm.nih.gov/20679587/" },
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
    icon: "💊", color: "#e91e8c",
    halfLife: 3, onset: 0.5,
    refs: [
      { label: "Mitchell et al. 2021 — MDMA in PTSD (Nature)", url: "https://pubmed.ncbi.nlm.nih.gov/34031603/" },
      { label: "Reiff et al. 2020 — psychedelics review", url: "https://pubmed.ncbi.nlm.nih.gov/32100483/" },
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
    icon: "🌿", color: "#8d6e63",
    halfLife: 2.5, onset: 0.5,
    refs: [
      { label: "Palhano-Fontes et al. 2019 — RCT ajauaski", url: "https://pubmed.ncbi.nlm.nih.gov/29903051/" },
      { label: "Osório et al. 2015 — badanie otwarte", url: "https://pubmed.ncbi.nlm.nih.gov/26154898/" },
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
    icon: "⚡", color: "#ffe600",
    halfLife: 9, onset: 0.2,
    refs: [
      { label: "UK ECT Review Group 2003 (Lancet)", url: "https://pubmed.ncbi.nlm.nih.gov/14643118/" },
      { label: "Dierckx et al. 2012 — meta-analiza (BrJP)", url: "https://pubmed.ncbi.nlm.nih.gov/22450444/" },
      { label: "Versiani et al. 2011 — EW w manii", url: "https://pubmed.ncbi.nlm.nih.gov/22189930/" },
    ],
  },
};

export const BASE = {
  wallStr: 1.5,
  wells: [
    { cx: -0.68, depth: 2.2, w: 0.20 },
    { cx:  0.00, depth: 0.0, w: 0.25 },
    { cx:  0.68, depth: 2.2, w: 0.20 },
  ],
  damping: 0.985, gravity: 14, barrierH: 0, jitter: 0,
};
