export {};

/**
 * @typedef {"Blue" | "Orange"} Player
 */
type Player = "Blue" | "Orange";

/**
 * @interface CardModel
 * @property {number} id Laufende Karten-ID.
 * @property {number} pairId Paar-ID zur Match-Pruefung.
 * @property {string} value Bildpfad der Vorderseite.
 * @property {"hidden" | "revealed" | "matched"} state Aktueller Kartenstatus.
 */
interface CardModel {
    id: number;
    pairId: number;
    value: string;
    state: "hidden" | "revealed" | "matched";
}

const gameRoot = document.querySelector(".game-page") as HTMLElement | null;
const boardElement = document.querySelector("[data-game-grid]") as HTMLElement | null;
const statusElement = document.querySelector("[data-game-status]") as HTMLElement | null;
const currentPlayerIconElement = document.querySelector("[data-current-player-icon]") as HTMLImageElement | null;
const currentPlayerNameElement = document.querySelector("[data-current-player-name]") as HTMLElement | null;
const blueScoreElement = document.querySelector('[data-score="Blue"]') as HTMLElement | null;
const orangeScoreElement = document.querySelector('[data-score="Orange"]') as HTMLElement | null;
const blueScoreIconElement = document.querySelector('[data-score-icon="Blue"]') as HTMLImageElement | null;
const orangeScoreIconElement = document.querySelector('[data-score-icon="Orange"]') as HTMLImageElement | null;
const gameoverIntroOverlay = document.querySelector("[data-gameover-intro]") as HTMLElement | null;
const gameoverBlueScoreIconElement = document.querySelector('[data-gameover-score-icon="Blue"]') as HTMLImageElement | null;
const gameoverOrangeScoreIconElement = document.querySelector('[data-gameover-score-icon="Orange"]') as HTMLImageElement | null;
const loserIconElement = document.querySelector("[data-loser-icon]") as HTMLImageElement | null;
const loserNameElement = document.querySelector("[data-loser-name]") as HTMLElement | null;
const gameoverBlueScore = document.querySelector('[data-gameover-score="Blue"]') as HTMLElement | null;
const gameoverOrangeScore = document.querySelector('[data-gameover-score="Orange"]') as HTMLElement | null;
const gameOverOverlay = document.querySelector("[data-game-over]") as HTMLElement | null;
const winnerIconElement = document.querySelector("[data-winner-icon]") as HTMLImageElement | null;
const winnerNameElement = document.querySelector("[data-winner-name]") as HTMLElement | null;
const winnerPawnElement = document.querySelector("[data-winner-pawn]") as HTMLImageElement | null;
const winnerDrawIconElement = document.querySelector("[data-winner-draw-icon]") as HTMLImageElement | null;
const winnerSubtitleElement = document.querySelector("[data-winner-subtitle]") as HTMLElement | null;
const confettiContainer = document.querySelector("[data-confetti]") as HTMLElement | null;
const GAME_OVER_INTRO_MS = 2000;
const GAME_OVER_DISPLAY_MS = 4000;

const defaultPlayerIconMap: Record<Player, string> = {
    Blue: "/img/label_blue.svg",
    Orange: "/img/label2.svg",
};
const playerIconMapByTheme: Record<string, Record<Player, string>> = {
  "Code vibes theme": defaultPlayerIconMap,
  "Gaming theme": {
    Blue: "/img/player_blue.png",
        Orange: "/img/player-orange.png",
  },
  "DA Projects theme": {
    Blue: "/img/player_blue.png",
        Orange: "/img/player-orange.png",
  },
};

const winnerPawnMap: Record<Player, string> = {
    Blue: "/img/player_blue.png",
    Orange: "/img/player-orange.png",
};

const winnerImageMapByTheme: Record<string, Record<Player, string>> = {
    "Code vibes theme": winnerPawnMap,
    "Gaming theme": {
        Blue: "/img/pokal.png",
        Orange: "/img/pokal.png",
    },
    "DA Projects theme": winnerPawnMap,
};

const cardBackByTheme: Record<string, string> = {
    "Code vibes theme": "/themes/code-vibes-card-1.svg",
    "Gaming theme": "/themes/gaming-card-1.png",
    "DA Projects theme": "/themes/da-projects-card-1.png",
};

const defaultTheme = "Code vibes theme";
const defaultPlayer: Player = "Blue";
const defaultBoardSize = 16;
const cardFrontByTheme: Record<string, string[]> = {
    "Code vibes theme": [
        "/img/theme-img/code-vibes-front-1.png",
        "/img/theme-img/code-vibes-front-2.png",
        "/img/theme-img/code-vibes-front-3.png",
        "/img/theme-img/code-vibes-front-4.png",
        "/img/theme-img/code-vibes-front-5.png",
        "/img/theme-img/code-vibes-front-6.png",
        "/img/theme-img/code-vibes-front-7.png",
        "/img/theme-img/code-vibes-front-8.png",
        "/img/theme-img/code-vibes-front-9.png",
        "/img/theme-img/code-vibes-front-10.png",
        "/img/theme-img/code-vibes-front-11.png",
        "/img/theme-img/code-vibes-front-12.png",
        "/img/theme-img/code-vibes-front-13.png",
        "/img/theme-img/code-vibes-front-14.png",
        "/img/theme-img/code-vibes-front-15.png",
    ],
    "Gaming theme": [
        "/img/theme-img/gaming-front-1.png",
        "/img/theme-img/gaming-front-2.png",
        "/img/theme-img/gaming-front-3.png",
        "/img/theme-img/gaming-front-4.png",
        "/img/theme-img/gaming-front-5.png",
        "/img/theme-img/gaming-front-6.png",
        "/img/theme-img/gaming-front-7.png",
        "/img/theme-img/gaming-front-8.png",
        "/img/theme-img/gaming-front-9.png",
        "/img/theme-img/gaming-front-10.png",
        "/img/theme-img/gaming-front-11.png",
        "/img/theme-img/gaming-front-12.png",
        "/img/theme-img/gaming-front-13.png",
        "/img/theme-img/gaming-front-14.png",
        "/img/theme-img/gaming-front-15.png",
        "/img/theme-img/gaming-front-16.png",
        "/img/theme-img/gaming-front-17.png",
    ],
    "DA Projects theme": [
        "/img/theme-img/da-projects-front-1.png",
        "/img/theme-img/da-projects-front-2.png",
        "/img/theme-img/da-projects-front-3.png",
        "/img/theme-img/da-projects-front-4.png",
        "/img/theme-img/da-projects-front-5.png",
        "/img/theme-img/da-projects-front-6.png",
        "/img/theme-img/da-projects-front-7.png",
        "/img/theme-img/da-projects-front-8.png",
        "/img/theme-img/da-projects-front-9.png",
        "/img/theme-img/da-projects-front-10.png",
        "/img/theme-img/da-projects-front-11.png",
        "/img/theme-img/da-projects-front-12.png",
        "/img/theme-img/da-projects-front-13.png",
        "/img/theme-img/da-projects-front-14.png",
        "/img/theme-img/da-projects-front-15.png",
        "/img/theme-img/da-projects-front-16.png",
        "/img/theme-img/da-projects-front-17.png",
    ],
};

let cards: CardModel[] = [];
let currentPlayer: Player = defaultPlayer;
let activeCardBackImage = cardBackByTheme[defaultTheme];
let activeTheme = defaultTheme;
let lockBoard = false;
let firstCardId: number | null = null;
let secondCardId: number | null = null;
let matchedPairs = 0;
const scores: Record<Player, number> = { Blue: 0, Orange: 0 };

/**
 * Liest und validiert die Board-Groesse aus dem Storage-Wert.
 * @param {string | null} value Gespeicherter Wert.
 * @returns {number} Gueltige Board-Groesse.
 */
function parseBoardSize(value: string | null): number {
    const parsed = Number(value);
    return [16, 24, 34].includes(parsed) ? parsed : defaultBoardSize;
}

/**
 * Wendet das gespeicherte Theme an und setzt die Kartenrueckseite.
 * @returns {void}
 */
function applyStoredTheme() {
    const storedTheme = localStorage.getItem("theme") || defaultTheme;
    activeTheme = storedTheme;
    document.documentElement.setAttribute("data-theme", storedTheme);
    activeCardBackImage = cardBackByTheme[storedTheme] || cardBackByTheme[defaultTheme];
    document.documentElement.style.setProperty("--memory-card-back-image", `url('${activeCardBackImage}')`);
}

/**
 * Ermittelt den Startspieler aus dem Storage.
 * @returns {Player} Startspieler.
 */
function getInitialPlayer(): Player {
    const storedPlayer = localStorage.getItem("player");
    return storedPlayer === "Orange" ? "Orange" : "Blue";
}

/**
 * Liefert das Icon-Mapping fuer ein bestimmtes Theme.
 * @param {string} theme Theme-Name.
 * @returns {Record<Player, string>} Mapping von Spieler zu Icon-Pfad.
 */
function getPlayerIconsForTheme(theme: string): Record<Player, string> {
    return playerIconMapByTheme[theme] ?? defaultPlayerIconMap;
}

/**
 * Liefert den Icon-Pfad fuer einen Spieler im aktiven Theme.
 * @param {Player} player Spieler.
 * @returns {string} Icon-Pfad.
 */
function getPlayerIcon(player: Player): string {
    const icons = getPlayerIconsForTheme(activeTheme);
    return icons[player] ?? defaultPlayerIconMap[player];
}

/**
 * Liefert das Gewinnerbild fuer Theme und Spieler.
 * @param {Player} player Gewinner-Spieler.
 * @returns {string} Bildpfad fuer das Gewinner-Overlay.
 */
function getWinnerImage(player: Player): string {
    const images = winnerImageMapByTheme[activeTheme] ?? winnerPawnMap;
    return images[player] ?? winnerPawnMap[player];
}

/**
 * Setzt Score-Icons fuer Blue und Orange im Spielfeld-Header.
 * @param {Record<Player, string>} icons Icon-Mapping.
 * @returns {void}
 */
function applyScoreIcons(icons: Record<Player, string>) {
    if (blueScoreIconElement) {
        blueScoreIconElement.src = icons.Blue;
        blueScoreIconElement.alt = "Blue marker";
    }
    if (orangeScoreIconElement) {
        orangeScoreIconElement.src = icons.Orange;
        orangeScoreIconElement.alt = "Orange marker";
    }
}

/**
 * Setzt Score-Icons in der Game-Over-Anzeige.
 * @param {Record<Player, string>} icons Icon-Mapping.
 * @returns {void}
 */
function applyGameoverIcons(icons: Record<Player, string>) {
    if (gameoverBlueScoreIconElement) {
        gameoverBlueScoreIconElement.src = icons.Blue;
        gameoverBlueScoreIconElement.alt = "Blue";
    }
    if (gameoverOrangeScoreIconElement) {
        gameoverOrangeScoreIconElement.src = icons.Orange;
        gameoverOrangeScoreIconElement.alt = "Orange";
    }
}

/**
 * Wendet theme-abhaengige Icons in Score- und Game-Over-UI an.
 * @returns {void}
 */
function applyThemePlayerIcons() {
    const playerIcons = getPlayerIconsForTheme(activeTheme);
    applyScoreIcons(playerIcons);
    applyGameoverIcons(playerIcons);
}

/**
 * Aktualisiert Spieler- und Score-Anzeige im Header.
 * @returns {void}
 */
function updateHeaderState() {
    if (currentPlayerIconElement) {
        currentPlayerIconElement.src = getPlayerIcon(currentPlayer);
        currentPlayerIconElement.alt = `${currentPlayer} player icon`;
    }
    if (currentPlayerNameElement) {
        currentPlayerNameElement.textContent = currentPlayer;
    }
    if (blueScoreElement) {
        blueScoreElement.textContent = String(scores.Blue);
    }
    if (orangeScoreElement) {
        orangeScoreElement.textContent = String(scores.Orange);
    }
}

/**
 * Aktualisiert den Status-Text im Spiel.
 * @param {string} text Neuer Status-Text.
 * @returns {void}
 */
function updateStatus(text: string) {
    if (statusElement) {
        statusElement.textContent = text;
    }
}

/**
 * Erzeugt eine neue gemischte Kopie eines Arrays.
 * @template T
 * @param {T[]} items Ausgangsarray.
 * @returns {T[]} Gemischte Kopie.
 */
function shuffle<T>(items: T[]): T[] {
    const copied = [...items];
    for (let index = copied.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [copied[index], copied[randomIndex]] = [copied[randomIndex], copied[index]];
    }
    return copied;
}

/**
 * Baut das Kartendeck fuer Board-Groesse und Theme.
 * @param {number} boardSize Anzahl Karten auf dem Spielfeld.
 * @returns {CardModel[]} Gemischtes Kartenmodell.
 */
function createCards(boardSize: number): CardModel[] {
    const pairCount = boardSize / 2;
    const cardValues = cardFrontByTheme[activeTheme] || cardFrontByTheme[defaultTheme];
    const values = cardValues.slice(0, pairCount);

    return shuffle(
        values.flatMap((value, pairId) => [{ pairId, value }, { pairId, value },])
    ).map((card, id) => ({id,pairId: card.pairId,value: card.value,state: "hidden",}));
}

/**
 * Bestimmt die Anzahl der Grid-Spalten fuer eine Board-Groesse.
 * @param {number} boardSize Anzahl Karten auf dem Spielfeld.
 * @returns {number} Anzahl Spalten.
 */
function getGridColumns(boardSize: number): number {
    if (boardSize === 34) {
        return 6;
    }
    return Math.sqrt(boardSize);
}

/**
 * Erstellt die Rueckseite einer Karte als Span-Element.
 * @returns {HTMLSpanElement} Span mit Rueckseiten-Bild.
 */
function createCardBackFace(): HTMLSpanElement {
    const cardBack = document.createElement("span");
    cardBack.className = "memory-card__face memory-card__face--back";
    const cardBackImage = document.createElement("img");
    cardBackImage.className = "memory-card__image memory-card__image--back";
    cardBackImage.src = activeCardBackImage;
    cardBackImage.alt = "Verdeckte Karte";
    cardBack.appendChild(cardBackImage);
    return cardBack;
}

/**
 * Erstellt die Vorderseite einer Karte als Span-Element.
 * @param {string} src Bildpfad der Vorderseite.
 * @returns {HTMLSpanElement} Span mit Vorderseiten-Bild.
 */
function createCardFrontFace(src: string): HTMLSpanElement {
    const cardFront = document.createElement("span");
    cardFront.className = "memory-card__face memory-card__face--front";
    const cardFrontImage = document.createElement("img");
    cardFrontImage.className = "memory-card__image";
    cardFrontImage.src = src;
    cardFrontImage.alt = "Memory card image";
    cardFrontImage.addEventListener("error", () => { cardFrontImage.style.display = "none"; });
    cardFront.appendChild(cardFrontImage);
    return cardFront;
}

/**
 * Erstellt das innere Wrapper-Element einer Karte.
 * @param {CardModel} card Kartenmodell.
 * @returns {HTMLSpanElement} Inner-Span mit Vorder- und Rueckseite.
 */
function createCardInner(card: CardModel): HTMLSpanElement {
    const cardInner = document.createElement("span");
    cardInner.className = "memory-card__inner";
    cardInner.appendChild(createCardBackFace());
    cardInner.appendChild(createCardFrontFace(card.value));
    return cardInner;
}

/**
 * Erstellt den Button fuer eine einzelne Karte.
 * @param {CardModel} card Kartenmodell.
 * @returns {HTMLButtonElement} Fertig konfigurierter Karten-Button.
 */
function createCardButton(card: CardModel): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-card";
    button.dataset.cardId = String(card.id);
    button.dataset.state = card.state;
    button.setAttribute("aria-label", "Memory card");
    button.appendChild(createCardInner(card));
    return button;
}

/**
 * Rendert alle Karten in den Board-Container.
 * @param {number} boardSize Anzahl Karten auf dem Spielfeld.
 * @returns {void}
 */
function renderBoard(boardSize: number) {
    if (!boardElement) {
        return;
    }
    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${getGridColumns(boardSize)}, minmax(0, 1fr))`;
    cards.forEach((card) => {
        boardElement!.appendChild(createCardButton(card));
    });
}

/**
 * Synchronisiert den Zustand einer Karte mit dem DOM-Element.
 * @param {CardModel} card Kartenmodell.
 * @returns {void}
 */
function syncCardElement(card: CardModel) {
    if (!boardElement) {return;}

    const cardElement = boardElement.querySelector(`[data-card-id="${card.id}"]`) as HTMLButtonElement | null;
    if (!cardElement) {return;}

    cardElement.dataset.state = card.state;
    cardElement.disabled = card.state === "matched";
}

/**
 * Wechselt den aktiven Spieler und aktualisiert den Header.
 * @returns {void}
 */
function switchPlayer() {
    currentPlayer = currentPlayer === "Blue" ? "Orange" : "Blue";
    updateHeaderState();
}

/**
 * Sucht eine Karte anhand ihrer ID.
 * @param {number} id Karten-ID.
 * @returns {CardModel | undefined} Gefundene Karte oder undefined.
 */
function getCardById(id: number): CardModel | undefined {
    return cards.find((card) => card.id === id);
}

/**
 * Verarbeitet ein gematchtes Kartenpaar und aktualisiert den Spielzustand.
 * @param {CardModel} firstCard Erste Karte.
 * @param {CardModel} secondCard Zweite Karte.
 * @returns {void}
 */
function handleMatchedPair(firstCard: CardModel, secondCard: CardModel) {
    firstCard.state = "matched";
    secondCard.state = "matched";
    scores[currentPlayer] += 1;
    matchedPairs += 1;
    syncCardElement(firstCard);
    syncCardElement(secondCard);
    updateHeaderState();
    updateStatus(`${currentPlayer} hat ein Paar gefunden.`);
    lockBoard = false;
    firstCardId = null;
    secondCardId = null;
    if (matchedPairs === cards.length / 2) { showGameOver(); }
}

/**
 * Behandelt ein nicht gematchtes Kartenpaar und wechselt den Spieler.
 * @param {CardModel} firstCard Erste Karte.
 * @param {CardModel} secondCard Zweite Karte.
 * @returns {void}
 */
function handleMismatch(firstCard: CardModel, secondCard: CardModel) {
    updateStatus("Kein Match. Spieler wechselt.");
    window.setTimeout(() => {
        firstCard.state = "hidden";
        secondCard.state = "hidden";
        syncCardElement(firstCard);
        syncCardElement(secondCard);
        firstCardId = null;
        secondCardId = null;
        lockBoard = false;
        switchPlayer();
    }, 700);
}

/**
 * Wertet zwei aufgedeckte Karten aus und aktualisiert den Spielzustand.
 * @returns {void}
 */
function evaluateTurn() {
    if (firstCardId === null || secondCardId === null) { return; }
    const firstCard = getCardById(firstCardId);
    const secondCard = getCardById(secondCardId);
    if (!firstCard || !secondCard) { return; }
    if (firstCard.pairId === secondCard.pairId) {
        handleMatchedPair(firstCard, secondCard);
        return;
    }
    handleMismatch(firstCard, secondCard);
}

/**
 * Ermittelt die angeklickte Karte aus einem Click-Event, falls spielbar.
 * @param {Event} event Click-Event vom Board.
 * @returns {CardModel | null} Karte oder null.
 */
function resolveClickedCard(event: Event): CardModel | null {
    const target = event.target as HTMLElement;
    const cardElement = target.closest(".memory-card") as HTMLButtonElement | null;
    if (!cardElement) { return null; }
    const cardId = Number(cardElement.dataset.cardId);
    const card = getCardById(cardId);
    return card && card.state === "hidden" ? card : null;
}

/**
 * Verarbeitet Klicks auf das Spielfeld und steuert den Zugablauf.
 * @param {Event} event Click-Event vom Board.
 * @returns {void}
 */
function onCardClick(event: Event) {
    if (lockBoard) { return; }
    const card = resolveClickedCard(event);
    if (!card) { return; }
    card.state = "revealed";
    syncCardElement(card);
    if (firstCardId === null) {
        firstCardId = card.id;
        updateStatus(`${currentPlayer} ist am Zug.`);
        return;
    }
    secondCardId = card.id;
    lockBoard = true;
    evaluateTurn();
}

const CONFETTI_COLORS = ["#f58e39", "#2bb1ff", "#ff4d4d", "#4dff91", "#ffe600", "#c44dff"];
const CONFETTI_COUNT = 60;

/**
 * Erstellt ein einzelnes Konfetti-Element mit zufaelligen Stileigenschaften.
 * @returns {HTMLSpanElement} Konfetti-Span.
 */
function createConfettiPiece(): HTMLSpanElement {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.width = `${6 + Math.random() * 8}px`;
    piece.style.height = `${10 + Math.random() * 10}px`;
    piece.style.animationDuration = `${2.2 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    return piece;
}

/**
 * Erzeugt Konfetti-Elemente fuer das Gewinner-Overlay.
 * @returns {void}
 */
function spawnConfetti() {
    if (!confettiContainer) { return; }
    confettiContainer.innerHTML = "";
    for (let i = 0; i < CONFETTI_COUNT; i += 1) {
        confettiContainer.appendChild(createConfettiPiece());
    }
}

/**
 * Ermittelt Gewinner, Verlierer und deren Anzeigetexte.
 * @returns {{ winner: string; winnerLabel: string }} Ergebnis-Objekt.
 */
function determineWinner() {
    const winner = scores.Blue > scores.Orange
        ? "Blue"
        : scores.Orange > scores.Blue ? "Orange" : "draw";
    const winnerLabel = winner === "draw" ? "IT'S A DRAW" : `${winner.toUpperCase()} PLAYER`;
    return { winner, winnerLabel };
}

/**
 * Setzt die Endpunktstande in der Game-Over-Intro-Anzeige.
 * @returns {void}
 */
function applyGameoverScores() {
    if (gameoverBlueScore) { gameoverBlueScore.textContent = String(scores.Blue); }
    if (gameoverOrangeScore) { gameoverOrangeScore.textContent = String(scores.Orange); }
}

/**
 * Setzt den Gewinner-Pawn im Overlay.
 * @param {string} winner Gewinner-Spieler oder "draw".
 * @returns {void}
 */
function applyWinnerPawn(winner: string) {
    if (!winnerPawnElement) { return; }
    winnerPawnElement.hidden = winner === "draw";
    if (winner !== "draw") {
        const player = winner as Player;
        const winnerImage = getWinnerImage(player);
        winnerPawnElement.dataset.player = winnerImage.includes("/img/pokal") ? "trophy" : winner;
        winnerPawnElement.src = winnerImage;
        winnerPawnElement.onerror = () => {
            winnerPawnElement!.dataset.player = player;
            winnerPawnElement!.src = winnerPawnMap[player];
            winnerPawnElement!.onerror = null;
        };
        winnerPawnElement.alt = `${winner} winner icon`;
    }
}

/**
 * Setzt Name, Icon und Pawn des Gewinners im Overlay.
 * @param {string} winner Gewinner-Spieler oder "draw".
 * @param {string} winnerLabel Anzeigetext des Gewinners.
 * @returns {void}
 */
function applyWinnerElements(winner: string, winnerLabel: string) {
    const isDraw = winner === "draw";
    if (winnerSubtitleElement) {
        winnerSubtitleElement.textContent = isDraw ? "It's a draw!" : "The winner is";
    }
    if (winnerNameElement) {
        winnerNameElement.textContent = winnerLabel;
        winnerNameElement.dataset.player = winner;
    }
    if (winnerIconElement) {
        winnerIconElement.hidden = isDraw;
        if (!isDraw) { winnerIconElement.src = getPlayerIcon(winner as Player); }
    }
    if (winnerDrawIconElement) {
        winnerDrawIconElement.hidden = !isDraw;
    }
    applyWinnerPawn(winner);
}

/**
 * Blendet Intro- und Gewinner-Overlay zeitgesteuert ein.
 * @returns {void}
 */
function showGameOverOverlay() {
    if (gameoverIntroOverlay) { gameoverIntroOverlay.removeAttribute("hidden"); }
    window.setTimeout(() => {
        if (gameoverIntroOverlay) { gameoverIntroOverlay.setAttribute("hidden", ""); }
        spawnConfetti();
        gameOverOverlay!.removeAttribute("hidden");
        window.setTimeout(() => { window.location.href = "./settings.html"; }, GAME_OVER_DISPLAY_MS);
    }, GAME_OVER_INTRO_MS);
}

/**
 * Zeigt Intro- und Gewinner-Overlay nach Spielende an.
 * @returns {void}
 */
function showGameOver() {
    if (!gameOverOverlay) { return; }
    const { winner, winnerLabel } = determineWinner();
    applyGameoverScores();
    applyWinnerElements(winner, winnerLabel);
    showGameOverOverlay();
}

/**
 * Initialisiert Spielstatus und Event-Listener.
 * @returns {void}
 */
function initGame() {
    if (!gameRoot || !boardElement) {
        return;
    }

    applyStoredTheme();
    applyThemePlayerIcons();
    const boardSize = parseBoardSize(localStorage.getItem("boardSize"));
    currentPlayer = getInitialPlayer();
    cards = createCards(boardSize);
    renderBoard(boardSize);
    updateHeaderState();
    updateStatus(`${currentPlayer} beginnt.`);
    boardElement.addEventListener("click", onCardClick);
}

initGame();
