import {
  GAME_IN_PROGRESS_STORAGE_KEY,
  SettingsSelection,
  backToGameButton,
  boardSizeInputs,
  defaultBoardSize,
  defaultPlayer,
  defaultTheme,
  getAvailableThemes,
  navBoardSizeValue,
  navPlayerValue,
  navThemeValue,
  playerInputs,
  startButton,
  syncCheckedInput,
  themeInputs,
} from "./shared";
import { applyThemePreview, setPlayer, setTheme } from "./preview";

/**
 * Updates the summary in the settings navigation.
 * @param {string} theme Current theme.
 * @param {string} player Current player.
 * @param {string} boardSize Current board size.
 * @returns {void}
 */
function updateSettingsNavSelection(
  theme: string | null,
  player: string | null,
  boardSize: string | null,
) {
  if (navThemeValue) {
    navThemeValue.textContent = theme ?? "—";
  }
  if (navPlayerValue) {
    navPlayerValue.textContent = player ?? "—";
  }
  if (navBoardSizeValue) {
    navBoardSizeValue.textContent = boardSize ?? "—";
  }
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
  const checkedTheme = Array.from(themeInputs).find((i) => i.checked)?.value ?? null;
  const checkedPlayer = Array.from(playerInputs).find((i) => i.checked)?.value ?? null;
  const checkedBoardSize =
    Array.from(boardSizeInputs).find((i) => i.checked)?.value ?? null;
  updateSettingsNavSelection(checkedTheme, checkedPlayer, checkedBoardSize);
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
      if (!input.checked) {
        return;
      }

      onCheckedChange(input.value);
      updateSettingsNavFromInputs();
      updateStartButtonState();
    });
  });
}

/**
 * Enables theme preview on hover and focus, then restores it on exit.
 * @returns {void}
 */
function restoreSelectedThemePreview() {
  const selectedTheme =
    Array.from(themeInputs).find((input) => input.checked)?.value ?? defaultTheme;
  applyThemePreview(selectedTheme);
}

/**
 * Binds hover listeners either on the wrapper or directly on the input.
 * @param {HTMLInputElement} input Theme input.
 * @param {() => void} previewTheme Preview callback.
 * @returns {void}
 */
function bindThemeHoverListeners(
  input: HTMLInputElement,
  previewTheme: () => void,
) {
  const inputContainer = input.closest(".input-container");

  if (inputContainer) {
    inputContainer.addEventListener("mouseenter", previewTheme);
    inputContainer.addEventListener("mouseleave", restoreSelectedThemePreview);
    return;
  }

  input.addEventListener("mouseenter", previewTheme);
  input.addEventListener("mouseleave", restoreSelectedThemePreview);
}

/**
 * Binds all preview listeners for one theme input.
 * @param {HTMLInputElement} input Theme input.
 * @returns {void}
 */
function bindThemePreviewListener(input: HTMLInputElement) {
  const previewTheme = () => {
    applyThemePreview(input.value);
  };

  bindThemeHoverListeners(input, previewTheme);
  input.addEventListener("focus", previewTheme);
  input.addEventListener("blur", restoreSelectedThemePreview);
}

/**
 * Enables theme preview on hover and focus, then restores it on exit.
 * @returns {void}
 */
function bindThemePreviewListeners() {

  themeInputs.forEach((input) => {
    bindThemePreviewListener(input);
  });
}

/**
 * Prevents navigation if the start button is disabled.
 * @returns {void}
 */
function bindStartButtonListener() {
  if (!startButton) {
    return;
  }

  const button = startButton;

  button.addEventListener("click", (event) => {
    if (button.hasAttribute("disabled")) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

/**
 * Wires all listeners for the settings inputs.
 * @returns {void}
 */
function bindSettingsListeners() {
  bindThemePreviewListeners();
  bindInputChange(themeInputs, (value) => {
    setTheme(value);
  });
  bindInputChange(playerInputs, (value) => {
    setPlayer(value);
  });
  bindInputChange(boardSizeInputs, (value) => {
    setBoardSize(value);
  });
  bindStartButtonListener();
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
 * Checks whether all required settings are selected.
 * @returns {boolean} True if theme, player, and board size are all selected.
 */
function isAllSettingsSelected(): boolean {
  const hasTheme = Array.from(themeInputs).some((input) => input.checked);
  const hasPlayer = Array.from(playerInputs).some((input) => input.checked);
  const hasBoardSize = Array.from(boardSizeInputs).some((input) => input.checked);
  return hasTheme && hasPlayer && hasBoardSize;
}

/**
 * Updates the start button enabled/disabled state based on settings selection.
 * @returns {void}
 */
function updateStartButtonState(): void {
  if (!startButton) {
    return;
  }

  const isEnabled = isAllSettingsSelected();

  if (isEnabled) {
    startButton.removeAttribute("disabled");
  } else {
    startButton.setAttribute("disabled", "");
  }
}

/**
 * Controls the visibility of the back-to-game button.
 * @returns {void}
 */
function initBackToGameButton() {
  if (!backToGameButton) {
    return;
  }

  if (shouldShowBackToGameButton()) {
    backToGameButton.hidden = false;
    return;
  }

  backToGameButton.hidden = true;
}

/**
 * Initializes the settings page behavior when controls are present.
 * @returns {void}
 */
export function initSettings() {
  if (!themeInputs.length) {
    return;
  }

  initBackToGameButton();
  bindSettingsListeners();
  updateSettingsNavFromInputs();
  updateStartButtonState();

  if (shouldShowBackToGameButton()) {
    const initialSelection = getInitialSelection();
    applyInitialSelection(initialSelection);
  }
}