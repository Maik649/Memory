import {
  currentPlayerIcon,
  currentPlayerIconWrapper,
  defaultPlayer,
  defaultPlayerIcons,
  playerIconsByTheme,
  playerInputs,
  previewBluePlayerIcon,
  previewCard1,
  previewCard2,
  previewOrangePlayerIcon,
  settingsHeader,
  themePreviewMap,
  themeSection,
  getCheckedValue,
} from "./shared";

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
export function applyThemePreview(theme: string) {
  applyTheme(theme);
  applyPreviewImages(theme);
  applyPreviewPlayerIcons(theme, getCheckedValue(playerInputs, defaultPlayer));
}

/**
 * Sets and stores the selected theme.
 * @param {string} theme Theme name.
 * @returns {string} The applied theme.
 */
export function setTheme(theme: string): string {
  applyThemePreview(theme);
  localStorage.setItem("theme", theme);
  return theme;
}

/**
 * Sets and stores the player selection.
 * @param {string} player Player name.
 * @returns {string} The applied player.
 */
export function setPlayer(player: string): string {
  const theme = localStorage.getItem("theme");
  applyPreviewPlayerIcons(theme ?? defaultPlayer, player);

  localStorage.setItem("player", player);
  return player;
}