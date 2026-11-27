# Vocabolario TachiKids — fonti, criteri e limiti

## Stato del dataset runtime (27 novembre 2026)

Il file `web/vocabulary/reading-vocabulary-it.json` contiene **14.743 forme lessicali** distribuite in dieci fasce interne. Ogni record espone forma, lemma, categoria grammaticale, punteggio di difficoltà euristico, fascia di frequenza, stima/sillabazione, misure di frequenza, eventuali dati AoA, marca NVdB e fonti.

La verifica automatica del 27 novembre 2026 ha rilevato:
- 14.743 record e 14.743 ID univoci;
- nessun duplicato esatto del campo `word`;
- tutti i dieci livelli presenti;
- campi strutturali obbligatori presenti;
- 4 categorie grammaticali: NOM, VER, ADJ, ADV;
- marcatura NVdB presente solo per una parte dei record; le altre forme provengono da repertori complementari.

Il dataset è un repertorio ampio di stimoli, non una lista pedagogica revisionata parola per parola.

## NVdB — Nuovo Vocabolario di Base

Riferimento:
- De Mauro, Tullio; Chiari, Isabella (con la collaborazione di Francesca Ferrucci), *Il Nuovo vocabolario di base della lingua italiana*, pubblicato da Internazionale il 23 dicembre 2016.
- Articolo e PDF originale: https://www.internazionale.it/opinione/tullio-de-mauro/2016/12/23/il-nuovo-vocabolario-di-base-della-lingua-italiana
- Repository di estrazione e materiali NVdB: https://github.com/pettarin/nvdb
- Dataset strutturato di riferimento: https://github.com/simo-mazzoli/vocabolario-di-base

Marche d'uso:
- **FO**: vocabolario fondamentale.
- **AU**: vocabolario di alto uso.
- **AD**: vocabolario di alta disponibilità.

FO/AU/AD descrivono l'uso lessicale generale, non la difficoltà di lettura né l'età di acquisizione. Non vanno interpretate come classi scolastiche.

## Repertori complementari e frequenza

Il dataset include misure da Subtlex-IT e Wordfreq e repertori complementari attribuiti nei campi `sources`. I valori Zipf e `doc_count` sono indicatori statistici di frequenza, non prove di familiarità individuale o adeguatezza pedagogica.

Tra le risorse considerate:
- https://github.com/napolux/paroleitaliane
- https://github.com/aleconf/vocabolario_italiano_di_base
- Lessico Elementare (Marconi, Ott, Pesenti, Ratti, Tavella, 1994): https://iris.cnr.it/handle/20.500.14243/220288
- ISACCO (CNR-ILC): https://www.cnr.it/it/banche-dati-istituti/banca-dati/1026/isacco-italian-school-age-children-corpus
- VARLESS / PVBVARLESS: https://www.istc.cnr.it/grouppage/varless
- CoLFIS: https://www.istc.cnr.it/it/grouppage/colfis

La presenza di una fonte o di una metrica nel record non implica che ogni parola sia stata verificata manualmente per bambini della primaria.

## Adeguatezza pedagogica: limiti

I dieci livelli sono fasce interne euristiche di complessità ortografica approssimata. Non sono una progressione scolastica validata. La distribuzione per livello non garantisce che tutte le parole siano concrete, familiari, motivanti o adatte a una determinata età.

La sillabazione automatica e il conteggio delle sillabe possono contenere errori, soprattutto in presenza di dittonghi, iati, gruppi consonantici e forme verbali flesse. I dati AoA sono disponibili solo per una parte delle voci e non rappresentano una valutazione didattica.

Il filtro prudenziale in `web/app.js` esclude una lista di termini e famiglie lessicali non adatte allo scenario infantile. È una misura di mitigazione, non una garanzia di sicurezza assoluta e non sostituisce la revisione umana dell'intero dataset.

## Licenze e redistribuzione

I dati NVdB e i dataset derivati richiedono attenzione alle condizioni di riutilizzo delle fonti originali. La licenza di un parser o di un repository di codice non concede automaticamente diritti sui dati del dizionario. La documentazione delle fonti è un'attribuzione tecnica, non un parere legale né una garanzia di redistribuzione commerciale. Prima di distribuire il dataset in un prodotto commerciale o a pagamento, verificare i diritti di riutilizzo e redistribuzione di ciascuna fonte.

## Miglioramenti raccomandati

1. Revisione umana delle parole per adeguatezza alla primaria, concretezza e familiarità.
2. Liste curate per obiettivo (parole funzionali, concrete, quotidiane, ecc.) invece di usare i decili come classi.
3. Controllo specialistico delle sillabazioni e delle categorie grammaticali ambigue.
4. Validazione incrociata con Lessico Elementare, VARLESS o altre risorse compatibili con i relativi termini di licenza.
5. Tenere sempre separati frequenza d'uso, difficoltà ortografica e adeguatezza pedagogica.
