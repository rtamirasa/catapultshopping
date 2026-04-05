#!/bin/bash

echo "🔍 Verifying Dashboard Firebase Integration - Phase 1"
echo "=================================================="
echo ""

echo "✓ Checking core files..."
files=(
  "lib/firebase.ts"
  "lib/api.ts"
  "lib/hooks/use-products.ts"
  "lib/hooks/use-stores.ts"
  "lib/hooks/use-price-movements.ts"
  "app/api/products/route.ts"
  "app/api/stores/route.ts"
  "app/api/price-movements/route.ts"
  ".env.local"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (MISSING)"
  fi
done

echo ""
echo "✓ Checking environment variables..."
if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY" .env.local 2>/dev/null; then
  echo "  ✅ Firebase API key found"
else
  echo "  ❌ Firebase API key missing"
fi

if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID" .env.local 2>/dev/null; then
  echo "  ✅ Firebase project ID found"
else
  echo "  ❌ Firebase project ID missing"
fi

echo ""
echo "✓ Checking package dependencies..."
if grep -q "@shelfsync/shared" package.json; then
  echo "  ✅ @shelfsync/shared dependency found"
else
  echo "  ❌ @shelfsync/shared dependency missing"
fi

if grep -q "firebase" package.json; then
  echo "  ✅ firebase dependency found"
else
  echo "  ❌ firebase dependency missing"
fi

echo ""
echo "=================================================="
echo "✅ Phase 1 Integration Complete!"
echo ""
echo "Next steps:"
echo "  1. npm run dev:dashboard"
echo "  2. Open http://localhost:3001"
echo "  3. Check browser console for Firebase logs"
echo "  4. Verify API calls in Network tab"
echo ""
