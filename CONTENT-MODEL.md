# TachiKids — Content Model v1

## Principi
- I contenuti sono file statici versionati nel repository e disponibili offline.
- I progressi e le liste personali restano sul dispositivo; nessun account o backend è richiesto.
- I metadati calcolati automaticamente sono distinti dai dati provenienti da fonti esterne.
- Le etichette di difficoltà sono strumenti organizzativi interni, non livelli clinici o scolastici certificati.

## Catalogo parole
File: `web/vocabulary/reading-vocabulary-it.json`

Campi esistenti:
- `word`: forma lessicale.
- `level`: fascia interna 1–10; ordinamento euristico basato su complessità ortografica approssimata, non su frequenza scolastica.
- `syllables`: stima automatica basata sui gruppi vocalici; non è una sillabazione certificata.
- `frequencyBand`: provenienza del record (`core` o `extended`), non una misura quantitativa di frequenza.

Metadati derivati a runtime dal Content Engine:
- `length`: numero di caratteri.
- `orthographicPatterns`: classificazione euristica di doppie, digrammi, gruppi consonantici e iniziale vocalica.
- `estimatedSyllables`: stima runtime del numero di nuclei vocalici.

## Filtri disponibili
- Numero stimato di sillabe.
- Difficoltà ortografica.
- Provenienza lessicale core/extended.
- Lunghezza massima.
- Lista personalizzata inserita dall'adulto.

## Altri tipi di contenuto — schema futuro
- `syllables`: sillabe e strutture CV/CVC/CCV.
- `nonwords`: non-parole generate secondo regole fonotattiche esplicite.
- `sentences`: frasi con livello, lunghezza e struttura sintattica.
- `passages`: brani con fonte, licenza, classe di riferimento e metriche leggibilità.
- `images`: asset con descrizione, licenza e parola target.

Questi insiemi non sono ancora implementati nel catalogo: non vanno presentati come contenuti già disponibili.

## Sessioni
Ogni sessione dovrebbe registrare modalità, data, parametri di esposizione, numero di stimoli, risposte valutate e accuratezza quando applicabile. Le sequenze flash automatiche non sono prove di accuratezza e devono restare separate dalle sessioni valutate.

## Privacy e portabilità
Attualmente il profilo è salvato in localStorage sul browser. Liste e storico non si sincronizzano tra dispositivi. Un futuro passaggio a IndexedDB potrà gestire dataset più ricchi e backup esportabili senza introdurre necessariamente un account.
