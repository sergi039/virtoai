import { classNamesFunction } from '@fluentui/react';
import { IFreshdeskConfigStyleProps, IFreshdeskConfigStyles } from './FreshdeskConfig.types';

export const getStyles = (props: IFreshdeskConfigStyleProps): IFreshdeskConfigStyles => {
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
    },
    toggleRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      marginBottom: '16px',
      '& > *': {
        minWidth: 0
      }
    },
    datePickerContainer: {
      display: 'flex',
      gap: '10px'
    }
  };
};

export const getClassNames = classNamesFunction<IFreshdeskConfigStyleProps, IFreshdeskConfigStyles>();