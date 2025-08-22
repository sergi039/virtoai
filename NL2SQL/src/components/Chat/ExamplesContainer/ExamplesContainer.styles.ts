import { classNamesFunction } from '@fluentui/react';
import type { IExamplesContainerStyleProps, IExamplesContainerStyles } from './ExamplesContainer.types';

export const getStyles = (props: IExamplesContainerStyleProps): IExamplesContainerStyles => {
  const { theme } = props;

  return {
    root: {
      maxWidth: '800px',
      width: '100%',
      margin: '0px auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
    },
    grid: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '12px',
      width: '100%',
    },
    example: {
      backgroundColor: '#f5f5f5',
      padding: '8px 16px',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: `1px solid ${theme?.palette.neutralLight}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      selectors: {
        ':hover': {
          backgroundColor: '#e8e8e8',
        },
      },
    },
    exampleTitle: {
      fontWeight: 500,
      fontSize: '14px',
      color: theme?.palette.neutralPrimary,
      margin: 0,
    },
    exampleText: {
      display: 'none', 
    },
  };
};

export const getClassNames = classNamesFunction<IExamplesContainerStyleProps, IExamplesContainerStyles>();