import { useState, useEffect, useRef, useCallback } from "react";

const W = 700, H = 330, PAD = 48, BALL_R = 12;
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
    damping: 0.92, gravity: 6, barrierH: 0, jitter: 0,
    label: "Walproinian", icon: "💊", color: "#9b59b6",
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
    label: "Lamotrigina", icon: "💊", color: "#e67e22",
    halfLife: 30, onset: 10,
    desc: "Splyca depresyjny dolek (blokada glutaminianu) — ale mania pozostaje gleboka. Asymetryczna ochrona.",
    detail: "Blokuje napieciozalezne kanaly sodowe i hamuje uwalnianie glutaminianu. Wykazuje dobrze udokumentowana skutecznosc w zapobieganiu epizodom depresji, przy znacznie slabszym dzialaniu przeciwmaniakalnym. Wymaga bardzo wolnego miareczkowania dawki (ryzyko ciezkiej wysypki Stevensa-Johnsona przy zbyt szybkim zwiekszaniu). Asymetria w wizualizacji — depresja splyca sie, ale mania nie.",
    refs: [
      { label: "Calabrese et al. 1999 — lamotrigina w depresji bipolarnej (JClinPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/10084637/" },
      { label: "Geddes et al. 2009 — meta-analiza lamotriginy (BrJPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/19169266/" },
    ],
  },
  antipsychotics: {
    wallStr: 1.5,
    wells: [
      { cx: -0.68, depth: 2.2, w: 0.20 },
      { cx:  0.00, depth: 0.0, w: 0.25 },
      { cx:  0.68, depth: 2.2, w: 0.20 },
    ],
    damping: 0.985, gravity: 14, barrierH: 3.8, jitter: 0,
    label: "Antypsychotyki", icon: "💊", color: "#3498db",
    halfLife: 20, onset: 3,
    desc: "Bariera przed mania (blokada D2). Kulka nie moze wjechac — ale teren sie nie zmienia.",
    detail: "Atypowe antypsychotyki (olanzapina, kwetiapina, aripiprazol) blokuja receptory D2 dopaminergiczne, co skutecznie ogranicza psychoze i manie. Kwetiapina wykazuje rowniez skutecznosc w depresji bipolarnej. Dlugookresowo nie przebudowuja krajobrazu nastroju — dzialaja jak zapora, nie jak zmiana terenu. Ryzyko metaboliczne (przyrost masy, insulinoopornosc) przy dlugim stosowaniu.",
    refs: [
      { label: "Tohen et al. 1999 — olanzapina w ostrej manii (AmJPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/10025435/" },
      { label: "Calabrese et al. 2005 — kwetiapina w depresji bipolarnej (AmJPsychiatry)", url: "https://pubmed.ncbi.nlm.nih.gov/16135615/" },
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
    padding: "7px 12px", borderRadius: 7, cursor: "pointer",
    fontWeight: 600, fontSize: 11, transition: "all 0.25s", lineHeight: 1,
    border: `2px solid ${active ? color : "rgba(255,255,255,0.14)"}`,
    background: active ? `${color}22` : "transparent",
    color: active ? color : "rgba(255,255,255,0.42)",
    whiteSpace: "nowrap",
  });

  const actionBtn = (color) => ({
    padding: "7px 14px", borderRadius: 7, cursor: "pointer",
    fontWeight: 600, fontSize: 11, lineHeight: 1, transition: "all 0.25s",
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
      alignItems: "center", justifyContent: "center",
      gap: 11, padding: 14,
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>

      <h2 style={{ color: "#dde", margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: 0.4 }}>
        Krajobraz energetyczny — atraktory w chorobie dwubiegunowej
      </h2>
      <p style={{ color: "rgba(255,255,255,0.30)", margin: 0, fontSize: 10.5, textAlign: "center", maxWidth: 560 }}>
        Klikaj leki aby je wlaczac/wylaczac. Mozesz laczyc wiele naraz. Obserwuj onset i zanik.
      </p>

      {/* ── Sekcje lekow ── */}
      {[
        { title: "Stabilizator", keys: ["lithium"] },
        { title: "Leki na bipolar", keys: ["valproate", "lamotrigine", "antipsychotics"] },
        { title: "Substancje", keys: ["ketamine", "clonazepam", "thc"] },
      ].map((sec) => (
        <div key={sec.title} style={{
          display: "flex", alignItems: "center", gap: 6,
          flexWrap: "wrap", justifyContent: "center",
        }}>
          <span style={{
            color: "rgba(255,255,255,0.22)", fontSize: 9, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: 1, minWidth: 50,
          }}>{sec.title}</span>
          {sec.keys.map(k => {
            const d = DRUGS[k];
            const state = drugsRef.current[k];
            const isOn = state && state.on;
            return (
              <button key={k} onClick={() => toggleDrug(k)} style={pill(isOn, d.color)}>
                {d.icon} {d.label}
              </button>
            );
          })}
          {sec.keys.map(k => {
            const d = DRUGS[k];
            const state = drugsRef.current[k];
            const conc = state ? state.conc : 0;
            if (conc < 0.005 && !(state && state.on)) return null;
            return (
              <div key={k + "_bar"} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "3px 8px", borderRadius: 5,
                background: "rgba(255,255,255,0.04)",
                fontSize: 10, color: d.color, minWidth: 90,
              }}>
                <span style={{ opacity: 0.7, fontSize: 9 }}>{d.icon}</span>
                <div style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: "rgba(255,255,255,0.08)", overflow: "hidden",
                }}>
                  <div style={{
                    width: `${conc * 100}%`, height: "100%",
                    borderRadius: 2, background: d.color,
                    transition: "width 0.1s linear",
                  }} />
                </div>
                <span style={{ fontSize: 9, opacity: 0.6, minWidth: 28, textAlign: "right" }}>
                  {Math.round(conc * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      ))}

      {/* Przycisk akcji */}
      <div style={{ display: "flex", gap: 7 }}>
        <button onClick={disturb} style={actionBtn("#ffbe3c")}>
          ⚡ Stresor
        </button>
      </div>

      {/* Plotno */}
      <canvas ref={canvasRef} width={W} height={H}
        style={{
          borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)",
          cursor: "grab", maxWidth: "100%", touchAction: "none",
        }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      />

      {/* Opis aktywnych lekow */}
      <div style={{
        maxWidth: 560, padding: "11px 16px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)",
      }}>
        {noActive ? (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0, lineHeight: 1.7 }}>
            ⚡ Bez leku: Eutymia to szczyt — kazde zaburzenie straca kulke w manie lub depresje.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {activeDescs.map(([key, state]) => {
              const d = DRUGS[key];
              const pct = Math.round(state.conc * 100);
              const phaseLabel = state.phase === "onset"
                ? " (narasta)"
                : state.on ? " (zanika)" : " (odstawiony)";
              return (
                <div key={key} style={{
                  borderLeft: `2px solid ${d.color}55`,
                  paddingLeft: 10,
                  display: "flex", flexDirection: "column", gap: 4,
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ color: d.color, fontWeight: 700, fontSize: 12 }}>
                      {d.icon} {d.label}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>
                      {pct}%{phaseLabel}
                    </span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11.5, margin: 0, lineHeight: 1.6 }}>
                    {d.desc}
                  </p>
                  {d.detail && (
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, margin: 0, lineHeight: 1.6 }}>
                      {d.detail}
                    </p>
                  )}
                  {d.sections && d.sections.map((sec, si) => (
                    <div key={si} style={{ marginTop: si === 0 ? 2 : 0 }}>
                      <p style={{ color: d.color, opacity: 0.75, fontSize: 10, margin: "0 0 3px 0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {sec.heading}
                      </p>
                      {sec.items.map((item, ii) => (
                        <p key={ii} style={{ color: "rgba(255,255,255,0.45)", fontSize: 10.5, margin: "1px 0", lineHeight: 1.5, paddingLeft: 10 }}>
                          <span style={{ color: d.color, opacity: 0.5, marginRight: 4 }}>&#8227;</span>{item}
                        </p>
                      ))}
                    </div>
                  ))}
                  {d.refs && d.refs.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 10px", marginTop: 2 }}>
                      {d.refs.map((ref, i) => (
                        <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer"
                          style={{
                            color: d.color, opacity: 0.7, fontSize: 10,
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
  );
}
