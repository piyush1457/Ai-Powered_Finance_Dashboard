import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { tokens } from '../styles/tokens';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('app-theme', 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const colors = useMemo(() => {
    const baseColors = {
      primary: tokens.colors.primary,
      primaryHover: tokens.colors.primaryHover,
      primaryLight: tokens.colors.primaryLight,
      gold: tokens.colors.gold,
      success: tokens.colors.success,
      warning: tokens.colors.warning,
      danger: tokens.colors.danger,
      info: tokens.colors.info,
      catHousing: tokens.colors.catHousing,
      catDining: tokens.colors.catDining,
      catInvestment: tokens.colors.catInvestment,
      catTransport: tokens.colors.catTransport,
      catUtilities: tokens.colors.catUtilities,
      catIncome: tokens.colors.catIncome,
    };
    const themeColors = tokens.colors[theme];
    return { ...baseColors, ...themeColors };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
