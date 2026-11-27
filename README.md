# TachiKids — Web App

TachiKids è una Progressive Web App (PWA) per esercizi di lettura, pensata per bambini della scuola primaria. Si usa da browser su iPhone, iPad, Android, tablet e computer: non richiede un'app nativa né un account.

## Apri TachiKids

**https://albertodesi.github.io/tachikids-macos/**

Su iPhone/iPad: apri il link in Safari, tocca **Condividi → Aggiungi alla schermata Home** per avere un'icona come un'app.

## Funzionalità

- **Parole**: sequenza automatica di parole italiane organizzate in dieci livelli di difficoltà.
- **Sillabe**: sequenza automatica di gruppi di lettere di lunghezza configurabile.
- **Memoria visiva**: esercizi di osservazione e richiamo.
- **Lettura ad alta voce**: parole mostrate una alla volta, valutazione da parte di un adulto e riconoscimento vocale opzionale quando supportato dal browser.
- Regolazione di esposizione, pausa e dimensione del carattere.
- Profilo e progressi salvati localmente nel browser.
- PWA installabile dalla schermata Home e risorse memorizzate per l'uso offline dopo il primo caricamento riuscito.

## Sviluppo e pubblicazione

Il codice applicativo è in `web/`. Il vocabolario italiano è in `web/vocabulary/reading-vocabulary-it.json`.

La pubblicazione su GitHub Pages è automatica tramite GitHub Actions a ogni modifica alla web app. Workflow: [Deploy TachiKids Web App](.github/workflows/deploy-web.yml).

Per la prima configurazione, in **Settings → Pages → Build and deployment**, seleziona **GitHub Actions**.

## Vocabolario italiano

Il dataset contiene parole suddivise in dieci livelli progressivi. Fonti, criteri di selezione, attribuzione e limiti sono documentati in [VOCABULARY-SOURCES.md](VOCABULARY-SOURCES.md).

## Percorso adattivo e basi scientifiche

I tempi di esposizione sono parametri sperimentali di prodotto, non soglie cliniche né tempi ottimali stabiliti dalla letteratura. Le regole di avanzamento del percorso sono euristiche iniziali da validare: il punteggio non è una valutazione scolastica o clinica.

Uno studio eye-tracking su bambini italiani ha osservato tempi di prima fissazione e gaze duration differenti in base a classe, lunghezza e frequenza delle parole; tali misure non definiscono un tempo universale per la presentazione flash. [Studio open access](https://pmc.ncbi.nlm.nih.gov/articles/PMC6279875/). Per prove di lettura e fluenza, consultare anche le risorse [AIRIPA](https://www.airipa.it/wp-content/uploads/2013/12/Articolo-percentili-Losito-Tressoldi-Cornoldi-1-1.pdf).

## Privacy e riconoscimento vocale

Il profilo viene salvato in `localStorage` sul browser/dispositivo: non c'è login, backend o sincronizzazione cloud. Cancellando i dati del sito si può perdere il percorso.

La modalità di lettura mantiene sempre la valutazione manuale come alternativa. Il riconoscimento vocale dipende dal browser; può usare un servizio remoto e inviare l'audio. TachiKids non registra né conserva file audio. L'adulto deve leggere l'avviso e autorizzare il microfono prima dell'uso. Riferimenti: [MDN — SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).
