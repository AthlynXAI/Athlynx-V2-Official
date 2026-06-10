#!/bin/bash
set -e

echo "=== Step 1: Clean previous build output ==="
rm -rf .vercel/output

echo "=== Step 2: Build Vite frontend ==="
npx vite build --config vite.vercel.config.ts

echo "=== Step 3: Create .vercel/output structure ==="
mkdir -p .vercel/output/static
mkdir -p .vercel/output/functions/api/index.func

echo "=== Step 4: Copy Vite output to .vercel/output/static ==="
cp -r dist/public/* .vercel/output/static/

echo "=== Step 5: Bundle api/index.ts with esbuild ==="
npx esbuild server/entry.ts \
  --bundle \
  --platform=node \
  --target=node18 \
  --format=cjs \
  --outfile=.vercel/output/functions/api/index.func/index.cjs \
  --external:pg-native \
  --external:@mapbox/node-pre-gyp \
  --external:mock-aws-s3 \
  --external:aws-sdk \
  --external:nock \
  --loader:.ts=ts \
  --define:import.meta.url=__filename \
  --define:import.meta.dirname=__dirname

echo "=== Step 6: Create .vc-config.json for the function ==="
cat > .vercel/output/functions/api/index.func/.vc-config.json << 'EOF'
{
  "runtime": "nodejs22.x",
  "handler": "index.cjs",
  "launcherType": "Nodejs",
  "shouldAddHelpers": false,
  "maxDuration": 30
}
EOF

echo "=== Step 6b: Add package.json with type:commonjs to prevent Vercel ESM recompilation ==="
cat > .vercel/output/functions/api/index.func/package.json << 'EOF'
{
  "type": "commonjs"
}
EOF

echo "=== Step 7: Create config.json with routes ==="
cat > .vercel/output/config.json << 'EOF'
{
  "version": 3,
  "routes": [
    { "src": "/callback", "dest": "/index.html" },
    { "src": "/api/(.*)", "dest": "/api/index" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
EOF

echo "=== Build complete ==="
ls -la .vercel/output/
ls -la .vercel/output/functions/api/index.func/
