import { classNamesFunction } from '@fluentui/react';
import { IOrttoConfigStyleProps, IOrttoConfigStyles } from './OrttoConfig.types';

export const getStyles = (props: IOrttoConfigStyleProps): IOrttoConfigStyles => {
  const { theme } = props;

  return {
    configBox: {
      padding: '16px',
      marginTop: '12px',
      backgroundColor: theme?.palette.white,
    },
    twoColumnContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px',
    },
    columnItem: {
      width: '100%',
    },
    formGroup: {
      marginBottom: '12px',
    }
  };
};

export const getClassNames = classNamesFunction<IOrttoConfigStyleProps, IOrttoConfigStyles>();