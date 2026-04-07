import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const toggleDark = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('darkMode', newValue);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}