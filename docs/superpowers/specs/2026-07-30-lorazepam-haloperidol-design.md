# Lorazepam i haloperidol + reorganizacja kategorii

Data: 2026-07-30

## Cel

Dodać dwa leki (lorazepam, haloperidol) i uporządkować kategorie tak, żeby podział był
poprawny medycznie, ale czytelny dla laika. Wartości fizyki krajobrazu — te, które widać
w animacji — muszą wynikać z danych, nie z intuicji.

## 1. Taksonomia kategorii

Nagłówek = termin medyczny, druga linijka = podpowiedź dla laika (nowy, opcjonalny klucz
i18n `sections.<kat>_hint`). Klucze istniejących kategorii nie zmieniają się, więc 12 z 13
plików YAML zostaje nietkniętych.

| klucz | nagłówek (PL) | podpowiedź (PL) | leki |
|---|---|---|---|
| `stabilizers` | Stabilizatory nastroju | podstawa leczenia, działają miesiącami | lit, walproinian, lamotrygina |
| `antipsychotics` | Neuroleptyki atypowe | II generacja — mania i psychoza | arypiprazol, kwetiapina, olanzapina, rysperydon |
| `typicals` | Neuroleptyki klasyczne | I generacja — silne, więcej skutków ruchowych | **haloperidol** |
| `benzodiazepines` | Benzodiazepiny | doraźne uspokojenie, nie leczą przyczyny | klonazepam (przeniesiony), **lorazepam** |
| `psychedelics` | Psychodeliki i ketamina | działanie szybkie, wciąż eksperymentalne | ketamina, MDMA |
| `substances` | Substancje psychoaktywne | nieprzepisywane, pogarszają przebieg | THC, alkohol |
| `other` | Metody niefarmakologiczne | zabiegi, nie leki | EKW |

`CATEGORY_ORDER` w `ModifierControls.jsx` rozszerza się do siedmiu pozycji w kolejności
z tabeli. Klonazepam dostaje `category: benzodiazepines`, `order: 1`; THC i alkohol
przenumerowane na 1 i 2 w `substances`.

## 2. Wartości fizyki i ich źródła

Skala odniesienia w projekcie: baseline studni manii i depresji = 2.2, euforia = 0.0.
Im niższa `depth` manii, tym silniejsze działanie przeciwmaniakalne. Istniejące wartości:
olanzapina 0.5, lit 0.65, rysperydon 0.75, kwetiapina 0.9, arypiprazol 1.0.

### Lorazepam — `benzodiazepines`, order 2, `#48c9b0`

| parametr | wartość | uzasadnienie |
|---|---|---|
| `halfLife` | 12 | FDA label (Ativan): średni t½ niesprzężonego lorazepamu ≈ 12 h (glukuronid 18 h) |
| `onset` | 1 | label: Tmax ≈ 2 h po podaniu doustnym; sedacja klinicznie wcześniej |
| mania `depth` | 1.6 | Bradwejn 1990: monoterapia lorazepamem w ostrej manii — 61% odpowiedzi, 38,5% remisji, przy braku istotnego efektu klonazepamu. Realne działanie przeciwmaniakalne, ale słabsze niż jakikolwiek neuroleptyk (najlepszy z nich 0.4) |
| depresja `depth` | 2.2 | brak dowodów na ostre pogłębienie; ryzyko przy długim stosowaniu opisane w `warnings` |
| `damping` | 0.85 | silne tłumienie, nieco słabsze od klonazepamu (0.83) — klonazepam jest bardziej potentny na mg |
| `gravity` | 3.0 | jak wyżej; klonazepam 2.5 |
| `barrierH` / `jitter` | 0 / 0 | brak blokady D2, brak niepokoju ruchowego |

Różnica względem klonazepamu jest zamierzona i widoczna w animacji: lorazepam faktycznie
spłaszcza studnię manii, klonazepam tylko tłumi ruch kulki.

### Haloperidol — `typicals`, order 1, `#6c7ae0`

| parametr | wartość | uzasadnienie |
|---|---|---|
| `halfLife` | 24 | SmPC (emc): terminalny t½ średnio 24 h, zakres średnich 15–37 h po podaniu doustnym |
| `onset` | 2 | SmPC: szczyt stężenia 2–6 h po podaniu doustnym |
| mania `depth` | 0.40 | Cipriani 2011 (Lancet, 68 RCT, n=16 073): haloperidol najskuteczniejszy lek przeciwmaniakalny, SMD −0,56 vs placebo — powyżej rysperydonu (−0,50), olanzapiny (−0,43), litu i kwetiapiny (−0,37). Musi więc być płytszy niż dotychczasowe minimum 0.5 |
| depresja `depth` | 2.45 | Goikolea 2013 (J Affect Disord, meta-analiza 6 RCT): RR przełączenia w depresję 0,71 (0,52–0,96) na korzyść atypowych, czyli o ~42% wyższe ryzyko z haloperidolem. Studnia głębsza od baseline 2.2, ale poniżej alkoholu (2.7) |
| `barrierH` | 2.6 | ChEMBL: Ki dla D2 = 1,6 nM (mediana z 105 pomiarów) — najsilniejsza blokada D2 w zestawie; olanzapina 2.0, rysperydon 1.8 |
| `damping` | 0.965 | mało sedatywny w porównaniu z olanzapiną (0.93): ChEMBL Ki dla H1 = 440 nM, czyli ~60× słabsze powinowactwo histaminowe niż olanzapiny |
| `gravity` | 10 | pomiędzy rysperydonem (11) i olanzapiną (6), spójnie z powyższym |
| `jitter` | 0.12 | akatyzja i objawy pozapiramidowe — SmPC wymienia je wprost; ChEMBL: 5-HT2A Ki = 120 nM przy D2 1,6 nM (75× słabsze), brak „osłony serotoninowej" typowej dla atypowych. Pierwszy lek w zestawie, który *dodaje* szum; dla porównania THC 0.45 |

### Poprawka danych istniejących

`clonazepam.yaml` ma `halfLife: 12`, co jest błędem — FDA label podaje 30–40 h. Zmiana na
35. Bez tego zestawienie obu benzodiazepin w jednej kategorii byłoby mylące: lorazepam
(12 h) wyglądałby na równie długo działający jak klonazepam.

## 3. Treść i dane

Oba leki dostają pełny zestaw pól jak pozostałe 13 modyfikatorów: `label`/`desc`/`detail`,
5 `warnings` (najpoważniejsze pierwsze), `refs`, `pharmacology`.

Blok `pharmacology` pobrany z API ChEMBL, nie pisany z pamięci:

- **Lorazepam** — `CHEMBL580`, zatwierdzony 1977, C₁₅H₁₀Cl₂N₂O₂, MW 321.16, QED 0.85,
  black box: tak, mechanizm: dodatni modulator allosteryczny receptora GABA-A.
  ChEMBL nie ma dla lorazepamu żadnego Ki wobec GABA-A (124 aktywności, wyłącznie
  nietrafione cele), więc `keyTargets` podaje wartość literaturową ~2 nM dla miejsca
  benzodiazepinowego, z adnotacją, że jest to wypieranie radioligandu.
- **Haloperidol** — `CHEMBL54`, zatwierdzony 1967, C₂₁H₂₃ClFNO₂, MW 375.87, QED 0.76,
  black box: tak, mechanizmy: antagonista 5-HT2A, odwrotny agonista receptorów D2-podobnych.
  `keyTargets` z median ChEMBL: D2 1,6 nM (n=105), sigma-1 2,53 nM (n=57), D4 5,0 nM,
  D3 6,3 nM, D1 94,5 nM, 5-HT2A 120 nM.

Kluczowe `warnings`:

- lorazepam — opioidy (black box), uzależnienie i drgawki odstawienne, sedacja i amnezja,
  reakcje paradoksalne, względnie bezpieczny w niewydolności wątroby (glukuronidacja,
  brak aktywnych metabolitów);
- haloperidol — śmiertelność u osób starszych z demencją (black box), objawy
  pozapiramidowe i późne dyskinezy, złośliwy zespół neuroleptyczny, wydłużenie QTc
  i nagły zgon, wyższe ryzyko przełączenia w depresję niż przy atypowych.

`refs` (po dwie na lek): Bradwejn 1990 (PMID 2126794) i CANMAT/ISBD 2018 (PMID 29536616)
dla lorazepamu; Cipriani 2011 (PMID 21851976) i Goikolea 2013 (PMID 23089129) dla
haloperidolu.

Angielski zostaje w YAML jako źródło prawdy; `label`/`desc`/`detail`/`warnings` tłumaczone
do `pl.json` i `de.json`.

## Poza zakresem

Nowe mechaniki fizyki, zmiany w `useSimulation.js`, refaktor `PharmacologyCard.jsx`,
przestrajanie wartości istniejących leków (poza poprawką t½ klonazepamu).

## Weryfikacja

`npm run build` przechodzi, a w `npm run dev` obie nowe pigułki pojawiają się we właściwych
kategoriach, w trzech językach, z rozwijaną kartą farmakologii i wykresem reagującym na
suwak stężenia.
