export { };

const themeInputs = document.querySelectorAll('input[name="theme-radio-btn"]') as NodeListOf<HTMLInputElement>;
const previewPanel = document.querySelector('.theme-section') as HTMLElement | null;
const defaultTheme = "Code vibes theme";

/**
 * Reads all available theme values from the radio inputs.
 * @returns {string[]} List of all theme names.
 */
function getAvailableThemes(): string[] {
    return Array.from(themeInputs).map((input) => input.value);
}

/**
 * Applies a theme to the preview container or the document.
 * @param {string} theme Selected theme name.
 * @returns {void}
 */
function applyTheme(theme: string) {
    if (previewPanel) {
        previewPanel.setAttribute("data-theme", theme);
    } else {
        document.documentElement.setAttribute("data-theme", theme);
    }
}

/**
 * Stores and applies the currently selected theme.
 * @param {string} theme Selected theme name.
 * @returns {string} The applied theme.
 */
function setTheme(theme: string): string {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
    return theme;
}

/**
 * Syncs the radio buttons with the active theme.
 * @param {string} theme Active theme.
 * @returns {void}
 */
function syncCheckedTheme(theme: string) {
    themeInputs.forEach((input) => {
        input.checked = input.value === theme;
    });
}

/**
 * Initializes theme selection from local storage and binds listeners.
 * @returns {void}
 */
function initTheme() {
    const availableThemes = getAvailableThemes();
    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme && availableThemes.includes(storedTheme) ? storedTheme : defaultTheme;

    setTheme(initialTheme);
    syncCheckedTheme(initialTheme);

    themeInputs.forEach((input) => {
        input.addEventListener("change", () => {
            if (input.checked) {
                setTheme(input.value);
                syncCheckedTheme(input.value);
            }
        });
    });
}

initTheme();