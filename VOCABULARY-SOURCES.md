# Vocabolario TachiKids — fonti e criteri

## Contenuto
- 9.972 lemmi/forme selezionate per esercizi di lettura.
- 10 livelli progressivi, con 1.000 stimoli per livello.
- 1.132 voci del file `1000_parole_italiane_comuni.txt` sono marcate `core`.
- Le restanti voci provengono da `60000_parole_italiane.txt` e sono marcate `extended`.

## Fonte
Repository: https://github.com/napolux/paroleitaliane  
File: `paroleitaliane/1000_parole_italiane_comuni.txt` e `paroleitaliane/60000_parole_italiane.txt`  
Licenza dichiarata dal repository: MIT.  
Versione consultata: 26 novembre 2026.  
Commit sorgente per la lista 60.000: `749d665468746bca5fff3e3a650f04f010c31fcf`.

## Criteri e limiti
- Esclusi caratteri non alfabetici, parole sotto 3 o sopra 16 caratteri, termini presenti nella lista di parole volgari della stessa fonte e alcune terminazioni tipiche di forme verbali flesse o derivazioni poco adatte.
- Il nucleo `core` è collocato prima del lessico esteso; le parole sono ordinate per una stima semplice della complessità (lunghezza e gruppi vocalici).
- Le 10 fasce sono ordinate per complessità ortografica approssimata (lunghezza e gruppi vocalici), non per frequenza statistica.
- Le ripetizioni sono evitate all'interno della sessione: la coda viene rimescolata solo quando il livello esaurisce le proprie parole.
- All'avvio l'app usa prima la copia locale in cache, poi quella inclusa nell'app; prova quindi a scaricare l'ultima versione pubblicata sul branch `main` e aggiorna la cache. Senza connessione continua a funzionare offline.
- `core` identifica la lista sorgente delle parole comuni; `extended` identifica la lista estesa. Non è una graduatoria di frequenza.
- Il repository sorgente dichiara che alcune liste hanno provenienza ignota: il vocabolario esteso va quindi considerato una base lessicale da revisionare, non un dizionario normativo.
- Il conteggio delle sillabe è una stima automatica per gruppi vocalici, non una sillabazione linguistica certificata.

## Frequenza nei testi scritti
Per un ulteriore affinamento didattico, la fonte scientificamente più pertinente è CoLFIS (CNR/Scuola Normale Superiore): corpus di italiano scritto con quotidiani, periodici e libri, lemmatizzato e annotato per parte del discorso. Il CNR mette a disposizione il lessico per consultazione/download gratuito, ma non ho incorporato i suoi dati perché non ho verificato una licenza esplicita che autorizzi redistribuzione dentro l'app.
Riferimenti:
- https://www.istc.cnr.it/it/grouppage/colfis
- https://ricerca.sns.it/handle/11384/5677

Un'ulteriore fonte molto interessante per l'età scolare è il lessico di frequenza della lettura e scrittura dei bambini della primaria citato nella letteratura CNR; non è stato copiato nel dataset.

## Ricerca su lessico scolastico e testi per bambini (26 novembre 2026)

- **Lessico Elementare** (Marconi, Ott, Pesenti, Ratti, Tavella, 1994): è la fonte concettualmente più adatta. È basato su circa un milione di occorrenze da testi letti e scritti da bambini della primaria; la componente di lettura distingue libri/fiabe, giornalini/fumetti e libri di testo. La letteratura descrive un Lessico Elementare di base di 6.095 parole e un Lessico di Lettura di 5.511 parole. La scheda bibliografica CNR non mette a disposizione i dati lessicali come file aperto; non sono stati copiati nel dataset.
- https://iris.cnr.it/handle/20.500.14243/220288
- **ISACCO** (CNR-ILC): corpus di produzioni orali e scritte di alunni di seconda, terza e quarta primaria; versione descritta con 125 testi scritti e 13.909 token. È liberamente scaricabile dalla pagina del progetto, ma il sito del corpus non è risultato raggiungibile durante questa integrazione. È un campione di produzioni narrative degli alunni, non un corpus di libri letti.
- https://www.cnr.it/it/banche-dati-istituti/banca-dati/1026/isacco-italian-school-age-children-corpus
- **VARLESS**: 626 nomi con frequenza nello scritto infantile tratta dal Lessico Elementare, frequenza nello scritto adulto, familiarità, immaginabilità, lunghezza e tempi di lettura. Il file XLS è pubblicato dal CNR ma il download non è risultato accessibile agli strumenti di integrazione; i suoi valori non sono stati inventati né simulati.
- https://www.istc.cnr.it/grouppage/varless
- **PVBVARLESS**: 527 parole con frequenza nello scritto di scuola elementare, scritto adulto, parlato, immaginabilità e categoria grammaticale. Il campione deriva dal Primo Vocabolario del Bambino (18–30 mesi), quindi è utile per parole iniziali ma non rappresenta da solo la lettura della primaria. Il file XLS non è stato importato.
- https://www.istc.cnr.it/grouppage/pvbvarless
- **CoLFIS**: lessico di frequenza dello scritto generale, con fonti da quotidiani, periodici e libri; utile come riferimento adulto, non specifico per lettori della primaria.
- https://www.istc.cnr.it/it/grouppage/colfis

### Limite metodologico
Il dataset attuale non va descritto come un vocabolario scientificamente graduato per frequenza nei libri scolastici. `core` indica solo l'appartenenza alla lista di parole comuni della fonte Napolux; `extended` indica provenienza dalla lista estesa. Per una graduatoria autentica basata sulla lettura primaria occorre ottenere i dati del Lessico Elementare / Lessico di Lettura o un'autorizzazione all'uso dei file CNR pertinenti.