import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE } from "../data/modifiers";
import { X_LO, X_HI } from "../constants";
import { energy, stressorVelocity } from "../utils/physics";
import { duration, simulateWeek, stepsPerSecond, weeks } from "../utils/sleepTrial";

const plotX = x => 8 + 264 * (x - X_LO) / (X_HI - X_LO);
const plotY = x => 60 - 20 * energy(x, BASE);
const landscape = Array.from({ length: 151 }, (_, i) => {
  const x = X_LO + (X_HI - X_LO) * i / 150;
  return plotX(x) + "," + plotY(x);
}).join(" ");

export default memo(function SleepComparison({ startIndex, scale }) {
  const { t, i18n } = useTranslation();
  const [runs, setRuns] = useState(null);
  const [frame, setFrame] = useState(0);
  const [playFrom, setPlayFrom] = useState(null);
  const playing = playFrom !== null;
  const startX = BASE.wells[startIndex].cx;
  const end = duration * stepsPerSecond;
  const format = value => value.toLocaleString(i18n.language, { maximumFractionDigits: 2 });

  useEffect(() => {
    if (!playing) return;
    let id;
    let start;
    const tick = time => {
      if (start === undefined) start = time;
      const next = Math.min(end, playFrom + Math.floor((time - start) * stepsPerSecond / 1000));
      setFrame(next);
      if (next < end) id = requestAnimationFrame(tick);
      else setPlayFrom(null);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing, playFrom, runs, end]);

  const play = (newTrial) => {
    if (newTrial) {
      const impulse = stressorVelocity(scale);
      setRuns(weeks.map(week => simulateWeek(week.hours, startX, impulse)));
    }
    setFrame(0);
    setPlayFrom(0);
  };

  return (
    <details className="threshold-experiment" onToggle={e => { if (!e.currentTarget.open) setPlayFrom(null); }}>
      <summary>{t("lab.sleep")}</summary>
      <p>{t("lab.protocol")}</p>
      <div className="week-grid">
        {weeks.map((week, index) => {
          const run = runs?.[index];
          const x = run?.positions[frame] ?? startX;
          return (
            <section key={week.name} className="week-card">
              <strong>{t("lab." + week.name)}</strong>
              <div>{week.hours.join(" · ")} {t("lab.hours")}</div>
              <svg viewBox="0 0 280 110" aria-hidden="true">
                <polyline points={landscape} fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx={plotX(x)} cy={plotY(x) - 5} r="5" fill="#f7cb72" />
              </svg>
              {run && frame === end && <dl>
                <dt>{t("lab.peak")}</dt><dd>{format(run.peak)}</dd>
                <dt>{t("lab.return")}</dt><dd>{run.returnTime === null ? t("lab.unsettled") : format(run.returnTime)}</dd>
              </dl>}
            </section>
          );
        })}
      </div>
      <div className="simulation-controls">
        <button type="button" onClick={() => play(true)}>{t("lab.apply")}</button>
        {runs && <button type="button" disabled={playing} onClick={() => play(false)}>{t("lab.replay")}</button>}
        {runs && !playing && frame > 0 && frame < end &&
          <button type="button" onClick={() => setPlayFrom(frame)}>{t("ui.resumeSimulation")}</button>}
        {playing && <button type="button" onClick={() => setPlayFrom(null)}>{t("ui.pauseSimulation")}</button>}
      </div>
      {runs && <label className="lab-scrub">{t("lab.time")} · {format(frame / stepsPerSecond)} / {duration}
        <input type="range" min="0" max={end} value={frame} onChange={e => { setPlayFrom(null); setFrame(Number(e.target.value)); }} />
      </label>}
      <p>{t("lab.metric")}</p>
      <p>{t("lab.assumption")} <a href="https://pubmed.ncbi.nlm.nih.gov/21683450/" target="_blank" rel="noreferrer">STEP-BD</a></p>
    </details>
  );
});
