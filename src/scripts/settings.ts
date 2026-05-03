export {};

/**
 * @interface ThemePreview
 * @property {string} card1 Pfad zum ersten Preview-Bild.
 * @property {string} card2 Pfad zum zweiten Preview-Bild.
 */
interface ThemePreview {
  card1: string;
  card2: string;
}

const themePreviewMap: Record<string, ThemePreview> = {
  "Code vibes theme": {
    card1: "/themes/code-vibes-card-1.svg",
    card2: "/themes/code-vibes-card-2.png",
  },
  "Gaming theme": {
    card1: "/themes/gaming-card-1.png",
    card2: "/themes/gaming-card-2.png",
  },
  "DA Projects theme": {
    card1: "/themes/da-projects-card-1.png",
    card2: "/themes/da-projects-card-2.png",
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

const defaultTheme = "Code vibes theme";
const defaultPlayer = "Blue";
const defaultBoardSize = "16";
const defaultPlayerIcons: Record<string, string> = {
  Blue: "/img/label_blue.svg",
  Orange: "/img/label2.svg",
};
const playerIconsByTheme: Record<string, Record<string, string>> = {
  "Code vibes theme": defaultPlayerIcons,
  "Gaming theme": {
    Blue: "/img/player_blue.png",
    Orange: "/img/player-orange.png",
  },
  "DA Projects theme": {
    Blue: "/img/player_blue.png",
    Orange: "/img/player-orange.png",
  },
};

interface SettingsSelection {
  theme: string;
  player: string;
  boardSize: string;
}

/**
 * Liest den ausgewaehlten Wert einer Radio-Gruppe.
 * @param {NodeListOf<HTMLInputElement>} inputs Radio-Inputs der Gruppe.
 * @param {string} fallbackValue Rueckfallwert, falls nichts ausgewaehlt ist.
 * @returns {string} Ausgewaehlter oder Fallback-Wert.
 */
function getCheckedValue(
  inputs: NodeListOf<HTMLInputElement>,
  fallbackValue: string,
): string {
  const checkedInput = Array.from(inputs).find((input) => input.checked);
  return checkedInput?.value ?? fallbackValue;
}

/**
 * Synchronisiert eine Radio-Gruppe mit einem Zielwert.
 * @param {NodeListOf<HTMLInputElement>} inputs Radio-Inputs der Gruppe.
 * @param {string} value Zielwert.
 * @returns {void}
 */
function syncCheckedInput(inputs: NodeListOf<HTMLInputElement>, value: string) {
  inputs.forEach((input) => {
    input.checked = input.value === value;
  });
}

/**
 * Aktualisiert die Zusammenfassung in der Settings-Navigation.
 * @param {string} theme Aktuelles Theme.
 * @param {string} player Aktueller Spieler.
 * @param {string} boardSize Aktuelle Board-Groesse.
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
 * Liefert alle verfuegbaren Theme-Namen aus den Radio-Optionen.
 * @returns {string[]} Liste aller Theme-Namen.
 */
function getAvailableThemes(): string[] {
  return Array.from(themeInputs).map((input) => input.value);
}

/**
 * Wendet ein Theme auf den Preview-Bereich an.
 * @param {string} theme Theme-Name.
 * @returns {void}
 */
function applyTheme(theme: string) {
  if (themeSection) {
    themeSection.setAttribute("data-theme", theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

/**
 * Aktualisiert die Vorschau-Kartenbilder fuer das ausgewaehlte Theme.
 * @param {string} theme Theme-Name.
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
 * Liefert das Icon-Mapping fuer ein Theme.
 * @param {string} theme Theme-Name.
 * @returns {Record<string, string>} Mapping fuer Spieler-Icons.
 */
function getPlayerIconsForTheme(theme: string): Record<string, string> {
  return playerIconsByTheme[theme] ?? defaultPlayerIcons;
}

/**
 * Aktualisiert beide Score-Icons in der Vorschau.
 * @param {Record<string, string>} playerIcons Icon-Mapping je Spieler.
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
 * Aktualisiert das Icon des aktuell ausgewaehlten Spielers in der Vorschau.
 * @param {Record<string, string>} playerIcons Icon-Mapping je Spieler.
 * @param {string} selectedPlayer Aktuell ausgewaehlter Spieler.
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
 * Setzt den Spieler-Status auf dem Preview-Wrapper fuer CSS-Hooks.
 * @param {string} selectedPlayer Aktuell ausgewaehlter Spieler.
 * @returns {void}
 */
function updateCurrentPreviewPlayerWrapper(selectedPlayer: string) {
  if (currentPlayerIconWrapper) {
    currentPlayerIconWrapper.setAttribute("data-player", selectedPlayer);
  }
}

/**
 * Wendet alle spielerbezogenen Vorschau-Icons fuer ein Theme an.
 * @param {string} theme Theme-Name.
 * @param {string} selectedPlayer Aktuell ausgewaehlter Spieler.
 * @returns {void}
 */
function applyPreviewPlayerIcons(theme: string, selectedPlayer: string) {
  const playerIcons = getPlayerIconsForTheme(theme);
  updatePreviewScoreIcons(playerIcons);
  updateCurrentPreviewPlayerIcon(playerIcons, selectedPlayer);
  updateCurrentPreviewPlayerWrapper(selectedPlayer);
}

/**
 * Setzt und speichert die Theme-Auswahl.
 * @param {string} theme Theme-Name.
 * @returns {string} Das gesetzte Theme.
 */
function setTheme(theme: string): string {
  applyTheme(theme);
  applyPreviewImages(theme);
  applyPreviewPlayerIcons(theme, getCheckedValue(playerInputs, defaultPlayer));
  localStorage.setItem("theme", theme);
  return theme;
}

/**
 * Setzt und speichert die Spieler-Auswahl.
 * @param {string} player Spielername.
 * @returns {string} Der gesetzte Spieler.
 */
function setPlayer(player: string): string {
  const theme = localStorage.getItem("theme") ?? defaultTheme;
  applyPreviewPlayerIcons(theme, player);

  localStorage.setItem("player", player);
  return player;
}

/**
 * Speichert die Board-Groesse.
 * @param {string} boardSize Board-Groesse als String.
 * @returns {string} Die gesetzte Board-Groesse.
 */
function setBoardSize(boardSize: string): string {
  localStorage.setItem("boardSize", boardSize);
  return boardSize;
}

/**
 * Aktualisiert die Navigations-Zusammenfassung aus dem aktuellen Input-Status.
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
 * Liest einen gespeicherten Wert und validiert ihn gegen vorhandene Inputs.
 * @param {string} storageKey Local-Storage-Key.
 * @param {NodeListOf<HTMLInputElement>} inputs Verfuegbare Input-Optionen.
 * @param {string} fallbackValue Rueckfallwert.
 * @returns {string} Valider gespeicherter Wert oder Fallback.
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
 * Baut die initiale Settings-Auswahl aus Storage-Werten und Defaults.
 * @returns {SettingsSelection} Initiale Auswahl.
 */
function getInitialSelection(): SettingsSelection {
  const availableThemes = getAvailableThemes();
  const storedTheme = localStorage.getItem("theme");

  return {
    theme:
      storedTheme && availableThemes.includes(storedTheme)
        ? storedTheme
        : defaultTheme,
    player: getStoredSelectionValue("player", playerInputs, defaultPlayer),
    boardSize: getStoredSelectionValue(
      "boardSize",
      boardSizeInputs,
      defaultBoardSize,
    ),
  };
}

/**
 * Wendet die initialen Settings auf Inputs, Preview und Summary an.
 * @param {SettingsSelection} selection Initiale Auswahlwerte.
 * @returns {void}
 */
function applyInitialSelection(selection: SettingsSelection) {
  setTheme(selection.theme);
  syncCheckedInput(themeInputs, selection.theme);
  setPlayer(selection.player);
  syncCheckedInput(playerInputs, selection.player);
  setBoardSize(selection.boardSize);
  syncCheckedInput(boardSizeInputs, selection.boardSize);
  updateSettingsNavSelection(
    selection.theme,
    selection.player,
    selection.boardSize,
  );
}

/**
 * Bindet einen wiederverwendbaren Change-Handler an eine Radio-Gruppe.
 * @param {NodeListOf<HTMLInputElement>} inputs Radio-Inputs.
 * @param {(value: string) => void} onCheckedChange Callback bei ausgewaehltem Wert.
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
    });
  });
}

/**
 * Verknuepft alle Listener fuer die Settings-Inputs.
 * @returns {void}
 */
function bindSettingsListeners() {
  bindInputChange(themeInputs, (value) => {
    setTheme(value);
  });
  bindInputChange(playerInputs, (value) => {
    setPlayer(value);
  });
  bindInputChange(boardSizeInputs, (value) => {
    setBoardSize(value);
  });
}

/**
 * Initialisiert das Verhalten der Settings-Seite, wenn Controls vorhanden sind.
 * @returns {void}
 */
function initSettings() {
  if (!themeInputs.length) {
    return;
  }

  const initialSelection = getInitialSelection();
  applyInitialSelection(initialSelection);
  bindSettingsListeners();
}

initSettings();
