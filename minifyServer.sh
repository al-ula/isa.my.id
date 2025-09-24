#!/usr/bin/env bash
echo "Minifying server build"
terser --module -c -m -o build/server/index.min.js -- build/server/index.js
echo "Replacing index.js with minified version"
rm build/server/index.js
mv build/server/index.min.js build/server/index.js
echo "Done"