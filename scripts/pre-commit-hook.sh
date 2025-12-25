#!/bin/bash

# Pre-commit hook for Pittaya UI CLI
# Validates dependencies before allowing commits to registry components

echo "🔍 Running pre-commit validation..."

# Check if any registry style files were modified
CHANGED_COMPONENTS=$(git diff --cached --name-only | grep "^registry/styles/.*\.json$")

if [ -z "$CHANGED_COMPONENTS" ]; then
  echo "✅ No registry styles modified, skipping validation"
  exit 0
fi

echo "📦 Registry styles modified:"
echo "$CHANGED_COMPONENTS" | sed 's/^/   - /'
echo ""

# Run validation
npm run validate:deps --silent

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Pre-commit validation failed!"
  echo "💡 Fix the missing dependencies before committing"
  echo "💡 Or skip this check with: git commit --no-verify"
  exit 1
fi

echo "✅ Pre-commit validation passed!"
exit 0

