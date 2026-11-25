import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";

const days = [
  { mood: -1, activation: -1 },
  { mood: -2, activation: -1 },
  { mood: -2, activation: 0 },
  { mood: -2, activation: 1 },
  { mood: -2, activation: 2 },
];
const x = mood => 150 + 48 * mood;
const y = activation => 90 - 32 * activation;

export default memo(function ActivationCase() {
  const { t } = useTranslation();
  const [day, setDay] = useState(0);
  const point = days[day];
  return (
    <details className="threshold-experiment">
      <summary>{t("lab.case")}</summary>
      <p>{t("lab.caseHint")}</p>
      <figure className="case-plot">
        <svg viewBox="0 0 300 190" aria-hidden="true">
          <path d="M45 90H255 M150 17V162" stroke="#697a94" />
          {[-2, 0, 2].map(value => <g key={value} fill="currentColor" fontSize="12">
            <text x={x(value)} y="180" textAnchor="middle">{value}</text>
            <text x="30" y={y(value) + 4} textAnchor="end">{value}</text>
          </g>)}
          <polyline fill="none" stroke="#83bdf8" strokeWidth="3"
            points={days.slice(0, day + 1).map(p => x(p.mood) + "," + y(p.activation)).join(" ")} />
          <circle cx={x(point.mood)} cy={y(point.activation)} r="6" fill="#f7cb72" />
        </svg>
        <figcaption>{t("lab.axes")}</figcaption>
      </figure>
      <label className="lab-scrub">{t("lab.day")} {day + 1} / {days.length}
        <input type="range" min="1" max={days.length} value={day + 1} onChange={e => setDay(Number(e.target.value) - 1)} />
      </label>
      <p aria-live="polite"><strong>{t("lab.mood")} {point.mood} · {t("lab.activation")} {point.activation}</strong><br />
        {t("lab.observations." + day)}
      </p>
      <a href="https://pubmed.ncbi.nlm.nih.gov/37574463/" target="_blank" rel="noreferrer">Specificity of affective dynamics (2023)</a>
    </details>
  );
});
