export {};

const themeInputs = document.querySelectorAll('input[name="theme-radio-btn"]') as NodeListOf<HTMLInputElement>;
const previewPanel = document.querySelector('.theme-section') as HTMLElement | null;
const defaultTheme = "Code vibes theme";

/**
 * Liest alle verfuegbaren Theme-Werte aus den Radio-Inputs.
 * @returns {string[]} Liste aller Theme-Namen.
 */
function getAvailableThemes(): string[] {
    return Array.from(themeInputs).map((input) => input.value);
}

/**
 * Wendet ein Theme am Preview-Container oder am Dokument an.
 * @param {string} theme Ausgewaehlter Theme-Name.
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
 * Speichert und setzt das aktuell ausgewaehlte Theme.
 * @param {string} theme Ausgewaehlter Theme-Name.
 * @returns {string} Das gesetzte Theme.
 */
function setTheme(theme: string): string {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
    return theme;
}

/**
 * Synchronisiert die Radio-Buttons mit dem aktiven Theme.
 * @param {string} theme Aktives Theme.
 * @returns {void}
 */
function syncCheckedTheme(theme: string) {
    themeInputs.forEach((input) => {
        input.checked = input.value === theme;
    });
}

/**
 * Initialisiert die Theme-Auswahl aus Local Storage und bindet Listener.
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