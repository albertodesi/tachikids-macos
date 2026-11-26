#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
swift build -c release
mkdir -p dist
swift Scripts/make-icon.swift dist/TachiKids-icon.png
ICONSET="dist/TachiKids.iconset"
mkdir -p "$ICONSET"
for spec in "16 16" "32 32" "32 64" "128 128" "128 256" "256 256" "256 512" "512 512" "512 1024"; do
  set -- $spec
  size="$1"; pixels="$2"
  suffix=""
  [ "$pixels" -gt "$size" ] && suffix="@2x"
  sips -z "$pixels" "$pixels" dist/TachiKids-icon.png --out "$ICONSET/icon_${size}x${size}${suffix}.png" >/dev/null
done
iconutil -c icns "$ICONSET" -o dist/TachiKids.icns
APP="dist/TachiKids.app"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp ".build/release/TachiKids" "$APP/Contents/MacOS/TachiKids"
cp dist/TachiKids.icns "$APP/Contents/Resources/TachiKids.icns"
cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleName</key><string>TachiKids</string>
<key>CFBundleDisplayName</key><string>TachiKids</string>
<key>CFBundleIdentifier</key><string>it.tachikids.app</string>
<key>CFBundleVersion</key><string>3.0</string>
<key>CFBundleShortVersionString</key><string>3.0</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleIconFile</key><string>TachiKids</string>
<key>LSMinimumSystemVersion</key><string>13.0</string>
<key>NSHighResolutionCapable</key><true/>
</dict></plist>
PLIST
echo "Created $APP"
