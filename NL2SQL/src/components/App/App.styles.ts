import { classNamesFunction } from '@fluentui/react';
import type { IAppStyleProps, IAppStyles } from './App.types';

export const getStyles = (props: IAppStyleProps): IAppStyles => {
  const { theme } = props;

  return {
    root: {
      backgroundColor: theme?.palette.white,
      fontFamily: "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      overflow: 'hidden',
    },
    containerLoading: {
      root: {
        height: '100vh'
      }
    }
  };
};

export const getClassNames = classNamesFunction<IAppStyleProps, IAppStyles>();