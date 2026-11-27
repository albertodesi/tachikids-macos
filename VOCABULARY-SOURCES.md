# Vocabolario TachiKids — fonti, uso e criteri

## Stato attuale dell'integrazione

**Il Nuovo Vocabolario di Base (NVdB) di Tullio De Mauro NON è attualmente integrato nel dataset dell'app.** È una fonte di riferimento individuata per una futura revisione e integrazione, ma non va confusa con la fonte effettivamente utilizzata oggi.

Il file caricato dall'app è `web/vocabulary/reading-vocabulary-it.json`. L'app lo legge localmente con `fetch("./vocabulary/reading-vocabulary-it.json")` e usa le proprietà `word`, `level` e `frequencyBand` per costruire il repertorio degli stimoli e applicare i filtri.

## Fonte effettivamente utilizzata

Repository: https://github.com/napolux/paroleitaliane  
File sorgente:
- `1000_parole_italiane_comuni.txt`
- `60000_parole_italiane.txt`

Licenza dichiarata dal repository: MIT.  
Versione consultata: 26 novembre 2026.  
Commit sorgente per la lista 60.000: `749d665468746bca5fff3e3a650f04f010c31fcf`.

Nel dataset verificato il 27 novembre 2026 risultano:
- 9.897 voci complessive;
- 1.123 voci marcate `core`, provenienti dalla lista delle 1.000 parole italiane comuni;
- 8.774 voci marcate `extended`, provenienti dalla lista estesa di 60.000 parole.

I conteggi sono relativi al JSON attualmente versionato nel repository e possono differire dal numero di righe dei file sorgente a causa dei filtri e della normalizzazione applicati durante la preparazione.

## Come l'app usa oggi queste parole

1. **Caricamento:** `web/app.js` carica `web/vocabulary/reading-vocabulary-it.json`. Il dataset è incluso nel sito e può essere servito anche dalla cache/offline.
2. **Filtri:** il motore seleziona le voci in base al livello scelto e ai filtri impostati dall'adulto: numero di sillabe, difficoltà ortografica, tipo di lessico (`core` / `extended`) e lunghezza massima.
3. **Livelli:** `level` identifica una fascia di complessità ortografica approssimata. Non rappresenta una fascia scolastica certificata né una graduatoria statistica di frequenza.
4. **Tipo di lessico:** `core` indica soltanto la provenienza dalla lista Napolux delle parole comuni; `extended` indica la provenienza dalla lista estesa. Queste etichette non equivalgono alle marche d'uso FO, AU o AD del NVdB.
5. **Difficoltà ortografica:** `web/content-engine.js` individua in modo euristico doppie, digrammi, gruppi consonantici e parole con iniziale vocalica. Non è una classificazione linguistica certificata.
6. **Sillabe:** il conteggio è stimato tramite gruppi vocalici; non è una sillabazione linguistica certificata.
7. **Personalizzazione:** se viene attivata una lista personale, l'app usa le parole inserite dall'adulto al posto del repertorio predefinito, dopo un controllo di formato e una lista prudenziale di esclusione.
8. **Sequenza:** le parole vengono mescolate e non ripetute finché non si esaurisce la selezione disponibile per il livello/filtro corrente.

## Nuovo Vocabolario di Base (NVdB) — fonte di riferimento da integrare

Il **Nuovo Vocabolario di Base della lingua italiana** di Tullio De Mauro distingue le parole secondo marche d'uso, tra cui:
- **FO — fondamentale:** parole ad altissima diffusione e centralità nell'italiano;
- **AU — alto uso:** parole molto diffuse;
- **AD — alta disponibilità:** parole note e disponibili nella competenza dei parlanti, anche se meno frequenti nei testi.

Per TachiKids è una fonte molto più trasparente e adatta a costruire un nucleo lessicale graduato rispetto a una lista generica non documentata. In particolare, le marche FO/AU/AD permetterebbero di non confondere frequenza nei testi e disponibilità lessicale.

Riferimenti:
- Articolo e materiali sul NVdB: https://github.com/pettarin/nvdb/blob/master/article.md
- Parser del NVdB e output JSON con qualifiche grammaticali e marche d'uso: https://github.com/aleconf/vocabolario_italiano_di_base
- Dataset CSV del vocabolario di base: https://github.com/simo-mazzoli/vocabolario-di-base

**Stato:** documentato come riferimento candidato; non ancora importato, normalizzato o usato dal codice runtime di TachiKids. Prima dell'importazione vanno verificati versione, completezza, licenza e condizioni di redistribuzione dei dati. Vanno mantenute le marche FO/AU/AD e, quando disponibili, le qualifiche grammaticali.

## Altri repertori lessicali candidati

Queste risorse possono servire per ampliare o confrontare il lessico, ma non risultano attualmente integrate nel JSON di TachiKids:

- **Parole italiane — Napolux:** https://github.com/napolux/paroleitaliane — è la fonte effettivamente utilizzata oggi, nei due file descritti sopra.
- **Italian words / parole italiane:** https://github.com/antomanc/italian-words-parole-italiane — lista generica candidata per confronto e ampliamento; non integrata.
- **Italian vocabulary builder:** https://github.com/apostaremczak/italian-vocabulary-builder — progetto che aggrega definizioni, sinonimi, coniugazioni ed esempi da fonti esterne; non è il dataset di parole usato dall'app e non è integrato nel runtime.

## Fonti di frequenza e lessico infantile: riferimenti per una futura validazione

- **CoLFIS** (CNR / Scuola Normale Superiore): corpus di italiano scritto con quotidiani, periodici e libri, lemmatizzato e annotato per parte del discorso. È utile come riferimento di frequenza dello scritto generale, ma non specifico per bambini. Non abbiamo incorporato i suoi dati perché non è stata verificata una licenza esplicita che autorizzi la redistribuzione dentro l'app.
  - https://www.istc.cnr.it/it/grouppage/colfis
  - https://ricerca.sns.it/handle/11384/5677
- **Lessico Elementare** (Marconi, Ott, Pesenti, Ratti, Tavella, 1994): riferimento particolarmente pertinente perché basato su testi letti e scritti da bambini della primaria. La letteratura descrive un Lessico Elementare di base di 6.095 parole e un Lessico di Lettura di 5.511 parole. I dati lessicali non sono stati importati.
  - https://iris.cnr.it/handle/20.500.14243/220288
- **ISACCO** (CNR-ILC): corpus di produzioni orali e scritte di alunni di seconda, terza e quarta primaria. È un campione di produzioni narrative degli alunni, non un corpus di libri letti. Non importato.
  - https://www.cnr.it/it/banche-dati-istituti/banca-dati/1026/isacco-italian-school-age-children-corpus
- **VARLESS:** 626 nomi con frequenza nello scritto infantile tratta dal Lessico Elementare, frequenza nello scritto adulto, familiarità, immaginabilità, lunghezza e tempi di lettura. I valori non sono presenti nel dataset TachiKids.
  - https://www.istc.cnr.it/grouppage/varless
- **PVBVARLESS:** 527 parole con frequenza nello scritto di scuola elementare, scritto adulto, parlato, immaginabilità e categoria grammaticale. Il campione deriva dal Primo Vocabolario del Bambino (18–30 mesi), quindi non rappresenta da solo la lettura della primaria. Non importato.
  - https://www.istc.cnr.it/grouppage/pvbvarless

## Criteri di preparazione del dataset attuale

- Esclusi caratteri non alfabetici, parole sotto 3 o sopra 16 caratteri, termini presenti nella lista di parole volgari della fonte e alcune terminazioni tipiche di forme verbali flesse o derivazioni poco adatte.
- Il nucleo `core` viene collocato prima del lessico esteso; le parole sono ordinate per una stima semplice della complessità (lunghezza e gruppi vocalici).
- Le 10 fasce sono ordinate per complessità ortografica approssimata, non per frequenza statistica, età di acquisizione o livello scolastico.
- Il repository sorgente segnala che alcune liste hanno provenienza ignota: il repertorio esteso va considerato una base lessicale da revisionare, non un dizionario normativo.

## Prossimo passo raccomandato

Integrare il NVdB come fonte strutturata, preservando le marche FO/AU/AD, le informazioni grammaticali e la provenienza. Usare FO come primo nucleo di parole ad alta priorità, valutare AU e AD per ampliare il repertorio e tenere il lessico generico come fonte secondaria, chiaramente identificata. La progressione didattica dovrà poi combinare la marca d'uso con criteri ortografici e una revisione pedagogica: non bisogna trasformare FO/AU/AD direttamente in livelli di difficoltà di lettura.

Prima di redistribuire dataset derivati va verificata la licenza della specifica fonte e della versione importata. I nomi delle fonti non devono essere presentati come garanzia automatica di correttezza pedagogica: ogni lista va controllata per adeguatezza all'età, ambiguità, significato e forme grammaticali.
