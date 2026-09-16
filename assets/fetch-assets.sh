#!/usr/bin/env bash
# Download the handful of Figma-exported assets that are not in the repo yet,
# so the lobby renders without touching the network.
#
#   ./assets/fetch-assets.sh
#
# lobby.js already looks in assets/img/ first and only falls back to Figma's
# CDN, so there is nothing to switch on afterwards — the files just get used.
#
# Figma's export URLs expire roughly a week after they are generated. If these
# 404, re-export node 736:402 and update the PENDING map in assets/lobby.js
# with the fresh URLs (or export the layers by hand into assets/img/ using the
# filenames below).

set -euo pipefail
cd "$(dirname "$0")"
mkdir -p img

# Parse the PENDING map in lobby.js: "'name' : 'url'," -> "name url"
grep -oE "^  '[a-z0-9.-]+' *: *'https://[^']+'," lobby.js \
| sed -E "s/^  '([^']+)' *: *'([^']+)',/\1 \2/" \
| while read -r name url; do
    printf 'fetching %-22s -> img/%s\n' "$name" "$name"
    curl -fsSL -o "img/$name" "$url"
  done

echo "done — reload index.html"
