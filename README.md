# KaneGate

KaneGate is a tiny hackathon entry that implements a deployment gate powered by Kane CLI: the app refuses to deploy until Kane signs off in a real browser.

## What it is

- **Kane's Corner Store**: a static checkout demo with vanilla JS, HTML, CSS
- **Deploy gate**: a bash script that starts a local server if needed, then runs Kane CLI tests
- **Verification**: Kane CLI runs the test suite and only allows deployment if all tests pass

## How the gate works

1. `scripts/deploy-gate.sh` runs with no arguments
2. Ensures the app is reachable (starts Python server on port 4173 if needed)
3. Executes `kane-cli testmd run tests/checkout_test.md --agent --headless`
4. Exit codes:
   - 0 → writes `dist/DEPLOYED` and prints "DEPLOY ALLOWED"
   - 2 → prints "DEPLOY REFUSED" and "Kane not signed in…"
   - other → prints "DEPLOY REFUSED"
5. The gate can be run locally with `npm run verify`

## How to run

```bash
# Install dependencies
npm install

# Serve the app (in one terminal)
npm run serve

# Verify the gate (in another terminal)
npm run verify
```

## Kane verification results — red-green, 18 Nov 2026

All runs against the live app on `http://localhost:4173`, account `buahrasa01`
(OAuth login), `kane-cli` 0.10.6, `KANE_CLI_USER_AGENT=codex`.

### Run 1 — RED: Kane caught the bug (exit 1)

- **When:** 18 Nov 2026 ~19:13 WIB, 107 s, ~26 credits
- **Result:** 3 steps passed, **step 4 failed**, steps 5–6 skipped
- **Session:** `9fa4067c-aedb-4005-aabd-40e6fa859332`
- **Evidence pack (local):** `828bd2cf-d448-44b9-aa16-4c8a6baf62c6.evidence`
  (`~/.testmuai/kaneai/sessions/9fa4067c-aedb-4005-aabd-40e6fa859332/evidence/`;
  view with `kane-cli evidence serve <path>`). Failed runs get no Test
  Manager share URL.
- **Kane's failing-step remark (step 4):**

  > "The coupon's $3.00 discount is displayed, but it is not being included
  > when the cart Total is calculated or shown. Update the cart total
  > calculation and display so an applied 10% SAVE10 discount changes a
  > $29.99 cart total to exactly $26.99."
  >
  > Evidence: `objective_contradiction: Total: $29.99` — "The directly read
  > Total remains $29.99 despite the applied SAVE10 coupon, so the required
  > $26.99 state is absent."

### The fix

`app/app.js` (manual edit, no Codex — all free Codex providers were
exhausted that night): `applyCoupon()` now calls `updateTotalDisplay()`
after setting `discountAmount`, and `updateCartDisplay()` routes through
`updateTotalDisplay()` — the single source of truth for the total.
Local jsdom re-verification: **8/8 PASS** (total $26.99 after SAVE10).

### Run 2 — GREEN: the same test passes (exit 0)

- **When:** 18 Nov 2026 ~19:21 WIB, 165 s, ~55 credits
- **Result:** **6/6 steps passed**
- **Session:** `c893e688-74da-4809-9b6f-08fd96f29d81`
- **Test URL:** https://test-manager.lambdatest.com/projects/01M7Q8N92F1EACG0354MAEZSHE/test-cases/01M7Q8QNPGAW2QSJPPTZYWJ8EQ/dashboard/share/US_SVOZ3VA5SI0QZMJSDTYSY1KRUOH0F3TTS5SJDSMKURT7KBNFS8VLFV70RULMQMP2?type=summary&agentView=true&fqdn=summary-page
- **Evidence pack (local):** `85fec2b4-6292-4f98-bffb-8ca0840ae642.evidence`
- Replay artifacts committed in `tests/output-checkout/`.

### Gate run — DEPLOY ALLOWED

- **When:** 18 Nov 2026 ~19:27 WIB, `bash scripts/deploy-gate.sh` → exit 0
- **`dist/DEPLOYED`:** `2026-11-18T12:27:40Z`
- **Session:** `fe98b746-f465-4507-8c67-5c3bf9b87525`
- **Test URL:** https://test-manager.lambdatest.com/projects/01M7Q8N92F1EACG0354MAEZSHE/test-cases/01M7Q8QNPGAW2QSJPPTZYWJ8EQ/dashboard/share/US_DBU5KAEBSF5Q24RHJJ0E34GQNMCQOIFZVYJJCAVQ1JGEY91FCTFM6R7QLPFFGF25?type=summary&agentView=true&fqdn=summary-page
- Credits left after all verification runs: **10,924.93**.

## Notes (honest footnotes)

- **Step 4 was tightened before the RED run.** The first passing run
  (before the fix) passed step 4 on a vacuous check: Kane's agent derived
  `discount / total = 10%` from the discount line instead of reading the
  Total itself — true by construction even with the bug. Step 4 now
  asserts the literal value: "the Total line reads exactly $26.99, not
  $29.99". The expected outcome was strengthened, not dropped; the re-run
  then failed exactly as intended.
- **NO_PROXY breaks Kane's runner.** The first run crashed before any
  browser step (`httpx.InvalidURL: Invalid port: ':1]'`) because this
  machine's `NO_PROXY` contains bare/bracketed IPv6 literals (`::1`,
  `[::1]`, …) that httpx cannot parse when building its LLM client.
  Fix: pin `NO_PROXY=localhost,127.0.0.1` — also baked into
  `scripts/deploy-gate.sh`. That crashed run cost 0 credits.
- **Step 3 is flaky on first attempt.** In every run, step 3 failed once
  (analyzer hiccup) and the runner auto-retried from step 1 and passed.
  Not a product bug.
- **Live fallback:** the static app is also deployed on GitHub Pages at
  https://buahrasa01-hub.github.io/kanegate/ (branch `gh-pages`).

## Red-Green Story

- **Red**: v1 shipped with a seeded coupon bug (total stayed $29.99 after SAVE10)
- **Kane caught it**: run 1 failed at step 4 with the remark quoted above
- **Fix**: `updateTotalDisplay()` wired into `applyCoupon()` + `updateCartDisplay()` in `app/app.js`
- **Green**: run 2 passed 6/6; the gate wrote `dist/DEPLOYED`

## Repo structure

```
app/
  index.html          – Store UI
  style.css          – Styles
  app.js             – Logic (coupon bug fixed in v2)
scripts/
  deploy-gate.sh     – The gate script
tests/
  checkout_test.md   – TestMD test suite
  output-checkout/   – Replay artifacts from the passing run
package.json
README.md
AGENTS.md
.github/workflows/
  kane-gate.yml      – CI gate
.gitignore
```

## Hackathon notes

- Repository initialized for KaneCLI Hackathon, TestMu AI
- Public repo: https://github.com/buahrasa01-hub/kanegate
- No backend, no external services – pure static demo
- The seeded bug was real, caught by Kane, and fixed — see "Kane verification results" above
