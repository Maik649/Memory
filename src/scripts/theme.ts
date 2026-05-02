export {};

const themeInputs = document.querySelectorAll('input[name="theme-radio-btn"]') as NodeListOf<HTMLInputElement>;
const previewPanel = document.querySelector('.theme-section') as HTMLElement | null;
const defaultTheme = "Code vibes theme";

function getAvailableThemes(): string[] {
    return Array.from(themeInputs).map((input) => input.value);
}

function applyTheme(theme: string) {
    if (previewPanel) {
        previewPanel.setAttribute("data-theme", theme);
    } else {
        document.documentElement.setAttribute("data-theme", theme);
    }
}

function setTheme(theme: string): string {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
    return theme;
}

function syncCheckedTheme(theme: string) {
    themeInputs.forEach((input) => {
        input.checked = input.value === theme;
    });
}

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