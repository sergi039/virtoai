import { classNamesFunction } from '@fluentui/react';
import { IPipedriveConfigStyleProps, IPipedriveConfigStyles } from './PipedriveConfig.types';

export const getStyles = (props: IPipedriveConfigStyleProps): IPipedriveConfigStyles => {
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
    entitySection: {
      marginTop: '16px'
    }
  };
};

export const getClassNames = classNamesFunction<IPipedriveConfigStyleProps, IPipedriveConfigStyles>();