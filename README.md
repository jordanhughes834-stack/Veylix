# Veylix

A personal training log, built for one user (you). Track sets and weight per
exercise, rate how hard each set felt on a 1–5 scale, and get an
auto-calculated suggestion for what to do next time — plus a fun total-weight
comparison at the end of every workout.

Installable as a home-screen app on your phone, and your data is backed by a
real cloud database (Supabase) so it survives losing or resetting the phone —
not just `localStorage`.

## Setup (one-time)

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier).
2. Open the SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql) — creates the `veylix_state` table with row-level security, plus notes on what to configure next (disabling public signups, adding your one user).
3. Copy your Project URL and anon public key (Settings → API) into `SUPABASE_URL` / `SUPABASE_ANON_KEY` near the top of `src/app.js`, then run `python3 build.py`.
4. Push this repo to GitHub, then enable **Settings → Pages → Deploy from branch `main` (root)**. Your app is now live at `https://<you>.github.io/<repo>/`.
5. Open that URL on your iPhone in Safari, log in, then tap Share → **Add to Home Screen** — it launches full-screen like a native app, works offline, and your data syncs to the cloud in the background.

There is deliberately no in-app sign-up or password-reset flow — this is a single-user app, so your one account is provisioned directly in the Supabase dashboard (see `supabase/schema.sql`).

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

Every change is written to `localStorage` on your phone immediately (fast,
works offline), then synced to your Supabase database in the background.
On load, whichever copy — local or cloud — has the more recent change wins
and replaces the other.

**Caveat:** this is last-write-wins on the whole dataset, not a field-by-field
merge. If you log workouts on two devices while both are offline, the one
that reconnects second overwrites the first entirely. Fine for a single
phone used as the primary device; worth knowing if you ever log from two
phones in the same offline window.

The Manage tab's JSON export/import still works as an extra manual backup,
independent of the cloud sync.

## Project layout

```
index.html         Built, self-contained output — served by GitHub Pages.
                    Don't hand-edit; it's generated.
src/template.html  Page shell: <head> meta/manifest/icon tags, CSS (fonts
                    embedded as base64 @font-face data URIs), and static
                    HTML markup. Contains the placeholder
                    "VEYLIX_SCRIPT_PLACEHOLDER" where app.js gets spliced in.
src/app.js         All application logic — state management, rendering,
                    event handlers, auth, cloud sync, the progression-
                    suggestion algorithm, the fun weight-comparison logic.
                    Edit this for behaviour changes. SUPABASE_URL /
                    SUPABASE_ANON_KEY constants live near the top.
build.py           Assembles index.html from src/template.html + src/app.js.
manifest.json       PWA manifest (name, icons, theme color).
service-worker.js   Caches the app shell so it works with no signal; never
                    caches Supabase API calls.
icon-192.png, icon-512.png, apple-touch-icon.png
                    App icons — the Veylix "V" mark. Regenerate with
                    `python3 gen_icons.py` if they ever need to change.
supabase/schema.sql Database schema + one-time Supabase project setup notes.
```

## Making a change

1. Edit `src/app.js` (logic/behaviour) or `src/template.html` (layout/CSS/copy).
2. Run `python3 build.py` to regenerate `index.html`.
3. Commit and push — GitHub Pages redeploys automatically.

No build tooling beyond `build.py`, no bundler, no frontend dependencies —
it's vanilla HTML/CSS/JS plus one CDN script (`@supabase/supabase-js`) for
cloud sync. Fonts are Bebas Neue (display), Work Sans (body/UI), and
JetBrains Mono (numbers), inlined so the page still renders fully offline
once cached.
