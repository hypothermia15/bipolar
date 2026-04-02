# Bipolar Attractors

A visual model of bipolar disorder as a dynamic energy landscape — where mood is a ball rolling between states of mania, euthymia, and depression, and each drug reshapes the terrain it rolls through.

**[Try it live →](https://michalc.github.io/bipolar)**

---

## The idea

Imagine mood as a landscape of hills and valleys. In bipolar disorder, euthymia (normal mood) is an unstable hilltop — any push sends the ball rolling toward mania or depression. Medications don't just "treat symptoms"; they physically reshape this terrain.

- Lithium rebuilds the entire landscape: euthymia becomes a deep stable valley, mania and depression flatten out
- Antipsychotics raise a barrier in front of the manic region
- Benzodiazepines add friction — the ball moves more slowly — without reshaping the hills
- Stimulants and alcohol tilt and destabilize the whole landscape

This is based on attractor theory — a framework from dynamical systems that several researchers have applied to mood disorders. The key paper behind the model: [A critical evaluation of dynamical systems models of bipolar disorder (Nature, 2022)](https://www.nature.com/articles/s41398-022-02194-4).

---

## How you can contribute

The simulation is only as good as its underlying parameters. **The most valuable contributions don't require any coding** — they require knowledge about how substances affect bipolar disorder.

If you are a psychiatrist, researcher, or patient with lived experience, you can help by:

- Questioning whether a drug's current behavior matches clinical reality
- Proposing different parameter values based on evidence or experience
- Adding new substances that aren't modeled yet
- Pointing to papers that support or contradict the current model

### Opening an issue

The best way to start is by [opening an issue](https://github.com/ciessielski/bipolar/issues). You don't need to propose a solution — raising a question is enough.

Good starting points:

- *"The current valproate model shows heavy sedation, but in my clinical experience at therapeutic doses it's much milder — here's why I think gravity and damping should be different..."*
- *"Lamotrigine's antidepressant effect isn't visible in the current model. I think the depression well should be shallower. This paper supports it: [link]"*
- *"As a patient, I notice the model doesn't capture the blunting effect of high-dose quetiapine as a mood stabilizer vs low-dose for sleep. These are very different clinical uses."*

The more specific the reasoning, the easier it is to translate into parameters.

### How the landscape parameters work

Each substance is described by a YAML file in [`src/data/modifiers/`](src/data/modifiers/). A fully commented template is available at [`_template.yaml`](src/data/modifiers/_template.yaml) — use it as a starting point for new substances.

Here's what each parameter controls:

| Parameter | What it means | Example |
|-----------|---------------|---------|
| `wells[mania].depth` | How "sticky" the manic state is — how hard it is to escape once there | Lithium: 0.65 (shallow) vs baseline: 2.2 (deep) |
| `wells[euthymia].depth` | How stable normal mood is — 0 means unstable hilltop, higher means it actively pulls back toward normal | Lithium: 2.1 (deep stable well) vs baseline: 0 (no well) |
| `wells[depression].depth` | How sticky the depressive state is | Same logic as mania |
| `wells[*].w` | Width of the well — wider means a broader basin of attraction | Default: 0.20–0.25 |
| `gravity` | How fast and forcefully mood shifts — higher means more reactive to perturbation | Baseline: 14; valproate: 4 (slowed, sedated) |
| `damping` | Friction coefficient (0–1) — lower means the ball loses energy faster, like sedation | Baseline: 0.985; valproate: 0.88 (more damped) |
| `jitter` | Random noise — models restlessness, anxiety, agitation | 0 = calm; >0 for stimulants/substances |
| `barrierH` | Height of a barrier in front of the manic region — represents dopamine D2 blockade | Used in antipsychotics |
| `halfLife` | Elimination half-life in hours | Lithium: 25h; clonazepam: 12h |
| `onset` | Hours until the drug reaches meaningful clinical effect | Lithium: 8h; quetiapine: 2h |
| `wallStr` | Steepness of the outer landscape walls (usually leave at 1.5) | 1.5 |

The three wells are ordered left to right: **mania**, **euthymia**, **depression**.

Here's a simplified example — lithium reshapes the landscape so euthymia becomes a deep stable valley while mania and depression flatten out:

```yaml
# lithium.yaml (simplified)
category: stabilizers
halfLife: 25
onset: 8
wells:
  - cx: -0.68
    depth: 0.65      # mania: shallow — easy to escape
    w: 0.20
  - cx: 0.00
    depth: 2.10       # euthymia: deep — stable attractor
    w: 0.30
  - cx: 0.68
    depth: 0.65       # depression: shallow
    w: 0.20
damping: 0.985
gravity: 14
barrierH: 0
jitter: 0
refs:
  - cite: "Long-term lithium therapy for bipolar disorder..."
    url: "https://pubmed.ncbi.nlm.nih.gov/14754766/"
```

Compare this to the **unmedicated baseline** (no YAML file — hardcoded defaults): mania and depression are deep wells (2.2), euthymia has zero depth (unstable hilltop), gravity is 14, and damping is 0.985.

### Example: proposing a parameter change

Say you believe lamotrigine should show a more pronounced antidepressant effect. You might open an issue saying:

> *"The current lamotrigine model doesn't reduce the depression well depth at all. Based on [this meta-analysis](https://pubmed.ncbi.nlm.nih.gov/...) showing efficacy in bipolar depression, I'd suggest reducing `wells[depression].depth` from 2.2 to ~1.2, while keeping mania unchanged since lamotrigine has poor antimanic efficacy. I'd also expect low jitter (it doesn't sedate) and moderate gravity (no major psychomotor effects at therapeutic doses)."*

That's enough to turn into a pull request.

### Submitting a pull request

1. Fork the repository
2. Copy [`_template.yaml`](src/data/modifiers/_template.yaml) for a new substance, or edit an existing file in `src/data/modifiers/`
3. Add supporting references — the more sources the better:
   ```yaml
   refs:
     - cite: "Author et al. Title of paper. Journal, Year."
       url: "https://pubmed.ncbi.nlm.nih.gov/..."
     - cite: "Another Author et al. Second supporting paper. Journal, Year."
       url: "https://pubmed.ncbi.nlm.nih.gov/..."
   ```
4. Open a pull request describing your clinical or scientific rationale

**New substances are very welcome.** If a drug, supplement, or intervention affects mood in bipolar disorder and you can back it with literature, we'd love to include it. Just copy the template, pick parameters that match the clinical profile, and open a PR.

---

## Running locally

```bash
npm install
npm run dev
```

The live demo is always up to date with the main branch.

---

## License

MIT
