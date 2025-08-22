import { classNamesFunction } from '@fluentui/react';
import type { ISidebarStyleProps, ISidebarStyles } from './Sidebar.types';

export const getStyles = (props: ISidebarStyleProps): ISidebarStyles => {
  const { theme } = props;

  return {
    root: {
      width: '260px',
      backgroundColor: theme?.palette.themeDark,
      color: theme?.palette.white,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0
    },
  };
};

export const getClassNames = classNamesFunction<ISidebarStyleProps, ISidebarStyles>();