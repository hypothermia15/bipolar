import { useState, useEffect, useRef, useCallback } from "react";

const W = 680;
const H = 320;
const PAD = 50;
const BALL_R = 12;

// ── Parametry krajobrazu ──────────────────────────────────────────────────────
//
// Kluczowa matematyka:
//   f(x) = wallStr·x² – Σ depth·exp(–(x–cx)²/2w²)
//   f''(0) < 0  ←→  x=0 jest lokalnym MAKSIMUM (niestabilne = eutymia w trybie bipolar)
//   f''(0) = 2·wallStr – Σ depth·(cx²/w⁴ – 1/w²)·G(0,cx,w)
//
//   Dla cx=±0.68, w=0.20:
//     (cx²/w⁴ – 1/w²)·G ≈ 264·0.00308 ≈ 0.813
//   Warunek f''(0)<0:  wallStr < depth_mania·0.813
//   Przy depth=2.2:    wallStr < 1.79  →  używamy 1.5 ✓

const BIPOLAR = {
  wallStr: 1.5,
  wells: [
    { cx: -0.68, depth: 2.2, w: 0.20 }, // mania     — głęboka
    { cx:  0.00, depth: 0.0, w: 0.25 }, // eutymia   — BRAK dołka (szczyt = niestabilna)
    { cx:  0.68, depth: 2.2, w: 0.20 }, // depresja  — głęboka
  ],
};

const LITHIUM = {
  wallStr: 1.5,
  wells: [
    { cx: -0.68, depth: 0.65, w: 0.20 }, // mania     — spłycona do pagórka
    { cx:  0.00, depth: 2.10, w: 0.30 }, // eutymia   — głęboka
    { cx:  0.68, depth: 0.65, w: 0.20 }, // depresja  — spłycona do pagórka
  ],
};

// ── Interpolacja liniowa między trybami ───────────────────────────────────────

function lerp(a, b, t) {
  return {
    wallStr: a.wallStr + (b.wallStr - a.wallStr) * t,
    wells: a.wells.map((aw, i) => ({
      cx:    aw.cx    + (b.wells[i].cx    - aw.cx)    * t,
      depth: aw.depth + (b.wells[i].depth - aw.depth) * t,
      w:     aw.w     + (b.wells[i].w     - aw.w)     * t,
    })),
  };
}

// ── Energia i gradient ────────────────────────────────────────────────────────

function energy(x, p) {
  let y = p.wallStr * x * x;
  for (const well of p.wells) {
    if (well.depth === 0) continue;
    const d = x - well.cx;
    y -= well.depth * Math.exp(-d * d / (2 * well.w * well.w));
  }
  return y;
}

function gradient(x, p) {
  let dy = 2 * p.wallStr * x;
  for (const well of p.wells) {
    if (well.depth === 0) continue;
    const d = x - well.cx;
    dy += well.depth * (d / (well.w * well.w)) * Math.exp(-d * d / (2 * well.w * well.w));
  }
  return dy;
}

// ── Konwersje współrzędnych ───────────────────────────────────────────────────

const X_LO = -1.12, X_HI = 1.12;
const Y_LO = -2.3,  Y_HI = 2.3;

function toCanvasX(lx) {
  return PAD + ((lx - X_LO) / (X_HI - X_LO)) * (W - 2 * PAD);
}
function toCanvasY(ly) {
  return PAD + ((Y_HI - ly) / (Y_HI - Y_LO)) * (H - 2 * PAD);
}
function fromCanvasX(cx) {
  return X_LO + ((cx - PAD) / (W - 2 * PAD)) * (X_HI - X_LO);
}

// ── Główny komponent ──────────────────────────────────────────────────────────

export default function App() {
  const canvasRef = useRef(null);

  // Stan symulacji trzymany w ref (nie powoduje re-renderu przy zmianie)
  const sim = useRef({
    ball: { x: 0.68, vx: 0, dragging: false },
    t: 0,        // aktualny stopień interpolacji (0=bipolar, 1=lithium)
    tTarget: 0,  // docelowy
    lastTime: null,
  });

  const rafRef  = useRef(null);
  const [mode, setMode] = useState("bipolar");

  // ── Pętla fizyki + rysowania ──────────────────────────────────────────────

  const loop = useCallback((timestamp) => {
    const s = sim.current;
    if (!s.lastTime) s.lastTime = timestamp;
    const dt = Math.min((timestamp - s.lastTime) / 1000, 0.04);
    s.lastTime = timestamp;

    // Płynne przejście trybu
    s.t += (s.tTarget - s.t) * Math.min(dt * 3.5, 1);

    const p = lerp(BIPOLAR, LITHIUM, s.t);

    // Fizyka kulki
    if (!s.ball.dragging) {
      const slope = gradient(s.ball.x, p);
      s.ball.vx += -slope * 14 * dt;
      // Tłumienie: ~40% prędkości po 1s (lekkie, kulka oscyluje)
      s.ball.vx *= Math.pow(0.985, dt * 60);
      s.ball.x  += s.ball.vx * dt;
      if (s.ball.x < X_LO + 0.02) { s.ball.x = X_LO + 0.02; s.ball.vx *= -0.3; }
      if (s.ball.x > X_HI - 0.02) { s.ball.x = X_HI - 0.02; s.ball.vx *= -0.3; }
    }

    // ── Rysowanie ────────────────────────────────────────────────────────────

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    // Tło
    ctx.fillStyle = "#0d0d1b";
    ctx.fillRect(0, 0, W, H);

    // Subtelna siatka
    ctx.strokeStyle = "rgba(255,255,255,0.035)";
    ctx.lineWidth = 1;
    for (let yv = -2; yv <= 2; yv += 0.5) {
      const cy = toCanvasY(yv);
      ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(W - PAD, cy); ctx.stroke();
    }

    // ── Oblicz punkty krzywej ─────────────────────────────────────────────

    const N = 500;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const lx = X_LO + (X_HI - X_LO) * (i / N);
      pts.push([toCanvasX(lx), toCanvasY(energy(lx, p))]);
    }

    // Wypełnienie pod krzywą
    const t = s.t;
    const cr = Math.round(231 - 192 * t);
    const cg = Math.round(76  +  98 * t);
    const cb = Math.round(60  +  36 * t);

    ctx.beginPath();
    ctx.moveTo(pts[0][0], H);
    for (const [px, py] of pts) ctx.lineTo(px, py);
    ctx.lineTo(pts[pts.length - 1][0], H);
    ctx.closePath();
    const fillGr = ctx.createLinearGradient(0, 0, 0, H);
    fillGr.addColorStop(0, `rgba(${cr},${cg},${cb},0.04)`);
    fillGr.addColorStop(1, `rgba(${cr},${cg},${cb},0.20)`);
    ctx.fillStyle = fillGr;
    ctx.fill();

    // Linia krzywej
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      if (i === 0) ctx.moveTo(pts[i][0], pts[i][1]);
      else         ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.strokeStyle = `rgb(${cr},${cg},${cb})`;
    ctx.lineWidth = 2.8;
    ctx.stroke();

    // ── Etykiety stref ────────────────────────────────────────────────────

    const zones = [
      { lx: -0.68, label: "MANIA",    col: "#e74c3c" },
      { lx:  0.00, label: "EUTYMIA",  col: "#f1c40f" },
      { lx:  0.68, label: "DEPRESJA", col: "#3498db" },
    ];
    for (const z of zones) {
      const ly     = energy(z.lx, p);
      const canvX  = toCanvasX(z.lx);
      const canvY  = toCanvasY(ly);

      // Sprawdź, czy dany punkt to dołek czy szczyt (stabilny vs niestabilny)
      const grad2  = gradient(z.lx + 0.01, p) - gradient(z.lx - 0.01, p); // numeryczne f''
      const stable = grad2 > 0; // f'' > 0 → minimum (stabilny), f'' < 0 → maksimum

      // Pionowa kreska
      ctx.strokeStyle = z.col + "44";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(canvX, canvY + (stable ? 4 : -4));
      ctx.lineTo(canvX, canvY + (stable ? 32 : -32));
      ctx.stroke();
      ctx.setLineDash([]);

      // Tekst (pod dołkiem, nad szczytem)
      ctx.fillStyle  = z.col + "cc";
      ctx.font       = "bold 10px system-ui, sans-serif";
      ctx.textAlign  = "center";
      const offset   = stable ? 42 : -42;
      ctx.fillText(z.label, canvX, canvY + offset);

      // Ikona ▼ (dołek) lub ▲ (szczyt)
      ctx.font = "9px system-ui";
      ctx.fillStyle = z.col + "88";
      ctx.fillText(stable ? "▼" : "▲", canvX, canvY + (stable ? 30 : -30));
    }

    // ── Kulka ────────────────────────────────────────────────────────────

    const bly    = energy(s.ball.x, p);
    const bCanvX = toCanvasX(s.ball.x);
    const bCanvY = toCanvasY(bly) - BALL_R;

    // Cień
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#8ab";
    ctx.beginPath();
    ctx.ellipse(bCanvX, toCanvasY(bly) + 3, BALL_R * 1.3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Poświata
    const glow = ctx.createRadialGradient(bCanvX, bCanvY, 0, bCanvX, bCanvY, 28);
    glow.addColorStop(0, "rgba(160,200,255,0.30)");
    glow.addColorStop(1, "rgba(100,150,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bCanvX, bCanvY, 28, 0, Math.PI * 2);
    ctx.fill();

    // Kulka — gradient 3D
    const ballGr = ctx.createRadialGradient(
      bCanvX - 4, bCanvY - 4, 2,
      bCanvX,     bCanvY,     BALL_R
    );
    ballGr.addColorStop(0,    "#ffffff");
    ballGr.addColorStop(0.45, "#c8dcff");
    ballGr.addColorStop(1,    "#3355aa");
    ctx.fillStyle = ballGr;
    ctx.beginPath();
    ctx.arc(bCanvX, bCanvY, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  // ── Obsługa myszy / dotyku ────────────────────────────────────────────────

  const getMouseX = (e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return (clientX - rect.left) * scaleX;
  };

  const onDown = (e) => {
    const s = sim.current;
    const mx = getMouseX(e);
    const ballCanvX = toCanvasX(s.ball.x);
    if (Math.abs(mx - ballCanvX) < 30) {
      s.ball.dragging = true;
      s.ball.vx = 0;
    }
  };

  const onMove = (e) => {
    const s = sim.current;
    if (!s.ball.dragging) return;
    const mx = getMouseX(e);
    s.ball.x = Math.max(X_LO + 0.02, Math.min(X_HI - 0.02, fromCanvasX(mx)));
  };

  const onUp = () => { sim.current.ball.dragging = false; };

  // ── Kontrolki ─────────────────────────────────────────────────────────────

  const switchMode = (m) => {
    setMode(m);
    sim.current.tTarget = m === "lithium" ? 1 : 0;
  };

  const disturb = () => {
    // Mocny, losowy kopniak — taki żeby kulka realnie zmieniła stan
    const dir = Math.random() > 0.5 ? 1 : -1;
    sim.current.ball.vx += dir * (3.5 + Math.random() * 1.2);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const btnBase = {
    padding: "9px 20px", borderRadius: 8, cursor: "pointer",
    fontWeight: 700, fontSize: 13, transition: "all 0.25s",
    border: "2px solid", lineHeight: 1,
  };

  return (
    <div style={{
      background: "#0d0d1b", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 14, padding: 20,
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>

      <h2 style={{ color: "#dde", margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: 0.4 }}>
        Krajobraz energetyczny mózgu — metafora atraktorów
      </h2>
      <p style={{ color: "rgba(255,255,255,0.36)", margin: 0, fontSize: 12, textAlign: "center", maxWidth: 520 }}>
        ▼ = dołek (atraktor, kulka tu osiada) &nbsp;·&nbsp; ▲ = szczyt (niestabilny, kulka spada ze szczytu)
        <br/>Przeciągnij kulkę lub uderz ją stresorem.
      </p>

      {/* Przyciski */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => switchMode("bipolar")} style={{
          ...btnBase,
          borderColor: mode === "bipolar" ? "#e74c3c" : "rgba(255,255,255,0.18)",
          background:  mode === "bipolar" ? "rgba(231,76,60,0.18)" : "transparent",
          color:       mode === "bipolar" ? "#e74c3c" : "rgba(255,255,255,0.5)",
        }}>⚡ Bez litu</button>

        <button onClick={() => switchMode("lithium")} style={{
          ...btnBase,
          borderColor: mode === "lithium" ? "#27ae60" : "rgba(255,255,255,0.18)",
          background:  mode === "lithium" ? "rgba(39,174,96,0.18)" : "transparent",
          color:       mode === "lithium" ? "#27ae60" : "rgba(255,255,255,0.5)",
        }}>💊 Z litem</button>

        <button onClick={disturb} style={{
          ...btnBase,
          borderColor: "rgba(255,190,60,0.45)",
          background:  "transparent",
          color:       "rgba(255,190,60,0.75)",
        }}>⚡ Stresor</button>
      </div>

      {/* Płótno */}
      <canvas
        ref={canvasRef}
        width={W} height={H}
        style={{
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.07)",
          cursor: "grab",
          maxWidth: "100%",
          touchAction: "none",
        }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      />

      {/* Opis trybu */}
      <div style={{
        maxWidth: 520, padding: "13px 18px",
        background: "rgba(255,255,255,0.034)",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.07)",
      }}>
        {mode === "bipolar" ? (
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, margin: 0, lineHeight: 1.75 }}>
            <span style={{ color: "#e74c3c", fontWeight: 700 }}>Bez litu:</span>{" "}
            Eutymia to <em>szczyt</em> między dwoma głębokimi studniami — każde
            najdrobniejsze zaburzenie strąca kulkę w manię lub depresję.
            Kulka <em>nie może</em> tam pozostać; fizyka ją wyrzuca.
            Stresor przenosi ją między studniami.
          </p>
        ) : (
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, margin: 0, lineHeight: 1.75 }}>
            <span style={{ color: "#27ae60", fontWeight: 700 }}>Z litem:</span>{" "}
            Lit odwraca krajobraz — eutymia staje się głębokim dołkiem, a mania i depresja
            zamieniają się w pagórki. Kulka wraca do centrum nawet po
            silnym stresie. Przeskoki między krańcami są niemożliwe bez ogromnego impulsu.
          </p>
        )}
      </div>

    </div>
  );
}
