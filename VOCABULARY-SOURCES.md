# Vocabolario TachiKids — fonti e criteri

## Contenuto
- 10.000 lemmi/forme selezionate per esercizi di lettura.
- 10 livelli progressivi, con 1.000 stimoli per livello.
- 1.160 voci del file `1000_parole_italiane_comuni.txt` sono marcate `core`.
- Le restanti voci provengono da `60000_parole_italiane.txt` e sono marcate `extended`.

## Fonte
Repository: https://github.com/napolux/paroleitaliane  
File: `paroleitaliane/1000_parole_italiane_comuni.txt` e `paroleitaliane/60000_parole_italiane.txt`  
Licenza dichiarata dal repository: MIT.  
Versione consultata: 26 novembre 2026.  
Commit sorgente per la lista 60.000: `749d665468746bca5fff3e3a650f04f010c31fcf`.

## Criteri e limiti
- Esclusi caratteri non alfabetici, parole sotto 3 o sopra 16 caratteri e alcune terminazioni tipiche di forme verbali flesse o derivazioni poco adatte.
- Le 10 fasce sono ordinate per complessità ortografica approssimata (lunghezza e gruppi vocalici), non per frequenza statistica.
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
