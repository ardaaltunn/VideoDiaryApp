export const colors = {
    light: {
        primary: '#6366f1', // Indigo
        secondary: '#8b5cf6', // Purple
        background: {
            primary: '#ffffff',
            secondary: '#f3f4f6',
            gradient: ['#e0e7ff', '#ede9fe'],
        },
        text: {
            primary: '#1f2937',
            secondary: '#4b5563',
            tertiary: '#9ca3af',
        },
        border: {
            light: '#e5e7eb',
            dark: '#d1d5db',
        },
        card: {
            background: '#ffffff',
            shadow: 'rgba(0, 0, 0, 0.1)',
        },
    },
    dark: {
        primary: '#818cf8', // Lighter Indigo
        secondary: '#a78bfa', // Lighter Purple
        background: {
            primary: '#111827',
            secondary: '#1f2937',
            gradient: ['#1e1b4b', '#3b0764'],
        },
        text: {
            primary: '#f9fafb',
            secondary: '#e5e7eb',
            tertiary: '#9ca3af',
        },
        border: {
            light: '#374151',
            dark: '#4b5563',
        },
        card: {
            background: '#1f2937',
            shadow: 'rgba(0, 0, 0, 0.3)',
        },
    },
} as const;

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 5,
    },
} as const; 