import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ThresholdExperiment({ launch, isPaused }) {
  const { t } = useTranslation();
  const [direction, setDirection] = useState(-1);
  const [strength, setStrength] = useState(4);
  const [lastVelocity, setLastVelocity] = useState(null);

  const push = () => {
    const velocity = direction * strength;
    setLastVelocity(velocity);
    launch(velocity);
  };

  return (
    <details className="threshold-experiment">
      <summary>{t("experiment.title")}</summary>
      <p>{t("experiment.hint")}</p>
      <div className="simulation-controls">
        <label>
          {t("experiment.direction")}
          <select value={direction} onChange={e => setDirection(Number(e.target.value))}>
            <option value={-1}>← {t("experiment.left")}</option>
            <option value={1}>→ {t("experiment.right")}</option>
          </select>
        </label>
        <label>
          {t("experiment.strength")} · {strength}/10
          <input type="range" min="1" max="10" value={strength} onChange={e => setStrength(Number(e.target.value))} />
        </label>
        <button type="button" disabled={isPaused} onClick={push}>{t("experiment.push")}</button>
        <button type="button" disabled={isPaused || lastVelocity === null} onClick={() => launch(lastVelocity)}>
          {t("experiment.repeat")}
        </button>
      </div>
    </details>
  );
}
