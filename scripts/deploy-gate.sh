#!/usr/bin/env bash
# KaneGate deploy gate: refuse to deploy until Kane CLI passes the checkout test.
set -euo pipefail

PORT="${PORT:-4173}"
APP_URL="${APP_URL:-http://localhost:${PORT}}"
SERVER_PID=""

# httpx inside Kane's v16-runner crashes while building its LLM client when
# NO_PROXY contains bare/bracketed IPv6 literals (e.g. ::1, [::1]):
# "httpx.InvalidURL: Invalid port: ':1]'". Local verification only ever
# needs localhost to bypass the proxy, so pin a safe value here.
export NO_PROXY="localhost,127.0.0.1"
export no_proxy="localhost,127.0.0.1"

# Always run from the repo root (this script lives in scripts/).
cd "$(dirname "$0")/.."

# Ensure the app is reachable; if not, start a local server on the same port
# the test opens (4173 — keep in sync with tests/checkout_test.md).
if ! curl -s -o /dev/null -w "%{http_code}" "$APP_URL" | grep -q "200"; then
    echo "Starting local server on port ${PORT}"
    python3 -m http.server "${PORT}" --directory app &
    SERVER_PID=$!
    trap 'if [ -n "${SERVER_PID:-}" ]; then kill $SERVER_PID 2>/dev/null || true; fi' EXIT INT TERM
    sleep 1
fi

# Resolve kane-cli: repo-local install first, then global, then npx.
# (Array form — a "npx kane-cli" string would be looked up as one binary name.)
if [ -x ./node_modules/.bin/kane-cli ]; then
    KANE_CMD=(./node_modules/.bin/kane-cli)
elif command -v kane-cli >/dev/null 2>&1; then
    KANE_CMD=(kane-cli)
else
    KANE_CMD=(npx --yes @testmuai/kane-cli)
fi

# Chrome binary: honour an explicit path, else fall back to common locations
# (this VM keeps Chrome at an extracted path, not on PATH).
if [ -z "${KANE_CLI_CHROME_PATH:-}" ]; then
    for candidate in /usr/bin/google-chrome /usr/bin/google-chrome-stable /usr/bin/chromium "$HOME/workspace/tools/chrome-extract/opt/google/chrome/chrome"; do
        if [ -x "$candidate" ]; then
            export KANE_CLI_CHROME_PATH="$candidate"
            break
        fi
    done
fi

# Set required environment variable
export KANE_CLI_USER_AGENT=codex

# Run the test command — capture the EXIT CODE (not stdout).
echo "Running Kane CLI test..."
EXIT_CODE=0
"${KANE_CMD[@]}" testmd run tests/checkout_test.md --agent --headless || EXIT_CODE=$?

# Handle results
case $EXIT_CODE in
    0)
        mkdir -p dist
        echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > dist/DEPLOYED
        echo "DEPLOY ALLOWED"
        ;;
    2)
        echo "DEPLOY REFUSED"
        echo "Kane not signed in — cannot verify (kane-cli login required)"
        exit 1
        ;;
    *)
        echo "DEPLOY REFUSED (kane exit code ${EXIT_CODE})"
        exit 1
        ;;
esac
