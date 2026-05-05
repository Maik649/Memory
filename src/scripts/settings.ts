export {};

const BASE = import.meta.env.BASE_URL;

/**
 * @interface ThemePreview
 * @property {string} card1 Path to the first preview image.
 * @property {string} card2 Path to the second preview image.
 */
interface ThemePreview {
  card1: string;
  card2: string;
}

const themePreviewMap: Record<string, ThemePreview> = {
  "Code vibes theme": {
    card1: `${BASE}themes/code-vibes-card-1.svg`,
    card2: `${BASE}themes/code-vibes-card-2.png`,
  },
  "Gaming theme": {
    card1: `${BASE}themes/gaming-card-1.png`,
    card2: `${BASE}themes/gaming-card-3.png`,
  },
  "DA Projects theme": {
    card1: `${BASE}themes/da-projects-card-1.png`,
    card2: `${BASE}themes/da-projects-card-2.png`,
  },
};

const themeInputs = document.querySelectorAll(
  'input[name="theme-radio-btn"]',
) as NodeListOf<HTMLInputElement>;
const playerInputs = document.querySelectorAll(
  'input[name="player-radio-btn"]',
) as NodeListOf<HTMLInputElement>;
const boardSizeInputs = document.querySelectorAll(
  'input[name="board-size-radio-btn"]',
) as NodeListOf<HTMLInputElement>;

const themeSection = document.querySelector(
  ".theme-section",
) as HTMLElement | null;
const previewCard1 = document.querySelector(
  ".preview-card--1",
) as HTMLImageElement | null;
const previewCard2 = document.querySelector(
  ".preview-card--2",
) as HTMLImageElement | null;
const currentPlayerIcon = document.querySelector(
  "[data-preview-current-player-icon]",
) as HTMLImageElement | null;
const currentPlayerIconWrapper = document.querySelector(
  ".current-player-content-img",
) as HTMLElement | null;
const previewBluePlayerIcon = document.querySelector(
  '[data-preview-player-icon="Blue"]',
) as HTMLImageElement | null;
const previewOrangePlayerIcon = document.querySelector(
  '[data-preview-player-icon="Orange"]',
) as HTMLImageElement | null;
const navThemeValue = document.querySelector(
  '[data-settings-nav="theme"] .settings-nav__value',
) as HTMLElement | null;
const navPlayerValue = document.querySelector(
  '[data-settings-nav="player"] .settings-nav__value',
) as HTMLElement | null;
const navBoardSizeValue = document.querySelector(
  '[data-settings-nav="board-size"] .settings-nav__value',
) as HTMLElement | null;
const backToGameButton = document.querySelector(
  "[data-back-to-game]",
) as HTMLAnchorElement | null;
const settingsHeader = document.querySelector(
  ".settings-header",
) as HTMLElement | null;

const defaultTheme = "Code vibes theme";
const defaultPlayer = "Blue";
const defaultBoardSize = "16";
const GAME_IN_PROGRESS_STORAGE_KEY = "memoryGameInProgress";
const defaultPlayerIcons: Record<string, string> = {
  Blue: `${BASE}img/label_blue.svg`,
  Orange: `${BASE}img/label2.svg`,
};
const playerIconsByTheme: Record<string, Record<string, string>> = {
  "Code vibes theme": defaultPlayerIcons,
  "Gaming theme": {
    Blue: `${BASE}img/player_blue.png`,
    Orange: `${BASE}img/player-orange.png`,
  },
  "DA Projects theme": {
    Blue: `${BASE}img/player_blue.png`,
    Orange: `${BASE}img/player-orange.png`,
  },
};

interface SettingsSelection {
  theme: string;
  player: string;
  boardSize: string;
}

/**
 * Reads the selected value of a radio group.
 * @param {NodeListOf<HTMLInputElement>} inputs Radio inputs in the group.
 * @param {string} fallbackValue Fallback value if nothing is selected.
 * @returns {string} Selected or fallback value.
 */
function getCheckedValue(
  inputs: NodeListOf<HTMLInputElement>,
  fallbackValue: string,
): string {
  const checkedInput = Array.from(inputs).find((input) => input.checked);
  return checkedInput?.value ?? fallbackValue;
}

/**
 * Syncs a radio group to a target value.
 * @param {NodeListOf<HTMLInputElement>} inputs Radio inputs in the group.
 * @param {string} value Target value.
 * @returns {void}
 */
function syncCheckedInput(inputs: NodeListOf<HTMLInputElement>, value: string) {
  inputs.forEach((input) => {
    input.checked = input.value === value;
  });
}

/**
 * Updates the summary in the settings navigation.
 * @param {string} theme Current theme.
 * @param {string} player Current player.
 * @param {string} boardSize Current board size.
 * @returns {void}
 */
function updateSettingsNavSelection(
  theme: string,
  player: string,
  boardSize: string,
) {
  if (navThemeValue) {
    navThemeValue.textContent = theme;
  }
  if (navPlayerValue) {
    navPlayerValue.textContent = player;
  }
  if (navBoardSizeValue) {
    navBoardSizeValue.textContent = boardSize;
  }
}

/**
 * Returns all available theme names from the radio options.
 * @returns {string[]} List of all theme names.
 */
function getAvailableThemes(): string[] {
  return Array.from(themeInputs).map((input) => input.value);
}

/**
 * Applies a theme to the preview area.
 * @param {string} theme Theme name.
 * @returns {void}
 */
function applyTheme(theme: string) {
  if (themeSection) {
    themeSection.setAttribute("data-theme", theme);
  }
  if (settingsHeader) {
    settingsHeader.setAttribute("data-theme", theme);
  }
}

/**
 * Updates the preview card images for the selected theme.
 * @param {string} theme Theme name.
 * @returns {void}
 */
function applyPreviewImages(theme: string) {
  const preview = themePreviewMap[theme];
  if (!preview) return;

  if (previewCard1) {
    previewCard1.src = preview.card1;
    previewCard1.alt = `${theme} card 1`;
  }
  if (previewCard2) {
    previewCard2.src = preview.card2;
    previewCard2.alt = `${theme} card 2`;
  }
}

/**
 * Returns the icon mapping for a theme.
 * @param {string} theme Theme name.
 * @returns {Record<string, string>} Player icon mapping.
 */
function getPlayerIconsForTheme(theme: string): Record<string, string> {
  return playerIconsByTheme[theme] ?? defaultPlayerIcons;
}

/**
 * Updates both score icons in the preview.
 * @param {Record<string, string>} playerIcons Icon mapping per player.
 * @returns {void}
 */
function updatePreviewScoreIcons(playerIcons: Record<string, string>) {
  if (previewBluePlayerIcon) {
    previewBluePlayerIcon.src = playerIcons.Blue;
    previewBluePlayerIcon.alt = "Blue marker";
  }

  if (previewOrangePlayerIcon) {
    previewOrangePlayerIcon.src = playerIcons.Orange;
    previewOrangePlayerIcon.alt = "Orange marker";
  }
}

/**
 * Updates the icon of the currently selected player in the preview.
 * @param {Record<string, string>} playerIcons Icon mapping per player.
 * @param {string} selectedPlayer Currently selected player.
 * @returns {void}
 */
function updateCurrentPreviewPlayerIcon(
  playerIcons: Record<string, string>,
  selectedPlayer: string,
) {
  if (!currentPlayerIcon) {
    return;
  }

  const currentPlayerIconSrc = playerIcons[selectedPlayer] ?? playerIcons.Blue;
  currentPlayerIcon.src = currentPlayerIconSrc;
  currentPlayerIcon.alt = `${selectedPlayer} player icon`;
}

/**
 * Sets the player state on the preview wrapper for CSS hooks.
 * @param {string} selectedPlayer Currently selected player.
 * @returns {void}
 */
function updateCurrentPreviewPlayerWrapper(selectedPlayer: string) {
  if (currentPlayerIconWrapper) {
    currentPlayerIconWrapper.setAttribute("data-player", selectedPlayer);
  }
}

/**
 * Applies all player-related preview icons for a theme.
 * @param {string} theme Theme name.
 * @param {string} selectedPlayer Currently selected player.
 * @returns {void}
 */
function applyPreviewPlayerIcons(theme: string, selectedPlayer: string) {
  const playerIcons = getPlayerIconsForTheme(theme);
  updatePreviewScoreIcons(playerIcons);
  updateCurrentPreviewPlayerIcon(playerIcons, selectedPlayer);
  updateCurrentPreviewPlayerWrapper(selectedPlayer);
}

/**
 * Applies a theme and its related preview elements without persisting it.
 * @param {string} theme Theme name.
 * @returns {void}
 */
function applyThemePreview(theme: string) {
  applyTheme(theme);
  applyPreviewImages(theme);
  applyPreviewPlayerIcons(theme, getCheckedValue(playerInputs, defaultPlayer));
}

/**
 * Sets and stores the selected theme.
 * @param {string} theme Theme name.
 * @returns {string} The applied theme.
 */
function setTheme(theme: string): string {
  applyThemePreview(theme);
  localStorage.setItem("theme", theme);
  return theme;
}

/**
 * Sets and stores the player selection.
 * @param {string} player Player name.
 * @returns {string} The applied player.
 */
function setPlayer(player: string): string {
  const theme = localStorage.getItem("theme") ?? defaultTheme;
  applyPreviewPlayerIcons(theme, player);

  localStorage.setItem("player", player);
  return player;
}

/**
 * Stores the board size.
 * @param {string} boardSize Board size as a string.
 * @returns {string} The applied board size.
 */
function setBoardSize(boardSize: string): string {
  localStorage.setItem("boardSize", boardSize);
  return boardSize;
}

/**
 * Updates the navigation summary from the current input state.
 * @returns {void}
 */
function updateSettingsNavFromInputs() {
  updateSettingsNavSelection(
    getCheckedValue(themeInputs, defaultTheme),
    getCheckedValue(playerInputs, defaultPlayer),
    getCheckedValue(boardSizeInputs, defaultBoardSize),
  );
}

/**
 * Reads a stored value and validates it against available inputs.
 * @param {string} storageKey Local storage key.
 * @param {NodeListOf<HTMLInputElement>} inputs Available input options.
 * @param {string} fallbackValue Fallback value.
 * @returns {string} Valid stored value or fallback.
 */
function getStoredSelectionValue(
  storageKey: string,
  inputs: NodeListOf<HTMLInputElement>,
  fallbackValue: string,
): string {
  const storedValue = localStorage.getItem(storageKey);
  return storedValue &&
    Array.from(inputs).some((input) => input.value === storedValue)
    ? storedValue
    : fallbackValue;
}

/**
 * Builds the initial settings selection from storage values and defaults.
 * @returns {SettingsSelection} Initial selection.
 */
function getInitialSelection(): SettingsSelection {
  const availableThemes = getAvailableThemes();
  const storedTheme = localStorage.getItem("theme");

  return {
    theme:
      storedTheme && availableThemes.includes(storedTheme) ? storedTheme : defaultTheme,
    player: getStoredSelectionValue("player", playerInputs, defaultPlayer),
    boardSize: getStoredSelectionValue(
      "boardSize",
      boardSizeInputs,
      defaultBoardSize,
    ),
  };
}

/**
 * Applies the initial settings to inputs, preview, and summary.
 * @param {SettingsSelection} selection Initial selection values.
 * @returns {void}
 */
function applyInitialSelection(selection: SettingsSelection) {
  setTheme(selection.theme);
  syncCheckedInput(themeInputs, selection.theme);
  setPlayer(selection.player);
  syncCheckedInput(playerInputs, selection.player);
  setBoardSize(selection.boardSize);
  syncCheckedInput(boardSizeInputs, selection.boardSize);
  updateSettingsNavSelection(selection.theme, selection.player, selection.boardSize);
}

/**
 * Attaches a reusable change handler to a radio group.
 * @param {NodeListOf<HTMLInputElement>} inputs Radio inputs.
 * @param {(value: string) => void} onCheckedChange Callback for the selected value.
 * @returns {void}
 */
function bindInputChange(
  inputs: NodeListOf<HTMLInputElement>,
  onCheckedChange: (value: string) => void,
) {
  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) { return;}
      onCheckedChange(input.value);
      updateSettingsNavFromInputs();
    });
  });
}

/**
 * Wires all listeners for the settings inputs.
 * @returns {void}
 */
function bindSettingsListeners() {
  bindThemePreviewListeners();
  bindInputChange(themeInputs, (value) => {setTheme(value);});
  bindInputChange(playerInputs, (value) => {setPlayer(value);});
  bindInputChange(boardSizeInputs, (value) => {setBoardSize(value);});
}

/**
 * Enables theme preview on hover and focus, then restores it on exit.
 * @returns {void}
 */
function bindThemePreviewListeners() {
  const restoreSelectedThemePreview = () => {
    applyThemePreview(getCheckedValue(themeInputs, defaultTheme));
  };

  themeInputs.forEach((input) => {
    const previewTheme = () => {
      applyThemePreview(input.value);
    };
    const inputContainer = input.closest(".input-container");

    if (inputContainer) {
      inputContainer.addEventListener("mouseenter", previewTheme);
      inputContainer.addEventListener("mouseleave", restoreSelectedThemePreview);
    } else {
      input.addEventListener("mouseenter", previewTheme);
      input.addEventListener("mouseleave", restoreSelectedThemePreview);
    }
    input.addEventListener("focus", previewTheme);
    input.addEventListener("blur", restoreSelectedThemePreview);
  });
}

/**
 * Checks whether the back-to-game button should be shown.
 * @returns {boolean} True when a game session is active or the page was opened from the game.
 */
function shouldShowBackToGameButton(): boolean {
  const fromGame = new URLSearchParams(window.location.search).get("fromGame");
  const hasGameInProgress =
    sessionStorage.getItem(GAME_IN_PROGRESS_STORAGE_KEY) === "true";
  return fromGame === "1" || hasGameInProgress;
}

/**
 * Controls the visibility of the back-to-game button.
 * @returns {void}
 */
function initBackToGameButton() {
  if (!backToGameButton) {return;}

  if (shouldShowBackToGameButton()) {
    backToGameButton.hidden = false;return;}

  backToGameButton.hidden = true;
}

/**
 * Initializes the settings page behavior when controls are present.
 * @returns {void}
 */
function initSettings() {
  if (!themeInputs.length) {
    return;
  }

  initBackToGameButton();
  const initialSelection = getInitialSelection();
  applyInitialSelection(initialSelection);
  bindSettingsListeners();
}
initSettings();
