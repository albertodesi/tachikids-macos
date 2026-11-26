# TachiKids

Native SwiftUI macOS app for short visual-reading exercises for primary-school children.

## Features
- Random words across ten progressively harder difficulty levels
- Syllable-like letter groups from 2 to 5 characters
- Visual-memory mode with multiple-choice recall
- Editable timing fields for exposure, pause and font size
- Player name and animated in-app celebration at the end of each session
- Custom macOS app icon based on the in-app eye symbol
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


## Vocabolario italiano per la lettura
- Vocabolario locale integrato di 9.972 parole, suddiviso in 10 livelli progressivi.
- I livelli 1–9 contengono 1.000 parole ciascuno; il livello 10 ne contiene 972. Gli stimoli sono disponibili offline.
- Il dataset distingue il nucleo di parole comuni (`core`) dal lessico esteso (`extended`).
- Fonti, criteri di selezione, attribuzione e limiti sono documentati in [VOCABULARY-SOURCES.md](VOCABULARY-SOURCES.md).


**Reading-vocabulary note:** the current dataset prioritizes the common-word subset and is grouped by estimated spelling complexity. It is not yet ranked by a primary-school reading corpus. Research notes and source limitations are documented in [VOCABULARY-SOURCES.md](VOCABULARY-SOURCES.md).

## Web app (PWA)

TachiKids is also available as a browser-based Progressive Web App, with no mandatory installation. It includes the three training modes (words, syllables and visual memory), adjustable exposure/pause/font size, ten vocabulary levels, session progress and a local last-session summary. The app is designed for mobile, tablet and desktop and caches its assets and vocabulary for offline use after the first successful load.

- Open the GitHub Pages site: https://albertodesi.github.io/tachikids-macos/
- On iPhone/iPad: open the link in Safari and use **Condividi → Aggiungi alla schermata Home** if you want an app-like shortcut.
- Deployment is automatic through GitHub Actions on changes to `web/` or the vocabulary JSON. Before the first deployment, enable GitHub Pages manually in repository Settings → Pages → Build and deployment → **GitHub Actions**. The connected GitHub integration cannot enable this repository setting on your behalf.

The native SwiftUI macOS app remains available; the web app is an additional, install-free way to use TachiKids.
