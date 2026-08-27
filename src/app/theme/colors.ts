export const colors = {
  light: {
    primary: '#2D6A4F',       // Ayurvedic Forest Green
    primaryDark: '#1B4332',
    primaryLight: '#52B788',
    secondary: '#D8F3DC',     // Soft Sage
    accent: '#D4A373',        // Warm Herb/Earth
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#1C1917',
    textSecondary: '#78716C',
    textMuted: '#A8A29E',
    border: '#E7E5E4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    surface: '#FFFFFF',
  },
  dark: {
    primary: '#52B788',
    primaryDark: '#2D6A4F',
    primaryLight: '#74C69D',
    secondary: '#1B4332',
    accent: '#E9C46A',
    background: '#121212',
    card: '#1E1E1E',
    text: '#F5F5F4',
    textSecondary: '#A8A29E',
    textMuted: '#78716C',
    border: '#2E2E2E',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    surface: '#242424',
  },
};

export type ThemeColors = typeof colors.light;
