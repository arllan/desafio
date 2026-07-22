import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const isTablet = width >= 768;

export const formMaxWidth = isTablet ? 480 : '100%' as const;

export const layout = {
  isTablet,
  formMaxWidth,
  paddingH: isTablet ? 0 : 24,
};
