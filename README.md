# KaneGate

KaneGate is a tiny hackathon entry that implements a deployment gate powered by Kane CLI.

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

The first run will refuse deployment because the coupon bug is intentionally seeded. Fix the bug in `app/app.js`, then run `npm run verify` again to see the gate pass.

## Red-Green Story

- **Red**: Initial state ships with a seeded coupon bug (total doesn't update)
- **Green**: Kane CLI detects the failure via `tests/checkout_test.md`
- **Fix**: Update the total display logic in `app/app.js`
- **Verify**: Re-run `npm run verify` – now the gate allows deployment

## Repo structure

```
app/
  index.html          – Store UI
  style.css          – Styles
  app.js             – Logic (contains the seeded bug)
scripts/
  deploy-gate.sh     – The gate script
tests/
  checkout_test.md   – TestMD test suite
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
- Seeded bug intentionally left for verification demo
