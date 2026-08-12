# GymPT

A personal training log, built for one user (you). Track sets and weight per
exercise, rate how hard each set felt on a 1–5 scale, and get an
auto-calculated suggestion for what to do next time — plus a fun total-weight
comparison at the end of every workout.

**Live app:** https://claude.ai/code/artifact/9b1a3cee-290a-4ef3-a413-778d3b9d3355

Open that link on your iPhone in Safari, tap Share → **Add to Home Screen**,
and it launches full-screen like a native app.

## How it works

- **Today tab** — shows the exercises scheduled for today based on your
  weekly split. Log weight × reps per set and rate difficulty 1–5. The next
  suggested weight/reps for that exercise is calculated from the last time
  you logged it and how hard you rated it (see `suggestNext()` in
  `src/app.js` for the exact rule).
- **History tab** — every past session, expandable, plus a trend chart per
  exercise.
- **Manage tab** — edit your weekly split, the exercises in each day type,
  and your exercise library (name, category, weight increment). Includes a
  one-tap "Load Chest / Back / Legs / Shoulders / Arms split" starter
  template, and backup export/import.

## Where your data lives

Workout data (exercises, split, logged sessions) is stored in `localStorage`
in the browser on your phone — scoped to that page's URL. It never touches a
server and isn't synced anywhere. Export a backup from the Manage tab
periodically (Manage → Backup → Export backup) so you've got a copy saved
somewhere safe.

## Project layout

```
gympt.html        Built, self-contained output — this is what gets published
                   as the Claude Artifact. Don't hand-edit; it's generated.
src/template.html Page shell: <title>, CSS (fonts embedded as base64
                   @font-face data URIs), and static HTML markup. Contains
                   the placeholder "GYMPT_SCRIPT_PLACEHOLDER" where app.js
                   gets spliced in.
src/app.js         All application logic — state management, rendering,
                   event handlers, the progression-suggestion algorithm, the
                   fun weight-comparison logic. Edit this for behaviour
                   changes.
build.py           Assembles gympt.html from src/template.html + src/app.js.
```

## Making a change

1. Edit `src/app.js` (logic/behaviour) or `src/template.html` (layout/CSS/copy).
2. Run `python3 build.py` to regenerate `gympt.html`.
3. Republish `gympt.html` as the Claude Artifact (same URL) to push it live.

No build tooling, no dependencies, no bundler — it's vanilla HTML/CSS/JS, and
the whole app is one file at runtime. Fonts are Bebas Neue (display), Work
Sans (body/UI), and JetBrains Mono (numbers), inlined so the page works
fully offline once loaded.
