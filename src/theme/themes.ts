export type AppTheme = {
  background: string;
  card: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentSoft: string;
  success: string;
  danger: string;
  buttonPrimary: string;
  buttonPrimaryPressed: string;
  divider: string;
  overlay: string;
};

export const darkTheme: AppTheme = {
  background: '#0A0A0B',
  card: '#111214',
  border: '#1F2226',

  textPrimary: '#EDEDED',
  textSecondary: '#6B6F76',

  accent: '#3B82F6',
  accentSoft: '#1F3A5F',

  success: '#2E7D4F',
  danger: '#B23A3A',

  buttonPrimary: '#3B82F6',
  buttonPrimaryPressed: '#2563EB',

  divider: '#1A1D21',
  overlay: '#121821',
};

export const lightTheme: AppTheme = {
  background: '#F4F5F7',
  card: '#FFFFFF',
  border: '#E2E5E9',

  textPrimary: '#1C1E21',
  textSecondary: '#6B6F76',

  accent: '#3B82F6',
  accentSoft: '#DCE7F9',

  success: '#3A7D5C',
  danger: '#B04343',

  buttonPrimary: '#3B82F6',
  buttonPrimaryPressed: '#2563EB',

  divider: '#E6E8EB',
  overlay: '#E9EEF5',
};
