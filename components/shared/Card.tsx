import React, { forwardRef } from 'react';
import { Pressable, View, StyleSheet, ViewStyle, PressableProps, StyleProp } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import Animated from 'react-native-reanimated';

interface CardProps extends PressableProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const Card = forwardRef<View, CardProps>(({ children, style, ...props }, ref) => {
    const { colors, isDark } = useTheme();

    return (
        <Pressable
            ref={ref}
            style={({ pressed }) => [
                styles.card,
                {
                    backgroundColor: colors.background.secondary,
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                },
                style,
            ]}
            {...props}
        >
            {children}
        </Pressable>
    );
});

Card.displayName = 'Card';

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
    },
}); 