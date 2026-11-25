import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";

const topics = ["sequence", "sleep", "function"];
const interpretations = ["situational", "possible", "confirmed"];

export default memo(function ClinicalInterview() {
  const { t } = useTranslation();
  const [heard, setHeard] = useState([]);
  const [current, setCurrent] = useState(null);
  const [choice, setChoice] = useState(null);
  const ask = topic => {
    setCurrent(topic);
    setHeard(previous => previous.includes(topic) ? previous : [...previous, topic]);
  };
  const restart = () => {
    setHeard([]);
    setCurrent(null);
    setChoice(null);
  };
  return (
    <details className="threshold-experiment clinical-interview">
      <summary>{t("interview.title")}</summary>
      <p>{t("interview.intro")}</p>
      <fieldset>
        <legend>{t("interview.history")}</legend>
        <div className="simulation-controls">
          {topics.map(topic => <button type="button" key={topic} aria-pressed={current === topic} onClick={() => ask(topic)}>
            {heard.includes(topic) && <span aria-hidden="true">✓ </span>}{t("interview." + topic)}
          </button>)}
        </div>
        <div aria-live="polite">{current && <blockquote>{t("interview." + current + "Reply")}</blockquote>}</div>
      </fieldset>
      {heard.length === topics.length && <fieldset>
        <legend>{t("interview.assess")}</legend>
        <div className="simulation-controls">
          {interpretations.map(key => <button type="button" key={key} aria-pressed={choice === key} onClick={() => setChoice(key)}>
            {t("interview." + key)}
          </button>)}
        </div>
        <div aria-live="polite">{choice && <p>{t("interview." + choice + "Feedback")}</p>}</div>
      </fieldset>}
      {choice && <div className="simulation-controls"><button type="button" onClick={restart}>{t("interview.restart")}</button></div>}
      <p><a href="https://pubmed.ncbi.nlm.nih.gov/19309325/" target="_blank" rel="noreferrer">{t("interview.source")}</a></p>
    </details>
  );
});
