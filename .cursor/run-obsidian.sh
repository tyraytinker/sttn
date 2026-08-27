#!/usr/bin/env bash
# Launch Obsidian with this repo's vault opened. Runs as a Cloud Agent terminal
# so the GUI stays visible and its logs are inspectable.
set -euo pipefail

export DISPLAY="${DISPLAY:-:1}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VAULT_DIR="$REPO_ROOT/Obsidian Vault"

# Register the vault so Obsidian opens it directly instead of the vault picker.
CONFIG_DIR="$HOME/.config/obsidian"
mkdir -p "$CONFIG_DIR"
cat > "$CONFIG_DIR/obsidian.json" <<JSON
{
  "vaults": {
    "clouddevvault0001": {
      "path": "$VAULT_DIR",
      "ts": $(date +%s000),
      "open": true
    }
  }
}
JSON

echo "Opening vault: $VAULT_DIR"
exec obsidian --no-sandbox
