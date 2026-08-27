#!/usr/bin/env bash
# Idempotent Cloud Agent setup for the Obsidian vault:
#   1. Install the Obsidian desktop app (the "application" for this repo).
#   2. Reinstall the obsidian-git plugin binary, which .gitignore excludes.
set -euo pipefail

OBSIDIAN_VERSION="1.13.7"
GIT_PLUGIN_VERSION="2.38.6"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VAULT_DIR="$REPO_ROOT/Obsidian Vault"
PLUGIN_DIR="$VAULT_DIR/.obsidian/plugins/obsidian-git"

install_obsidian() {
  if command -v obsidian >/dev/null 2>&1; then
    echo "Obsidian already installed: $(readlink -f "$(command -v obsidian)")"
    return
  fi
  echo "Installing Obsidian ${OBSIDIAN_VERSION}..."
  local deb="/tmp/obsidian_${OBSIDIAN_VERSION}_amd64.deb"
  curl -fsSL -o "$deb" \
    "https://github.com/obsidianmd/obsidian-releases/releases/download/v${OBSIDIAN_VERSION}/obsidian_${OBSIDIAN_VERSION}_amd64.deb"
  sudo apt-get update -qq
  sudo apt-get install -y -q "$deb"
  rm -f "$deb"
}

install_git_plugin() {
  # main.js is gitignored (bundled plugin binary), so restore it from the
  # matching release so the vault's Git integration works inside Obsidian.
  echo "Installing obsidian-git ${GIT_PLUGIN_VERSION} binary..."
  mkdir -p "$PLUGIN_DIR"
  curl -fsSL -o "$PLUGIN_DIR/main.js" \
    "https://github.com/Vinzent03/obsidian-git/releases/download/${GIT_PLUGIN_VERSION}/main.js"
}

install_obsidian
install_git_plugin
echo "Setup complete."
