# TachiKids — Content Model v2

## Principi
- I contenuti sono file statici versionati nel repository e disponibili offline.
- I progressi e le liste personali restano sul dispositivo; nessun account o backend è richiesto.
- I metadati automatici sono distinti dai dati delle fonti.
- Le fasce di difficoltà sono strumenti organizzativi interni, non livelli scolastici o clinici certificati.

## Catalogo parole
File: `web/vocabulary/reading-vocabulary-it.json`

Dataset runtime verificato il 27 novembre 2026: 14.743 record, ID univoci da 1 a 14.743, senza duplicati sulla forma `word`.

Campi:
- `id`: identificativo progressivo.
- `word`: forma visualizzata.
- `lemma`: lemma associato.
- `pos`: categoria grammaticale normalizzata (NOM, VER, ADJ, ADV).
- `level`: fascia interna 1–10, derivata da una stima euristica di complessità ortografica.
- `difficulty_score`: punteggio interno usato per l'ordinamento.
- `frequency_band`: fascia statistica alta/media/bassa.
- `length`, `syllables`, `syllabified`: lunghezza e sillabazione automatica/importata; da considerare come metadati da verificare, non come certificazione linguistica.
- `zipf`, `zipf_subtlex`, `zipf_wordfreq`, `doc_count`: misure di frequenza provenienti dalle fonti indicate.
- `aoa`, `old20`, `has_aoa`: dati di età di acquisizione e vicinato ortografico quando disponibili.
- `nvdb`: marca FO/AU/AD quando presente.
- `sources`: provenienza dei dati.

## Interpretazione didattica
- FO, AU e AD sono marche d'uso del Nuovo Vocabolario di Base, non livelli di difficoltà.
- `frequency_band` è una misura di frequenza, non una misura di familiarità per uno specifico bambino.
- I livelli 1–10 non corrispondono a classi scolastiche, età, diagnosi o competenze di lettura.
- La sillabazione e la complessità ortografica devono essere considerate stime automatiche.
- Il filtro lessicale prudenziale riduce l'esposizione a termini inappropriati, ma non sostituisce la revisione umana dell'intero catalogo.

## Controlli strutturali
- JSON valido.
- ID univoci e progressivi.
- Forma, lemma, categoria grammaticale, livello e sillabazione presenti.
- Nessun duplicato esatto della forma visualizzata.
- Tutti i dieci livelli presenti.

## Limiti e prossimi passi
Il catalogo è adatto a essere usato come repertorio di stimoli configurabile con supervisione adulta, non come programma didattico validato o percorso graduato per classe. Per arrivare a liste didattiche affidabili servono revisione umana per adeguatezza, concretezza, familiarità e correttezza linguistica, più una verifica specialistica delle sillabazioni.
