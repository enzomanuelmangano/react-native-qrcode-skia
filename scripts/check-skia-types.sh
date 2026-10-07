#!/usr/bin/env bash
# Checks that a React Native Skia package satisfies the subset of its API this
# library uses (`SkiaModule` in src/skia.ts).
#
# Usage: scripts/check-skia-types.sh <package> [version]
#   <package>  react-native-skia | @shopify/react-native-skia
#   [version]  optional; that version is downloaded into .skia-compat/ and
#              checked instead of the installed one. node_modules is untouched.
set -euo pipefail

pkg="${1:?usage: $0 <react-native-skia | @shopify/react-native-skia> [version]}"
version="${2:-}"
pkg_dir="node_modules/$pkg"

check="src/skia-compat.check.ts"
tsconfig="tsconfig.skia-compat.json"
tmp=""
cleanup() {
  rm -f "$check" "$tsconfig"
  if [[ -n "$tmp" ]]; then rm -rf "$tmp"; fi
}
trap cleanup EXIT

if [[ -n "$version" ]]; then
  pkg_dir=".skia-compat/node_modules/$pkg"
  tmp="$(mktemp -d)"
  (cd "$tmp" && npm pack "$pkg@$version" --silent >/dev/null && tar xzf ./*.tgz)
  rm -rf "$pkg_dir"
  mkdir -p "$(dirname "$pkg_dir")"
  mv "$tmp/package" "$pkg_dir"
fi

cat > "$check" <<TS
import * as skia from '$pkg';
import type { SkPath } from '$pkg';
import type { SkiaModule } from './skia';

export const compat: SkiaModule<SkPath> = skia;
TS

# Only the library is checked (not the example). `paths` replaces the
# parent's, so merge in the existing aliases.
node -e '
  const [tsconfig, pkg, dir] = process.argv.slice(1);
  const { paths = {} } = require("./tsconfig.json").compilerOptions;
  const config = {
    extends: "./tsconfig.json",
    include: ["src"],
    compilerOptions: { paths: { ...paths, [pkg]: [`./${dir}`] } },
  };
  require("fs").writeFileSync(tsconfig, JSON.stringify(config, null, 2));
' "$tsconfig" "$pkg" "$pkg_dir"

npx tsc --noEmit -p "$tsconfig"
echo "✔ $pkg@$(node -p "require('./$pkg_dir/package.json').version") satisfies SkiaModule"
