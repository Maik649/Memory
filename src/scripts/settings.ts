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

const themeSection = document.querySelector(".theme-section") as HTMLElement | null;
const previewCard1 = document.querySelector(".preview-card--1") as HTMLImageElement | null;
const previewCard2 = document.querySelector(".preview-card--2") as HTMLImageElement | null;

const defaultTheme = "Code vibes theme";

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

function syncCheckedTheme(theme: string) {
    themeInputs.forEach((input) => {
        input.checked = input.value === theme;
    });
}

function initSettings() {
    const availableThemes = getAvailableThemes();
    const storedTheme = localStorage.getItem("theme");
    const initialTheme =
        storedTheme && availableThemes.includes(storedTheme)
            ? storedTheme
            : defaultTheme;

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

initSettings();
