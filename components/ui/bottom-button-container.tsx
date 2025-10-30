import { colors } from '@/constants/colors';
import React from 'react';
import { Platform, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomButtonContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  backgroundColor?: string;
  padding?: number;
  position?: 'absolute' | 'relative';
  addTopBorder?: boolean;
  addShadow?: boolean;
}

export const BottomButtonContainer: React.FC<BottomButtonContainerProps> = ({
  children,
  className = '',
  style,
  backgroundColor = colors.background.primary,
  padding = 20,
  position = 'absolute',
  addTopBorder = false,
  addShadow = false,
}) => {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    padding,
    paddingBottom: Platform.OS === 'ios' ? insets.bottom + 20 : 20,
    backgroundColor,
    position,
    ...(position === 'absolute' && {
      bottom: 0,
      left: 0,
      right: 0,
    }),
    ...(addTopBorder && {
      borderTopWidth: 1,
      borderTopColor: colors.card.border,
    }),
    ...(addShadow &&
      Platform.OS === 'ios' && {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }),
    ...(addShadow &&
      Platform.OS === 'android' && {
        elevation: 8,
      }),
    ...style,
  };

  return (
    <View style={containerStyle} className={className}>
      {children}
    </View>
  );
};
