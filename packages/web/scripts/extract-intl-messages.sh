#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

rm -rf "./intl/messages"

if [[ $* == *--check* ]]; then
  echo "Translations extraction running in check mode"
fi

echo "Creating messages..."
node_modules/.bin/babel "./app/**/*.{ts,tsx}" > /dev/null
echo "done"

echo "Merging with locale file for en-en"
if [[ $* == *--check* ]]; then
  node ./scripts/mergeMessagesWithLocales.js --check
else
  node ./scripts/mergeMessagesWithLocales.js
fi

echo "done"
