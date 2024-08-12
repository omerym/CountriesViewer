import { useEffect, useState } from "react";

export type theme = 'dark' | 'light';
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
/**
 * function that handle theme management(dark | light). Only call this hook in one place.
 * @param initialTheme set initial them. if not passed system default will be used.
 * @returns theme: current theme. toggleTheme: function that change current theme.
 */
export function useTheme(initialTheme?: theme): [theme, () => void] {
    const [useSystemTheme, setUseSystemTheme] = useState(initialTheme === undefined);
    const [firstCall, setFirstCall] = useState(true);
    initialTheme = initialTheme ?? getSystemTheme();
    const [_theme, _setTheme] = useState<theme>(initialTheme);
    useEffect(() => {
        if (useSystemTheme) {
            const setDefault = () => {
                setTheme(getSystemTheme());
                _setTheme(getCurrentTheme);
            }
            mediaQuery.addEventListener('change', setDefault);
            return () => {
                mediaQuery?.removeEventListener('change', setDefault);
            }
        }
    });
    if (firstCall) {
        setTheme(initialTheme);
        setFirstCall(false);
    }
    const toggleTheme = () => {
        if (useSystemTheme) {
            setUseSystemTheme(false);
        }
        const t = switchTheme();
        _setTheme(t);
    }
    return [_theme, toggleTheme];
}
export function switchTheme() {
    setTheme(getOpposite(getCurrentTheme()));
    return getCurrentTheme();
}
export function setTheme(theme: theme) {
    document.documentElement.setAttribute('data-theme', theme);
}
export function getCurrentTheme() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' ? 'dark' : 'light';
}
export function getSystemTheme() {
    const dark = mediaQuery.matches;
    return dark ? 'dark' : 'light';
}
export function getOpposite(theme: theme) {
    return theme === 'dark' ? 'light' : 'dark';
}
export default useTheme;