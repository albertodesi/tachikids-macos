#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
swift build -c release
APP="dist/TachiKids.app"
mkdir -p "$APP/Contents/MacOS"
cp ".build/release/TachiKids" "$APP/Contents/MacOS/TachiKids"
cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleName</key><string>TachiKids</string>
<key>CFBundleDisplayName</key><string>TachiKids</string>
<key>CFBundleIdentifier</key><string>it.tachikids.app</string>
<key>CFBundleVersion</key><string>2.0</string>
<key>CFBundleShortVersionString</key><string>2.0</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>LSMinimumSystemVersion</key><string>13.0</string>
<key>NSHighResolutionCapable</key><true/>
</dict></plist>
PLIST
echo "Created $APP"
