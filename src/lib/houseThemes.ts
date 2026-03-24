// House-specific colors and themes
export const HOUSE_COLORS = {
  aravali: {
    name: 'Aravali',
    primary: '#2563eb', // Blue
    secondary: '#dbeafe',
    accent: '#1e40af',
    light: '#eff6ff',
    dark: '#1e3a8a',
    gradient: 'from-blue-600 to-blue-800',
    text: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  neelgiri: {
    name: 'Neelgiri',
    primary: '#16a34a', // Green
    secondary: '#dcfce7',
    accent: '#15803d',
    light: '#f0fdf4',
    dark: '#166534',
    gradient: 'from-green-600 to-green-800',
    text: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  shiwalik: {
    name: 'Shiwalik',
    primary: '#dc2626', // Red
    secondary: '#fee2e2',
    accent: '#b91c1c',
    light: '#fef2f2',
    dark: '#991b1b',
    gradient: 'from-red-600 to-red-800',
    text: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  udaygiri: {
    name: 'Udaygiri',
    primary: '#eab308', // Yellow
    secondary: '#fef3c7',
    accent: '#ca8a04',
    light: '#fffbeb',
    dark: '#854d0e',
    gradient: 'from-yellow-500 to-yellow-700',
    text: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
  },
};

export type HouseName = 'aravali' | 'neelgiri' | 'shiwalik' | 'udaygiri';

export const getHouseColor = (house: string): (typeof HOUSE_COLORS)[HouseName] => {
  const houseKey = house?.toLowerCase() as HouseName;
  return HOUSE_COLORS[houseKey] || HOUSE_COLORS.aravali;
};
