export {};

type Player = "Blue" | "Orange";

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
const gameoverIntroOverlay = document.querySelector("[data-gameover-intro]") as HTMLElement | null;
const loserIconElement = document.querySelector("[data-loser-icon]") as HTMLImageElement | null;
const loserNameElement = document.querySelector("[data-loser-name]") as HTMLElement | null;
const gameoverBlueScore = document.querySelector('[data-gameover-score="Blue"]') as HTMLElement | null;
const gameoverOrangeScore = document.querySelector('[data-gameover-score="Orange"]') as HTMLElement | null;
const gameOverOverlay = document.querySelector("[data-game-over]") as HTMLElement | null;
const winnerIconElement = document.querySelector("[data-winner-icon]") as HTMLImageElement | null;
const winnerNameElement = document.querySelector("[data-winner-name]") as HTMLElement | null;
const winnerPawnElement = document.querySelector("[data-winner-pawn]") as HTMLImageElement | null;
const confettiContainer = document.querySelector("[data-confetti]") as HTMLElement | null;
const GAME_OVER_INTRO_MS = 2000;
const GAME_OVER_DISPLAY_MS = 4000;

const playerIconMap: Record<Player, string> = {
    Blue: "/img/label_blue.svg",
    Orange: "/img/label2.svg",
};

const winnerPawnMap: Record<Player, string> = {
    Blue: "/img/player_blue.png",
    Orange: "/img/player_orage.png",
};

const cardBackByTheme: Record<string, string> = {
  "Code vibes theme": "/themes/code-vibes-card1.svg",
  "Gaming theme": "/themes/gamingtheme-card1.png",
  "DA Projects theme": "/themes/da-projects-card1.png",
  "Foods theme": "/themes/foods-card1.png",
};

const defaultTheme = "Code vibes theme";
const defaultPlayer: Player = "Blue";
const defaultBoardSize = 16;
const cardFrontByTheme: Record<string, string[]> = {
    "Code vibes theme": [
        "/img/theme-img/Cards 5 (1).png",
        "/img/theme-img/Cards 5 (2).png",
        "/img/theme-img/Cards 5 (3).png",
        "/img/theme-img/Cards 5 (4).png",
        "/img/theme-img/Cards 5 (5).png",
        "/img/theme-img/Cards 5 (6).png",
        "/img/theme-img/Cards 5 (7).png",
        "/img/theme-img/Cards 5.png",
        "/img/theme-img/Cards 5 (9).png",
        "/img/theme-img/Cards 5 (10).png",
        "/img/theme-img/Cards 5 (11).png",
        "/img/theme-img/Cards 5 (12).png",
        "/img/theme-img/Cards 5 (13).png",
        "/img/theme-img/Cards 5 (14).png",
        "/img/theme-img/Cards 5 (15).png",
    ],
    "Gaming theme": [
        "/img/theme-img/Asset 3@2x 1.png",
        "/img/theme-img/Asset 4@2x 1.png",
        "/img/theme-img/Asset 5@2x 1.png",
        "/img/theme-img/Asset 6@2x 1.png",
        "/img/theme-img/Asset 8@2x 1.png",
        "/img/theme-img/Asset 8@2x 2.png",
        "/img/theme-img/Asset 9@2x 1.png",
        "/img/theme-img/Asset 10@2x 1.png",
        "/img/theme-img/Asset 11@2x 1.png",
        "/img/theme-img/Asset 12@2x 1.png",
        "/img/theme-img/Asset 13@2x 1.png",
        "/img/theme-img/Asset 14@2x 1.png",
        "/img/theme-img/Asset 15@2x 1.png",
        "/img/theme-img/Asset 16@2x 1.png",
        "/img/theme-img/Asset 17@2x 1.png",
        "/img/theme-img/Asset 18@2x 1.png",
        "/img/theme-img/Asset 19@2x 1.png",
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

function parseBoardSize(value: string | null): number {
    const parsed = Number(value);
    return [16, 24, 34].includes(parsed) ? parsed : defaultBoardSize;
}

function applyStoredTheme() {
    const storedTheme = localStorage.getItem("theme") || defaultTheme;
    activeTheme = storedTheme;
    document.documentElement.setAttribute("data-theme", storedTheme);
    activeCardBackImage = cardBackByTheme[storedTheme] || cardBackByTheme[defaultTheme];
    document.documentElement.style.setProperty("--memory-card-back-image", `url('${activeCardBackImage}')`);
}

function getInitialPlayer(): Player {
    const storedPlayer = localStorage.getItem("player");
    return storedPlayer === "Orange" ? "Orange" : "Blue";
}

function updateHeaderState() {
    if (currentPlayerIconElement) {
        currentPlayerIconElement.src = playerIconMap[currentPlayer];
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

function updateStatus(text: string) {
    if (statusElement) {
        statusElement.textContent = text;
    }
}

function shuffle<T>(items: T[]): T[] {
    const copied = [...items];
    for (let index = copied.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [copied[index], copied[randomIndex]] = [copied[randomIndex], copied[index]];
    }
    return copied;
}

function createCards(boardSize: number): CardModel[] {
    const pairCount = boardSize / 2;
    const cardValues = cardFrontByTheme[activeTheme] || cardFrontByTheme[defaultTheme];
    const values = cardValues.slice(0, pairCount);

    return shuffle(
        values.flatMap((value, pairId) => [
            { pairId, value },
            { pairId, value },
        ])
    ).map((card, id) => ({
        id,
        pairId: card.pairId,
        value: card.value,
        state: "hidden",
    }));
}

function getGridColumns(boardSize: number): number {
    if (boardSize === 34) {
        return 6;
    }
    return Math.sqrt(boardSize);
}

function renderBoard(boardSize: number) {
    if (!boardElement) {
        return;
    }

    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${getGridColumns(boardSize)}, minmax(0, 1fr))`;

    cards.forEach((card) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "memory-card";
        button.dataset.cardId = String(card.id);
        button.dataset.state = card.state;
        button.setAttribute("aria-label", "Memory card");

        const cardInner = document.createElement("span");
        cardInner.className = "memory-card__inner";

        const cardBack = document.createElement("span");
        cardBack.className = "memory-card__face memory-card__face--back";

        const cardBackImage = document.createElement("img");
        cardBackImage.className = "memory-card__image memory-card__image--back";
        cardBackImage.src = activeCardBackImage;
        cardBackImage.alt = "Verdeckte Karte";
        cardBack.appendChild(cardBackImage);

        const cardFront = document.createElement("span");
        cardFront.className = "memory-card__face memory-card__face--front";

        const cardFrontImage = document.createElement("img");
        cardFrontImage.className = "memory-card__image";
        cardFrontImage.src = card.value;
        cardFrontImage.alt = "Memory card image";
        cardFrontImage.addEventListener("error", () => {
            cardFrontImage.style.display = "none";
        });
        cardFront.appendChild(cardFrontImage);

        cardInner.appendChild(cardBack);
        cardInner.appendChild(cardFront);
        button.appendChild(cardInner);
        boardElement.appendChild(button);
    });
}

function syncCardElement(card: CardModel) {
    if (!boardElement) {
        return;
    }

    const cardElement = boardElement.querySelector(`[data-card-id="${card.id}"]`) as HTMLButtonElement | null;
    if (!cardElement) {
        return;
    }

    cardElement.dataset.state = card.state;
    cardElement.disabled = card.state === "matched";
}

function switchPlayer() {
    currentPlayer = currentPlayer === "Blue" ? "Orange" : "Blue";
    updateHeaderState();
}

function getCardById(id: number): CardModel | undefined {
    return cards.find((card) => card.id === id);
}

function evaluateTurn() {
    if (firstCardId === null || secondCardId === null) {
        return;
    }

    const firstCard = getCardById(firstCardId);
    const secondCard = getCardById(secondCardId);
    if (!firstCard || !secondCard) {
        return;
    }

    if (firstCard.pairId === secondCard.pairId) {
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

        if (matchedPairs === cards.length / 2) {
            showGameOver();
        }
        return;
    }

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

function onCardClick(event: Event) {
    if (lockBoard) {
        return;
    }

    const target = event.target as HTMLElement;
    const cardElement = target.closest(".memory-card") as HTMLButtonElement | null;
    if (!cardElement) {
        return;
    }

    const cardId = Number(cardElement.dataset.cardId);
    const card = getCardById(cardId);
    if (!card || card.state !== "hidden") {
        return;
    }

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

function spawnConfetti() {
    if (!confettiContainer) {
        return;
    }

    confettiContainer.innerHTML = "";

    for (let i = 0; i < CONFETTI_COUNT; i += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        piece.style.width = `${6 + Math.random() * 8}px`;
        piece.style.height = `${10 + Math.random() * 10}px`;
        const duration = 2.2 + Math.random() * 2;
        const delay = Math.random() * 1.5;
        piece.style.animationDuration = `${duration}s`;
        piece.style.animationDelay = `${delay}s`;
        confettiContainer.appendChild(piece);
    }
}

function showGameOver() {
    if (!gameOverOverlay) {
        return;
    }

    const winner = scores.Blue > scores.Orange
        ? "Blue"
        : scores.Orange > scores.Blue
            ? "Orange"
            : "draw";
    const loser: Player | "draw" = winner === "Blue" ? "Orange" : winner === "Orange" ? "Blue" : "draw";

    const winnerLabel = winner === "draw" ? "IT'S A DRAW" : `${winner.toUpperCase()} PLAYER`;
    const loserLabel = loser === "draw" ? "IT'S A DRAW" : `${loser.toUpperCase()} PLAYER`;

    // Game-over intro: final scores
    if (gameoverBlueScore) {
        gameoverBlueScore.textContent = String(scores.Blue);
    }
    if (gameoverOrangeScore) {
        gameoverOrangeScore.textContent = String(scores.Orange);
    }

    // Winner screen: winner info
    if (winnerNameElement) {
        winnerNameElement.textContent = winnerLabel;
        winnerNameElement.dataset.player = winner;
    }
    if (winnerIconElement) {
        winnerIconElement.hidden = winner === "draw";
        if (winner !== "draw") {
            winnerIconElement.src = playerIconMap[winner];
        }
    }
    if (winnerPawnElement) {
        winnerPawnElement.dataset.player = winner;
        winnerPawnElement.hidden = winner === "draw";
        if (winner !== "draw") {
            winnerPawnElement.src = winnerPawnMap[winner];
            winnerPawnElement.alt = `${winner} winner icon`;
        }
    }

    if (gameoverIntroOverlay) {
        gameoverIntroOverlay.removeAttribute("hidden");
    }

    window.setTimeout(() => {
        if (gameoverIntroOverlay) {
            gameoverIntroOverlay.setAttribute("hidden", "");
        }
        spawnConfetti();
        gameOverOverlay.removeAttribute("hidden");

        window.setTimeout(() => {
            window.location.href = "./settings.html";
        }, GAME_OVER_DISPLAY_MS);
    }, GAME_OVER_INTRO_MS);
}

function initGame() {
    if (!gameRoot || !boardElement) {
        return;
    }

    applyStoredTheme();
    const boardSize = parseBoardSize(localStorage.getItem("boardSize"));
    currentPlayer = getInitialPlayer();
    cards = createCards(boardSize);
    renderBoard(boardSize);
    updateHeaderState();
    updateStatus(`${currentPlayer} beginnt.`);
    boardElement.addEventListener("click", onCardClick);
}

initGame();
