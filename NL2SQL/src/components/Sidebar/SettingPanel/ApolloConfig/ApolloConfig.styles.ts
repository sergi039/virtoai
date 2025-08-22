import { classNamesFunction } from '@fluentui/react';
import { IApolloConfigStyleProps, IApolloConfigStyles } from './ApolloConfig.types';

export const getStyles = (props: IApolloConfigStyleProps): IApolloConfigStyles => {
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

export const getClassNames = classNamesFunction<IApolloConfigStyleProps, IApolloConfigStyles>();