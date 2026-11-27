# Vocabolario TachiKids — fonti, integrazione e criteri

## Stato dell'integrazione

**Il Nuovo Vocabolario di Base (NVdB) di Tullio De Mauro è ora integrato nel dataset runtime di TachiKids.**

File utilizzato dall'app: `web/vocabulary/reading-vocabulary-it.json`  
Caricamento: `web/app.js`, funzione `loadWords()`.

Il dataset è una fusione di:
- **NVdB De Mauro/Chiari (2016): 7.173 forme lessicali uniche** ricavate dal dataset strutturato CSV;
- **Napolux/paroleitaliane: 8.126 forme aggiuntive** non già presenti nel NVdB;
- **Totale: 15.299 forme lessicali uniche** nel catalogo.

Le 1.771 parole presenti in entrambe le fonti sono mantenute una sola volta e contrassegnate con `alsoInNapolux: true`, dando priorità alla classificazione NVdB.

## NVdB — Nuovo Vocabolario di Base

Riferimento originale:
- De Mauro, Tullio; Chiari, Isabella (con la collaborazione di Francesca Ferrucci), *Il Nuovo vocabolario di base della lingua italiana*, pubblicato da Internazionale il 23 dicembre 2016.
- Articolo e PDF originale: https://www.internazionale.it/opinione/tullio-de-mauro/2016/12/23/il-nuovo-vocabolario-di-base-della-lingua-italiana
- Repository di estrazione e materiali NVdB: https://github.com/pettarin/nvdb
- Dataset strutturato usato per l'importazione: https://github.com/simo-mazzoli/vocabolario-di-base

Il NVdB nasce dall'analisi di un campione di testi di circa 18,8 milioni di occorrenze, suddivisi in sei categorie, con lemmatizzazione e una componente di alta disponibilità verificata con parlanti. Non è una semplice lista generica di parole.

### Marche d'uso preservate

| Marca | Campo dati | Significato |
|---|---|---|
| **FO** | `fondamentale` | Vocabolario fondamentale |
| **AU** | `alto_uso` | Vocabolario di alto uso |
| **AD** | `alta_disponibilita` | Vocabolario di alta disponibilità |

Nel dataset runtime, dopo l'accorpamento delle forme omografe:
- FO: 1.924 forme uniche;
- AU: 3.081 forme uniche;
- AD: 2.168 forme uniche;
- totale: 7.173 forme uniche.

I numeri del CSV sorgente sono 7.237 record (1.969 FO, 3.097 AU, 2.171 AD). La differenza deriva dall'accorpamento delle voci ripetute/omografe in un'unica forma visualizzabile: le informazioni delle diverse accezioni sono conservate in `nvdbSenses`. Le voci composte con trattino sono mantenute; le voci composte da più parole non sono utilizzate come singolo stimolo.

### Metadati disponibili per parola

Per le voci NVdB il dataset conserva:
- `word`: forma lessicale visualizzata;
- `frequencyBand`: marca d'uso principale;
- `nvdbCategories`: tutte le marche presenti per la forma;
- `nvdbMark`: sigla FO, AU o AD;
- `grammar`: qualifica grammaticale nella notazione originale;
- `pos`: parte del discorso normalizzata;
- `gender`: genere/numero/invariabilità, quando disponibile;
- `verbInfo`: informazioni verbali originali;
- `nvdbSenses`: dettagli delle voci omografe ripetute, incluse marca e qualifica grammaticale;
- `source`: provenienza del record.

Le informazioni grammaticali non vengono usate per generare definizioni o per alterare la parola mostrata: sono conservate per filtri e sviluppi didattici futuri.

## Come viene usato nell'app

1. **Caricamento:** `web/app.js` carica il JSON locale `./vocabulary/reading-vocabulary-it.json`. Il file è incluso nel precaching del service worker, quindi è disponibile anche offline dopo il primo caricamento riuscito.
2. **Selezione livello:** ogni parola ha un campo `level` da 1 a 10. I livelli sono decili di una stima automatica della complessità ortografica, calcolata su lunghezza, gruppi vocalici, doppie, digrammi e gruppi consonantici. Non sono livelli scolastici né marche De Mauro.
3. **Filtro lessicale:** il selettore nell'interfaccia permette di scegliere tutte le parole, FO, AU, AD, oppure le due fasce complementari Napolux.
4. **Filtro sillabe:** il numero di sillabe è stimato automaticamente contando i gruppi vocalici. È un'approssimazione, non una sillabazione linguistica certificata.
5. **Filtro ortografico:** il motore riconosce euristicamente doppie, digrammi, gruppi consonantici e iniziale vocalica.
6. **Parole complementari:** Napolux resta come repertorio aggiuntivo, chiaramente distinto dal NVdB tramite `source: "napolux"` e le fasce `napolux_core` / `napolux_extended`.
7. **Sicurezza e adeguatezza:** prima di entrare nella coda degli stimoli, le parole passano dal filtro prudenziale `isChildSafeWord()`. Questo filtro è una protezione lessicale di base, non una revisione pedagogica completa.
8. **Ripetizioni:** le parole vengono mescolate e non ripetute nella sessione finché non si esaurisce la selezione disponibile.

**Importante:** FO/AU/AD indicano uso e disponibilità lessicale, non difficoltà di lettura. Una parola FO può essere ortograficamente complessa e una parola AD può essere molto semplice. TachiKids mantiene separate queste due dimensioni.

## Napolux — repertorio complementare

Repository: https://github.com/napolux/paroleitaliane  
File sorgente storici:
- `1000_parole_italiane_comuni.txt`
- `60000_parole_italiane.txt`

Licenza dichiarata dal repository: MIT. Versione consultata: 26 novembre 2026. Commit sorgente per la lista 60.000: `749d665468746bca5fff3e3a650f04f010c31fcf`.

Nel dataset attuale, le voci Napolux non sovrapposte al NVdB sono:
- `napolux_core`: provenienza dalla lista delle parole comuni;
- `napolux_extended`: provenienza dalla lista estesa.

Queste etichette non sono equivalenti alle marche FO/AU/AD e non rappresentano una graduatoria scientifica di frequenza.

## Altri repository e risorse valutati

Questi progetti sono riferimenti per il dataset o per futuri arricchimenti, ma non sono fonti runtime aggiuntive oltre a quelle dichiarate sopra:

- https://github.com/aleconf/vocabolario_italiano_di_base — parser del PDF NVdB e JSON con qualifiche grammaticali e marche d'uso; il codice del parser ha licenza MIT, che non va automaticamente interpretata come licenza dei dati estratti.
- https://github.com/antomanc/italian-words-parole-italiane — repertorio generico di parole italiane, non integrato.
- https://github.com/apostaremczak/italian-vocabulary-builder — progetto per aggregare definizioni, sinonimi, coniugazioni ed esempi da fonti esterne; non è il dataset lessicale runtime di TachiKids.
- **Lessico Elementare** (Marconi, Ott, Pesenti, Ratti, Tavella, 1994): riferimento utile per validare l'adeguatezza alla primaria; i dati non sono importati.
  - https://iris.cnr.it/handle/20.500.14243/220288
- **ISACCO** (CNR-ILC): corpus di produzioni orali e scritte di alunni della primaria; non importato.
  - https://www.cnr.it/it/banche-dati-istituti/banca-dati/1026/isacco-italian-school-age-children-corpus
- **VARLESS** e **PVBVARLESS**: risorse CNR con frequenze, familiarità e altre misure; non importate.
  - https://www.istc.cnr.it/grouppage/varless
  - https://www.istc.cnr.it/grouppage/pvbvarless
- **CoLFIS**: corpus di frequenza dello scritto generale, utile come confronto ma non specifico per bambini; non importato.
  - https://www.istc.cnr.it/it/grouppage/colfis

## Licenze, attribuzione e limiti

Il dataset strutturato CSV usato per l'importazione è pubblicato da `simo-mazzoli/vocabolario-di-base`; il relativo README descrive origine, struttura e conteggi, ma il repository non espone una licenza separata e inequivocabile per il contenuto dei dati. Il repository `pettarin/nvdb` dichiara i file processati come public domain, ma aggiunge anche di rispettare i termini di servizio del NVdB e di usare i materiali per ricerca e/o scopi personali. La licenza MIT del parser di `aleconf` riguarda il codice del parser e non concede automaticamente diritti sui dati del dizionario.

Per questo motivo TachiKids attribuisce esplicitamente la fonte e documenta la provenienza, ma questa nota non costituisce una valutazione legale né una garanzia di licenza per redistribuzione commerciale. Prima di distribuire il dataset in un prodotto commerciale o in un servizio a pagamento è opportuno ottenere conferma sui diritti di riutilizzo e redistribuzione dei dati NVdB.

## Prossimi miglioramenti consigliati

- Revisione umana delle parole effettivamente adatte a ciascuna fascia d'età.
- Lista di parole concrete e familiari per i primi livelli, senza confondere frequenza con semplicità ortografica.
- Filtri per categoria grammaticale sfruttando `pos` e `grammar`.
- Sillabazione italiana più accurata, verificata su dizionario, al posto del solo conteggio dei gruppi vocalici.
- Validazione con Lessico Elementare / VARLESS, se i dati e le condizioni di riutilizzo lo consentono.
