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
      { url: "https://pubmed.ncbi.nlm.nih.gov/15056503/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/23472047/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/23362251/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/29307493/" },
      { url: "https://www.nature.com/articles/s41398-022-02194-4" },
      { url: "https://www.nature.com/articles/nature15526" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/8133987/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/12535471/" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/10084637/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/19169266/" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/12668363/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/18344725/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/12700681/" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/16135615/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/17196055/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/15889941/" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/10025435/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/14702556/" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/15118480/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/12587190/" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/6135288/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/15963697/" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/25534936/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/29995353/" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/16894061/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/20679587/" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/34031603/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/32100483/" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/29903051/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/26154898/" },
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
      { url: "https://pubmed.ncbi.nlm.nih.gov/14643118/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/22450444/" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/22189930/" },
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
