export const colors = {
  gradients: {
    background: ['#1F2937', '#171717'],
    accent: ['#3B82F6', '#5898FF'],
    header: ['#2A426B', '#335082'],
    gray: ['#868686', '#5B5B5B'],
  },
  brand: {
    primary: '#3B82F6',
    success: '#2CBE00',
  },
  background: {
    primary: '#171717',
    secondary: '#1F2937',
    muted: '#A3A3A3',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#BABABA',
    muted: '#94A3B8',
    placeholder: '#6B7280',
  },
  card: {
    background: '#1E293B',
    border: '#334155',
  },
  icon: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
  },
  status: {
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
  },
} as const;

export type Colors = typeof colors;
