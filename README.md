# TachiKids

TachiKids è una **Progressive Web App (PWA)** per allenare il riconoscimento visivo delle parole, delle sillabe, la memoria e la lettura ad alta voce. È pensata per bambini della scuola primaria e si usa da browser su computer, tablet e smartphone: non richiede un'app nativa, un account o un backend.

## Apri TachiKids

**https://albertodesi.github.io/tachikids-webapp/**

Su iPhone e iPad: apri il link in Safari, tocca **Condividi → Aggiungi alla schermata Home**. Su Android e sui browser desktop compatibili puoi usare il comando di installazione del browser.

## Funzionalità

- **Profilo bambino**: nome, scelta del genere grammaticale per saluti e messaggi, ripresa del percorso tramite profilo locale.
- **Parole**: presentazione flash in sequenza automatica, con catalogo italiano di circa 9.900 forme lessicali e dieci fasce interne di complessità ortografica approssimata.
- **Sillabe**: esercizi con gruppi di lettere e lunghezza configurabile.
- **Memoria**: modalità dedicata agli esercizi di osservazione e richiamo.
- **Leggi ad alta voce**: parole mostrate una alla volta, riconoscimento vocale opzionale quando supportato dal browser e valutazione complessiva a cura dell'adulto.
- **Filtri avanzati collassabili**: numero stimato di sillabe, pattern ortografici, provenienza lessicale (core / extended) e lunghezza massima.
- **Liste personalizzate**: l'adulto può inserire una propria lista di parole.
- **Tabelle di lettura**: griglie 3×4, 4×4 e 5×5, stampabili e generate in base ai filtri selezionati.
- **Tempi regolabili**: esposizione e pausa tra gli stimoli; opzione sperimentale per adattare l'esposizione al numero stimato di sillabe.
- **Percorso e progressi**: riepilogo delle sessioni e avanzamento adattivo basato su regole euristiche.
- **Interfaccia responsive**: layout desktop compatto e mobile con scorrimento naturale.
- **PWA e uso offline**: dopo il primo caricamento online, le risorse principali vengono memorizzate dal service worker per consentire l'apertura offline.

## Repository e struttura

- `web/index.html`: struttura dell'app e schermate.
- `web/app.js`: logica delle modalità, profili e sessioni.
- `web/styles.css`: interfaccia responsive e stili.
- `web/content-engine.js`: stime di sillabazione, pattern ortografici e tempi adattivi.
- `web/vocabulary/reading-vocabulary-it.json`: catalogo lessicale.
- `web/sw.js`: service worker e cache offline.
- `web/manifest.webmanifest`: configurazione PWA.
- `VOCABULARY-SOURCES.md`: fonti, attribuzioni, criteri di selezione e limiti del vocabolario.
- `CONTENT-MODEL.md`: modello dei contenuti e metadati.

## Sviluppo e pubblicazione

Il sito pubblicato è servito da GitHub Pages. Il workflow [Deploy TachiKids Web App](.github/workflows/deploy-web.yml) pubblica automaticamente il contenuto di `web/` quando vengono aggiornati i file della web app su `main`, oppure tramite avvio manuale del workflow.

Per configurare GitHub Pages, in **Settings → Pages → Build and deployment** la sorgente deve essere **GitHub Actions**.

## Vocabolario: cosa significano i livelli

Il catalogo contiene circa 9.900 forme lessicali. Le fasce 1–10 sono una classificazione interna euristica basata sulla complessità ortografica approssimata: **non corrispondono a classi scolastiche, livelli clinici o fasce di frequenza certificate**.

Anche il conteggio delle sillabe e il riconoscimento dei pattern ortografici sono stime automatiche, non annotazioni linguistiche certificate. Le etichette core ed extended indicano la provenienza dei record dalle liste di origine, non una misura quantitativa della frequenza d'uso. Per dettagli e limiti consultare [VOCABULARY-SOURCES.md](VOCABULARY-SOURCES.md).

## Percorso adattivo: limiti interpretativi

I tempi di esposizione e le regole di avanzamento sono parametri sperimentali di prodotto ed euristiche iniziali. Non sono soglie cliniche, tempi ottimali stabiliti dalla letteratura o benchmark diagnostici. I risultati dell'app non costituiscono una valutazione scolastica o clinica.

## Privacy e riconoscimento vocale

- Il profilo, le sessioni e le liste personalizzate sono salvati in `localStorage` nel browser/dispositivo.
- Non sono previsti login, backend o sincronizzazione cloud.
- Cancellando i dati del sito o cambiando dispositivo/browser, il percorso locale può andare perso.
- La modalità di lettura mantiene la valutazione manuale come alternativa al riconoscimento vocale.
- Il riconoscimento vocale dipende dal supporto del browser e può utilizzare un servizio remoto che riceve l'audio. TachiKids non salva registrazioni audio. L'adulto deve autorizzare il microfono e valutare se usare questa funzione.
- Riferimento tecnico: [MDN — SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

## Obiettivo del progetto

TachiKids è uno strumento di esercizio e supporto alla pratica domestica. Non sostituisce l'insegnamento, la valutazione dell'insegnante o un percorso specialistico.
