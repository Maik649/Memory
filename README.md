# Memory Game

Ein webbasiertes Memory-Spiel mit mehreren Themes, einstellbarer Spielfeldgröße und zwei Spielern.

## Features

- 2-Spieler-Modus (Blue/Orange)
- Theme-Auswahl in den Settings
  - Code vibes theme
  - Gaming theme
  - DA Projects theme
- Spielfeldgrößen: 16, 24 oder 34 Karten
- Spielstand-Anzeige pro Spieler
- Gewinner-Overlay inklusive Animation am Spielende
- Einstellungen werden über `localStorage` gespeichert

## Tech Stack

- TypeScript
- Vite
- Sass (SCSS)

## Projektstruktur (Kurz)

- `index.html` Startseite
- `src/subpages/settings.html` Einstellungen
- `src/subpages/game.html` Spielseite
- `src/scripts/` Spiellogik, Settings-Logik, Theme-Logik
- `src/sass/` Styles und Theme-Dateien
- `public/` Bilder und Theme-Assets

## Voraussetzungen

- Node.js (empfohlen: aktuelle LTS-Version)
- npm

## Installation

```bash
npm install
```

## Entwicklung starten

```bash
npm run dev
```

Danach im Browser die lokale Vite-URL öffnen (z. B. http://localhost:5173).

## Build erstellen

```bash
npm run build
```

## Build lokal testen

```bash
npm run preview
```

## Spielablauf

1. Auf der Startseite auf **Play** klicken.
2. In den Settings Theme, Startspieler und Board-Größe wählen.
3. Spiel starten und abwechselnd Karten aufdecken.
4. Bei einem Match gibt es einen Punkt, sonst wechselt der Zug.
5. Nach allen gefundenen Paaren wird der Gewinner angezeigt.

## Lizenz

Dieses Projekt steht unter der in [LICENSE](LICENSE) definierten Lizenz.
