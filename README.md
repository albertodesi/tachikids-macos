# TachiKids

Native SwiftUI macOS app for short visual-reading exercises for primary-school children.

## Features
- Random words across five difficulty levels
- Syllable-like letter groups from 2 to 5 characters
- Visual-memory mode with multiple-choice recall
- Adjustable exposure, pause, font size and session length
- Local session summary

## Requirements
- macOS 13+
- Xcode 15+ / Swift 5.9+

## Run locally
```bash
swift run
```

## Build an app bundle
```bash
chmod +x build-app.sh
./build-app.sh
```
The app bundle is created at `dist/TachiKids.app`.

## Automated build
Every push to `main` runs a macOS build. Download the ZIP from the Actions run's Artifacts section. Pushing a tag such as `v2.0.0` also creates a GitHub Release with the ZIP attached.

The app is not code-signed or notarized. Gatekeeper may require opening it via right-click > Open. Signing and notarization require an Apple Developer ID.
