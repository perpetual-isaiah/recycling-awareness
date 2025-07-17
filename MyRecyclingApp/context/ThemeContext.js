import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();  // <-- Add this line

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem('dark_mode');
      if (stored !== null) setDarkMode(JSON.parse(stored));
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    setDarkMode(prev => {
      AsyncStorage.setItem('dark_mode', JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
