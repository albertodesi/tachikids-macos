#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_APP="$SCRIPT_DIR/TachiKids.app"
DEST_APP="/Applications/TachiKids.app"

if [[ ! -d "$SOURCE_APP" ]]; then
  echo "Errore: TachiKids.app non si trova accanto a questo script."
  echo "Estrai tutto il contenuto dello ZIP e rilancia installa-TachiKids.sh."
  read -r -p "Premi Invio per chiudere..."
  exit 1
fi

echo "Installazione di TachiKids in /Applications..."
if [[ -d "$DEST_APP" ]]; then
  echo "Sostituisco la versione precedente..."
  sudo rm -rf "$DEST_APP"
fi

sudo ditto "$SOURCE_APP" "$DEST_APP"
sudo xattr -dr com.apple.quarantine "/Applications/TachiKids.app"

echo "Installazione completata."
open "$DEST_APP"
