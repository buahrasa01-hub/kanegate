# AGENTS.md

**Kane verify-fix loop**

This repo implements the Kane verification workflow:

1. **Change code** – modify `app/app.js` to fix the seeded bug
2. **Serve** – run `npm run serve` (or let `scripts/deploy-gate.sh` start server)
3. **Run Kane CLI** – execute `kane-cli testmd run tests/checkout_test.md --agent --headless`
4. **Read exit code** – interpret results:
   - `0` → deployment allowed (`dist/DEPLOYED` written)
   - `2` → not signed in – exit with refusal
   - other → fix from failing step remark and rerun same objective
5. **Never drop expected outcome** – keep running until exit 0 is achieved

**Environment variables**

- `KANE_CLI_USER_AGENT=codex` – required for agent mode
- `KANE_CLI_CHROME_PATH` – optional path to Chrome binary for non-standard installations

**Official documentation**

- Kane CLI agent instructions: https://www.testmuai.com/kane-cli-agent/AGENTS.md
