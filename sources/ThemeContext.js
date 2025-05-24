import React, { createContext, useState, useContext } from 'react';

const fonts = [
  { label: 'Mặc định', value: 'System' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Monospace', value: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
];

const ThemeContext = createContext({
  font: 'System',
  setFont: () => {},
  fonts,
});

export const ThemeProvider = ({ children }) => {
  const [font, setFont] = useState('System');

  return (
    <ThemeContext.Provider value={{ font, setFont, fonts }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 