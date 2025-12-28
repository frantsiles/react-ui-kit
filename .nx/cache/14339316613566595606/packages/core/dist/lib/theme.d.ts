export type Theme = 'light' | 'dark' | 'high-contrast';
export interface ThemeConfig {
    theme: Theme;
    cssVariables: Record<string, string>;
}
export declare const themes: Record<Theme, ThemeConfig>;
export declare const applyTheme: (theme: Theme) => void;
export declare const getTheme: () => Theme;
export declare const toggleTheme: () => Theme;
//# sourceMappingURL=theme.d.ts.map