import { useMemo } from 'react';
import { useAppTheme } from './useAppTheme';
import { AppTheme } from '../theme/themes';

export const useStyles = <T>(createStylesFn: (theme: AppTheme) => T): T => {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStylesFn(theme), [theme]);
  return styles;
};
