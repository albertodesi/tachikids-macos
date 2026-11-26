TACHIKIDS — INSTALLAZIONE

1. Estrai la cartella TachiKids-macOS dallo ZIP (se non è già stata estratta).
2. Fai clic destro su install-TachiKids.sh e scegli Apri con > Terminale,
   oppure apri Terminale nella cartella ed esegui:
       bash install-TachiKids.sh
3. Quando richiesto, inserisci la password del Mac per copiare l'app in
   /Applications e rimuovere l'attributo di quarantena.
4. TachiKids si aprirà automaticamente.

Lo script installa TachiKids.app in /Applications e applica:
    xattr -dr com.apple.quarantine "/Applications/TachiKids.app"

Nota: lo script rimuove e sostituisce un'eventuale versione precedente di
TachiKids.app presente in /Applications. Non modifica altre applicazioni.
