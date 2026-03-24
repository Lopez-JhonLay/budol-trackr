import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { StatusBar } from 'react-native';

// AsyncStorage is React Native’s simple, promise-based API for persisting small bits of data on a user’s device. Think of it as the mobile-app equivalent of the browser’s localStorage, but asynchronous and cross-platform.

export interface ColorScheme {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
  shadow: string;
  gradients: {
    background: [string, string];
    surface: [string, string];
    primary: [string, string];
    success: [string, string];
    warning: [string, string];
    danger: [string, string];
    muted: [string, string];
    empty: [string, string];
  };
  backgrounds: {
    input: string;
    editInput: string;
  };
  statusBarStyle: 'light-content' | 'dark-content';
}

const lightColors: ColorScheme = {
  bg: '#F4F4F5',
  surface: '#FFFFFF',
  text: '#18181B',
  textMuted: '#71717A',
  border: '#E4E4E7',
  primary: '#475569',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  shadow: '#000000',
  gradients: {
    background: ['#F4F4F5', '#E4E4E7'],
    surface: ['#FFFFFF', '#F4F4F5'],
    primary: ['#475569', '#334155'],
    success: ['#10B981', '#059669'],
    warning: ['#F59E0B', '#D97706'],
    danger: ['#EF4444', '#DC2626'],
    muted: ['#A1A1AA', '#71717A'],
    empty: ['#E4E4E7', '#D4D4D8'],
  },
  backgrounds: {
    input: '#FFFFFF',
    editInput: '#F4F4F5',
  },
  statusBarStyle: 'dark-content' as const,
};

const darkColors: ColorScheme = {
  bg: '#121212',
  surface: '#1E1E1E',
  text: '#E4E4E7',
  textMuted: '#A1A1AA',
  border: '#27272A',
  primary: '#94A3B8',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  shadow: '#000000',
  gradients: {
    background: ['#121212', '#18181B'],
    surface: ['#1E1E1E', '#27272A'],
    primary: ['#94A3B8', '#64748B'],
    success: ['#34D399', '#10B981'],
    warning: ['#FBBF24', '#F59E0B'],
    danger: ['#F87171', '#EF4444'],
    muted: ['#52525B', '#3F3F46'],
    empty: ['#27272A', '#1E1E1E'],
  },
  backgrounds: {
    input: '#1E1E1E',
    editInput: '#121212',
  },
  statusBarStyle: 'light-content' as const,
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ColorScheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('darkMode').then((value) => {
      if (value) setIsDarkMode(JSON.parse(value));
    });
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    StatusBar.setBarStyle(newMode ? 'light-content' : 'dark-content', true);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
