#!/usr/bin/env bash
# Download the Figma-exported art into assets/img/ so the demo stops depending
# on Figma's CDN (those export URLs expire ~7 days after they are generated).
#
#   ./assets/fetch-assets.sh
#
# Then set USE_LOCAL_ASSETS = true at the top of assets/lobby.js.
#
# If the URLs have already expired, re-export node 700:1173 from the Figma file
# and replace the REMOTE map in assets/lobby.js with the fresh URLs.

set -euo pipefail

cd "$(dirname "$0")"
mkdir -p img

# Parse the REMOTE map in lobby.js: "key : 'url'," -> "key url"
grep -oE "^  [a-zA-Z]+ *: *'https://[^']+'," lobby.js \
| sed -E "s/^  ([a-zA-Z]+) *: *'([^']+)',/\1 \2/" \
| while read -r key url; do
    ext=png
    [[ "$url" == *.svg ]] && ext=svg
    printf 'fetching %-11s -> img/%s.%s\n' "$key" "$key" "$ext"
    curl -fsSL -o "img/$key.$ext" "$url"
  done

echo "done — now set USE_LOCAL_ASSETS = true in assets/lobby.js"
