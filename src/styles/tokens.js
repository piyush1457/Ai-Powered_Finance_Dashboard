export const tokens = {
  colors: {
    // Brand
    primary: '#4f9cf9',
    primaryHover: '#6aaaff',
    primaryLight: '#4f9cf920',
    gold: '#f5c842',
    red: '#ff5252',
    green: '#00e5c0',
    purple: '#a78bfa',
    
    // Dark theme
    dark: {
      bg: '#0a0c10',
      surface: '#111318',
      surfaceElevated: '#181c24',
      surfaceHighlight: '#1e2330',
      border: '#ffffff0f',
      border2: '#ffffff18',
      textPrimary: '#e8eaf0',
      textSecondary: '#8b909e',
      textMuted: '#555b6a',
    },
    
    // Light theme
    light: {
      bg: '#f4f5f7',
      surface: '#ffffff',
      surfaceElevated: '#f0f1f4',
      surfaceHighlight: '#e4e6ea',
      border: '#e2e4e9',
      border2: '#d0d4dc',
      textPrimary: '#111318',
      textSecondary: '#4a5060',
      textMuted: '#9098a8',
    },
    
    // Semantic
    success: '#00e5c0',
    warning: '#f5c842',
    danger: '#ff5252',
    info: '#4f9cf9',
    
    // Categories
    catHousing: '#7eb8fd',
    catDining: '#c4b5fd',
    catInvestment: '#5ff5d8',
    catTransport: '#fad97a',
    catUtilities: '#a78bfa',
    catIncome: '#00e5c0',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 },
  typography: {
    display: { fontFamily: '"Playfair Display", serif', fontSize: 32, fontWeight: '600', letterSpacing: -0.5, lineHeight: 36 },
    h1: { fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: '600' },
    h2: { fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: '600', lineHeight: 29 },
    h3: { fontFamily: '"DM Sans", sans-serif', fontSize: 18, fontWeight: '600' },
    h4: { fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: '600' },
    bodyLg: { fontFamily: '"DM Sans", sans-serif', fontSize: 16, fontWeight: '400' },
    body: { fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: '400', lineHeight: 21 },
    caption: { fontFamily: '"DM Sans", sans-serif', fontSize: 12.5, fontWeight: '400' },
    label: { fontFamily: '"DM Sans", sans-serif', fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
    mono: { fontFamily: '"DM Mono", monospace' }
  },
  radius: { sm: 6, md: 9, lg: 14, xl: 20, full: 9999 },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 25px rgba(0,0,0,0.15)',
  }
};
