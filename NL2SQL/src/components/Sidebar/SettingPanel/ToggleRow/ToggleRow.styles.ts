import { classNamesFunction } from '@fluentui/react';
import { IToggleRowStyleProps, IToggleRowStyles } from './ToggleRow.types';

export const getStyles = (props: IToggleRowStyleProps): IToggleRowStyles => {
  return {
    root: {
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.min(3, props.togglesLength || 3)}, 1fr)`,
      gap: '8px',
      marginBottom: '16px',
      '& > *': {
        minWidth: 0
      }
    },
    toggleItem: {
      margin: 0,
      width: '100%',
      '& .ms-Toggle': {
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center'
      }
    }
  };
};

export const getClassNames = classNamesFunction<IToggleRowStyleProps, IToggleRowStyles>();