import { classNamesFunction } from '@fluentui/react';
import { ISyncTimeInputStyleProps, ISyncTimeInputStyles } from './SyncTimeInput.types';

export const getStyles = (): ISyncTimeInputStyles => {
  return {
    root: {
      width: '100%'
    },
    timeFieldGroup: {
      width: '100%'
    },
    unitDropdown: {
      width: '100%',
      marginLeft: 8
    },
    timeValueContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    }
  };
};

export const getClassNames = classNamesFunction<ISyncTimeInputStyleProps, ISyncTimeInputStyles>();