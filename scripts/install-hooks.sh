#!/bin/bash

# Script to install git hooks for the Pittaya UI CLI

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GIT_DIR="$(git rev-parse --git-dir 2>/dev/null)"

if [ -z "$GIT_DIR" ]; then
  echo "❌ Not a git repository"
  exit 1
fi

HOOKS_DIR="$GIT_DIR/hooks"

echo "🔧 Installing git hooks..."

# Install pre-commit hook
echo "   📝 Installing pre-commit hook..."
cp "$SCRIPT_DIR/pre-commit-hook.sh" "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/pre-commit"

echo "✅ Git hooks installed successfully!"
echo ""
echo "📋 Installed hooks:"
echo "   - pre-commit: Validates dependencies before commit"
echo ""
echo "💡 To skip hook: git commit --no-verify"
echo "💡 To uninstall: rm $HOOKS_DIR/pre-commit"

