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

### Opening a discussion or issue

The best way to start is by [opening an issue](https://github.com/ciessielski/bipolar/issues) or a [discussion](https://github.com/ciessielski/bipolar/discussions). You don't need to propose a solution — raising a question is enough.

Good starting points:

- *"The current valproate model shows heavy sedation, but in my clinical experience at therapeutic doses it's much milder — here's why I think gravity and damping should be different..."*
- *"Lamotrigine's antidepressant effect isn't visible in the current model. I think the depression well should be shallower. This paper supports it: [link]"*
- *"As a patient, I notice the model doesn't capture the blunting effect of high-dose quetiapine as a mood stabilizer vs low-dose for sleep. These are very different clinical uses."*

The more specific the reasoning, the easier it is to translate into parameters.

### How the landscape parameters work

Each substance is described by a small configuration file. Here's what each parameter controls, in plain language:

| Parameter | What it means | Example |
|-----------|---------------|---------|
| `wells[mania].depth` | How "sticky" the manic state is — how hard it is to escape once there | Lithium: 0.65 (shallow) vs baseline: 2.2 (deep) |
| `wells[euthymia].depth` | How stable normal mood is — 0 means unstable peak, higher means it actively pulls back toward normal | Lithium: 2.1 (deep stable well) vs baseline: 0 (no well at all) |
| `wells[depression].depth` | How sticky the depressive state is | Same logic as mania |
| `gravity` | How fast and forcefully mood shifts — higher means more reactive to perturbation | Baseline: 14; valproate: 4 (slowed, sedated) |
| `damping` | How much friction the system has — higher means movements die out faster, like sedation | Baseline: 0.985; valproate: 0.88 (more damped) |
| `jitter` | Background noise — restlessness, anxiety, agitation | 0 = none; used in stimulant/substance models |
| `barrierH` | Height of a specific barrier in front of the manic region — represents dopamine D2 blockade | Used in antipsychotics |
| `halfLife` | How many hours until the drug's concentration halves | Lithium: 25h; clonazepam: 40h |
| `onset` | How many hours until the drug reaches significant effect | Lithium: 8h; quetiapine: 2h |

The three wells are ordered: **mania** (left), **euthymia** (center), **depression** (right).

### Example: proposing a parameter change

Say you believe lamotrigine should show a more pronounced antidepressant effect. You might open an issue saying:

> *"The current lamotrigine model doesn't reduce the depression well depth at all. Based on [this meta-analysis](https://pubmed.ncbi.nlm.nih.gov/...) showing efficacy in bipolar depression, I'd suggest reducing `wells[depression].depth` from 2.2 to ~1.2, while keeping mania unchanged since lamotrigine has poor antimanic efficacy. I'd also expect low jitter (it doesn't sedate) and moderate gravity (no major psychomotor effects at therapeutic doses)."*

That's enough to turn into a pull request.

### Submitting a pull request

Each substance lives in `src/data/modifiers/<name>.yaml`. To propose a change:

1. Fork the repository
2. Edit the YAML file (or create a new one for a new substance)
3. Add your supporting references to the `refs` list at the bottom of the file:
   ```yaml
   refs:
     - cite: "Author et al. Title of paper. Journal, Year."
       url: "https://pubmed.ncbi.nlm.nih.gov/..."
   ```
4. Open a pull request describing your clinical or scientific rationale

For new substances, copy an existing YAML file as a starting point and adjust from there.

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
