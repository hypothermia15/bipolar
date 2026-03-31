# Bipolar Attractors

An interactive energy-landscape visualization of mood states in bipolar disorder, showing how psychiatric medications reshape the attractor wells of mania, euthymia, and depression.

**[Live demo](https://michalc.github.io/bipolar)** <!-- update URL if different -->

## What it does

The simulation models mood as a ball rolling in a potential energy landscape with three wells: **mania**, **euthymia**, and **depression**. Without medication, euthymia is a shallow peak — any disturbance tips the ball toward mania or depression.

Clicking a drug activates it with a realistic **onset → steady-state → decay** pharmacokinetic curve. Each drug reshapes the landscape differently:

- **Lithium** — the only drug that rebuilds the entire landscape: euthymia becomes a deep stable well, mania and depression shallow out
- **Mood stabilizers** (valproate, lamotrigine, carbamazepine) — deepen euthymia or raise barriers
- **Antipsychotics** (quetiapine, olanzapine, aripiprazole, haloperidol) — dampen mania, some sedate
- **Antidepressants** (bupropion, venlafaxine) — lift depression, some risk triggering mania
- **Stimulants, alcohol, cannabis** — show destabilizing or mixed effects
- **Benzodiazepines** — reduce jitter/anxiety without reshaping the landscape

You can stack multiple drugs simultaneously and trigger a stressor (⚡) to watch how different combinations handle perturbation.

## Tech stack

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- Canvas-based physics simulation
- i18n: Polish, English, German

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/     # SimulationCanvas, DrugControls, InfoPanel
  data/           # Drug parameters and base landscape config
  hooks/          # useSimulation (physics loop + pharmacokinetics)
  locales/        # PL / EN / DE translations
  utils/          # Physics helpers (gradient, lerp)
  constants.js    # Shared axis limits
```

## License

MIT
