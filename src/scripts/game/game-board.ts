import {
  boardElement,
  cardFrontByTheme,
  defaultTheme,
  runtime,
  type CardModel,
} from "./game-shared";

/**
 * Returns a new shuffled copy of an array.
 * @template T
 * @param {T[]} items Input array.
 * @returns {T[]} Shuffled copy.
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
 * Creates a shuffled card deck for current theme and board size.
 * @param {number} boardSize Number of cards on the board.
 * @returns {CardModel[]} Shuffled card models.
 */
export function createCards(boardSize: number): CardModel[] {
  const pairCount = boardSize / 2;
  const cardValues = cardFrontByTheme[runtime.activeTheme] || cardFrontByTheme[defaultTheme];
  const values = cardValues.slice(0, pairCount);

  return shuffle(values.flatMap((value, pairId) => [{ pairId, value }, { pairId, value }]))
    .map((card, id) => ({ id, pairId: card.pairId, value: card.value, state: "hidden" }));
}

/**
 * Returns the number of grid columns for the selected board size.
 * @param {number} boardSize Number of cards on the board.
 * @returns {number} Grid column count.
 */
function getGridColumns(boardSize: number): number {
  if (boardSize === 34) {
    return 6;
  }
  return Math.sqrt(boardSize);
}

/**
 * Creates the card back face element.
 * @returns {HTMLSpanElement} Back face element.
 */
function createCardBackFace(): HTMLSpanElement {
  const cardBack = document.createElement("span");
  cardBack.className = "memory-card__face memory-card__face--back";

  const cardBackImage = document.createElement("img");
  cardBackImage.className = "memory-card__image memory-card__image--back";
  cardBackImage.src = runtime.activeCardBackImage;
  cardBackImage.alt = "Hidden card";

  cardBack.appendChild(cardBackImage);
  return cardBack;
}

/**
 * Creates the card front face element.
 * @param {string} src Front image path.
 * @returns {HTMLSpanElement} Front face element.
 */
function createCardFrontFace(src: string): HTMLSpanElement {
  const cardFront = document.createElement("span");
  cardFront.className = "memory-card__face memory-card__face--front";

  const cardFrontImage = document.createElement("img");
  cardFrontImage.className = "memory-card__image";
  cardFrontImage.src = src;
  cardFrontImage.alt = "Memory card image";
  cardFrontImage.addEventListener("error", () => {
    cardFrontImage.style.display = "none";
  });

  cardFront.appendChild(cardFrontImage);
  return cardFront;
}

/**
 * Creates the card inner wrapper containing front and back.
 * @param {CardModel} card Card model.
 * @returns {HTMLSpanElement} Card inner element.
 */
function createCardInner(card: CardModel): HTMLSpanElement {
  const cardInner = document.createElement("span");
  cardInner.className = "memory-card__inner";
  cardInner.appendChild(createCardBackFace());
  cardInner.appendChild(createCardFrontFace(card.value));
  return cardInner;
}

/**
 * Creates a button element for a single card.
 * @param {CardModel} card Card model.
 * @returns {HTMLButtonElement} Configured card button.
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
 * Renders all cards to the board container.
 * @param {number} boardSize Number of cards on the board.
 * @returns {void}
 */
export function renderBoard(boardSize: number): void {
  if (!boardElement) {
    return;
  }
  const grid = boardElement;

  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${getGridColumns(boardSize)}, minmax(0, 1fr))`;

  runtime.cards.forEach((card) => {
    grid.appendChild(createCardButton(card));
  });
}

/**
 * Syncs one card state into its DOM element.
 * @param {CardModel} card Card model.
 * @returns {void}
 */
export function syncCardElement(card: CardModel): void {
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

/**
 * Finds a card by ID in current runtime state.
 * @param {number} id Card ID.
 * @returns {CardModel | undefined} Found card or undefined.
 */
export function getCardById(id: number): CardModel | undefined {
  return runtime.cards.find((card) => card.id === id);
}

/**
 * Resolves the clicked card from a board click event when playable.
 * @param {Event} event Board click event.
 * @returns {CardModel | null} Resolved card or null.
 */
export function resolveClickedCard(event: Event): CardModel | null {
  const target = event.target as HTMLElement;
  const cardElement = target.closest(".memory-card") as HTMLButtonElement | null;
  if (!cardElement) {
    return null;
  }

  const cardId = Number(cardElement.dataset.cardId);
  const card = getCardById(cardId);
  return card && card.state === "hidden" ? card : null;
}
