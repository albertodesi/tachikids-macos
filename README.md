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


## Percorso adattivo e basi scientifiche

La PWA propone un percorso di esposizione progressiva con sei step interni (900, 800, 700, 600, 500 e 450 ms). Questi valori sono **parametri sperimentali di prodotto**, scelti per rendere graduale l'esercizio: non sono soglie cliniche, né tempi ottimali stabiliti dalla letteratura.

Ogni stimolo è seguito da una scelta a quattro alternative, così il sistema misura una risposta e può adattare il livello:
- almeno 90% di risposte corrette per due sessioni consecutive: si avanza di uno step;
- meno del 75%: si torna a uno step più lento;
- tra 75% e 89%: si mantiene lo step.

Le soglie 90%/75% e la regola delle due sessioni sono euristiche iniziali da validare con osservazioni d'uso; non sono cut-off diagnostici. Il punteggio non è una valutazione scolastica o clinica.

### Cosa dice la letteratura (e cosa non dice)

- Uno studio eye-tracking su bambini italiani di terza, quarta e quinta primaria ha osservato una prima fissazione media di circa 246, 227 e 199 ms rispettivamente, su parole derivate presentate in contesto. La durata della prima fissazione non equivale al tempo per cui un'app dovrebbe mostrare una parola. [Studio open access](https://pmc.ncbi.nlm.nih.gov/articles/PMC6279875/).
- Nello stesso studio, la durata dello sguardo (gaze duration) era molto più lunga e dipendeva anche da lunghezza, frequenza e competenza di lettura. Questo conferma che non esiste un singolo tempo universale da applicare a ogni parola e bambino.
- Le norme di fluenza su brani o liste (ad esempio sillabe/secondo o parole corrette al minuto) misurano una prestazione diversa dall'esposizione flash di parole. Non vanno convertite direttamente in millisecondi di presentazione. Un riferimento italiano di prove di lettura è disponibile [qui (AIRIPA)](https://www.airipa.it/wp-content/uploads/2013/12/Articolo-percentili-Losito-Tressoldi-Cornoldi-1-1.pdf).

Perciò TachiKids non dichiara un "tempo ideale" scientifico. Gli step temporali servono solo a strutturare un allenamento personalizzato; in futuro potranno essere calibrati con un campione più ampio, per classe, familiarità lessicale e accuratezza.

### Ripresa del percorso e privacy

Il profilo viene salvato in `localStorage` sul browser/dispositivo e identificato da un codice casuale di ripresa. Non c'è login, backend o sincronizzazione cloud. Il codice è un riferimento locale, **non** un account e non consente di recuperare il percorso su un altro dispositivo o browser. Cancellando i dati del sito si può perdere il percorso.
