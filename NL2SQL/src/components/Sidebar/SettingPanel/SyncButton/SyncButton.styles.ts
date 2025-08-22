import { classNamesFunction } from '@fluentui/react';
import { ISyncButtonStyleProps, ISyncButtonStyles } from './SyncButton.types';

export const getStyles = (props: ISyncButtonStyleProps): ISyncButtonStyles => {
  const { theme } = props;

  return {
    root: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '16px'
    },
    button: {
      marginTop: '16px',
      width: 'auto',
      padding: '0 16px',
      height: '32px',
      minWidth: '120px',
      fontSize: '14px',
      fontWeight: '400',
      backgroundColor: theme?.palette.themePrimary,
      color: theme?.palette.white,
      border: 'none',
      borderRadius: '2px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      selectors: {
        '&:hover': {
          backgroundColor: theme?.palette.themeLighter 
        }
      }
    }
  };
};

export const getClassNames = classNamesFunction<ISyncButtonStyleProps, ISyncButtonStyles>();