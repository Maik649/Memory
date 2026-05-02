export {};

interface ThemePreview {
    card1: string;
    card2: string;
}

const themePreviewMap: Record<string, ThemePreview> = {
    "Code vibes theme": {
        card1: "/themes/code-vibes-card1.svg",
        card2: "/themes/code-vibes-card2.png",
    },
    "Gaming theme": {
        card1: "/themes/gaming-card1.png",
        card2: "/themes/gaming-card2.png",
    },
    "DA Projects theme": {
        card1: "/themes/da-projects-card1.png",
        card2: "/themes/da-projects-card2.png",
    },
    "Foods theme": {
        card1: "/themes/foods-card1.png",
        card2: "/themes/foods-card2.png",
    }
};

const themeInputs = document.querySelectorAll(
    'input[name="theme-radio-btn"]'
) as NodeListOf<HTMLInputElement>;
const playerInputs = document.querySelectorAll(
    'input[name="player-radio-btn"]'
) as NodeListOf<HTMLInputElement>;
const boardSizeInputs = document.querySelectorAll(
    'input[name="board-size-radio-btn"]'
) as NodeListOf<HTMLInputElement>;

const themeSection = document.querySelector(".theme-section") as HTMLElement | null;
const previewCard1 = document.querySelector(".preview-card--1") as HTMLImageElement | null;
const previewCard2 = document.querySelector(".preview-card--2") as HTMLImageElement | null;
const currentPlayerIcon = document.querySelector(".current-player img") as HTMLImageElement | null;
const navThemeValue = document.querySelector(
    '[data-settings-nav="theme"] .settings-nav__value'
) as HTMLElement | null;
const navPlayerValue = document.querySelector(
    '[data-settings-nav="player"] .settings-nav__value'
) as HTMLElement | null;
const navBoardSizeValue = document.querySelector(
    '[data-settings-nav="board-size"] .settings-nav__value'
) as HTMLElement | null;

const defaultTheme = "Code vibes theme";
const defaultPlayer = "Blue";
const defaultBoardSize = "16";
const playerIconMap: Record<string, string> = {
    Blue: "/img/label_blue.svg",
    Orange: "/img/label2.svg",
};

interface SettingsSelection {
    theme: string;
    player: string;
    boardSize: string;
}

function getCheckedValue(inputs: NodeListOf<HTMLInputElement>, fallbackValue: string): string {
    const checkedInput = Array.from(inputs).find((input) => input.checked);
    return checkedInput?.value ?? fallbackValue;
}

function syncCheckedInput(inputs: NodeListOf<HTMLInputElement>, value: string) {
    inputs.forEach((input) => {
        input.checked = input.value === value;
    });
}

function updateSettingsNavSelection(theme: string, player: string, boardSize: string) {
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

function getAvailableThemes(): string[] {
    return Array.from(themeInputs).map((input) => input.value);
}

function applyTheme(theme: string) {
    if (themeSection) {
        themeSection.setAttribute("data-theme", theme);
    } else {
        document.documentElement.setAttribute("data-theme", theme);
    }
}

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

function setTheme(theme: string): string {
    applyTheme(theme);
    applyPreviewImages(theme);
    localStorage.setItem("theme", theme);
    return theme;
}

function setPlayer(player: string): string {
    const playerIcon = playerIconMap[player];
    if (currentPlayerIcon && playerIcon) {
        currentPlayerIcon.src = playerIcon;
        currentPlayerIcon.alt = `${player} player icon`;
    }

    localStorage.setItem("player", player);
    return player;
}

function setBoardSize(boardSize: string): string {
    localStorage.setItem("boardSize", boardSize);
    return boardSize;
}

function updateSettingsNavFromInputs() {
    updateSettingsNavSelection(
        getCheckedValue(themeInputs, defaultTheme),
        getCheckedValue(playerInputs, defaultPlayer),
        getCheckedValue(boardSizeInputs, defaultBoardSize)
    );
}

function getStoredSelectionValue(
    storageKey: string,
    inputs: NodeListOf<HTMLInputElement>,
    fallbackValue: string
): string {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue && Array.from(inputs).some((input) => input.value === storedValue)
        ? storedValue
        : fallbackValue;
}

function getInitialSelection(): SettingsSelection {
    const availableThemes = getAvailableThemes();
    const storedTheme = localStorage.getItem("theme");

    return {
        theme: storedTheme && availableThemes.includes(storedTheme) ? storedTheme : defaultTheme,
        player: getStoredSelectionValue("player", playerInputs, defaultPlayer),
        boardSize: getStoredSelectionValue("boardSize", boardSizeInputs, defaultBoardSize),
    };
}

function applyInitialSelection(selection: SettingsSelection) {
    setTheme(selection.theme);
    syncCheckedInput(themeInputs, selection.theme);
    setPlayer(selection.player);
    syncCheckedInput(playerInputs, selection.player);
    setBoardSize(selection.boardSize);
    syncCheckedInput(boardSizeInputs, selection.boardSize);
    updateSettingsNavSelection(selection.theme, selection.player, selection.boardSize);
}

function bindInputChange(
    inputs: NodeListOf<HTMLInputElement>,
    onCheckedChange: (value: string) => void
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

function initSettings() {
    if (!themeInputs.length) {
        return;
    }

    const initialSelection = getInitialSelection();
    applyInitialSelection(initialSelection);
    bindSettingsListeners();
}

initSettings();
