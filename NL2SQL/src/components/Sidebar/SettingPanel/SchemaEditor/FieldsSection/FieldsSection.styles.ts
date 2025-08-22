import { classNamesFunction } from '@fluentui/react';
import { IFieldsSectionStyleProps, IFieldsSectionStyles } from './FieldsSection.types';

export const getStyles = (props: IFieldsSectionStyleProps): IFieldsSectionStyles => {
  const { theme } = props;

  return {
    root: {
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: theme?.palette.neutralPrimary,
    },
    commandBar: {
      root: {
        backgroundColor: theme?.palette.neutralLighter,
        border: `1px solid ${theme?.palette.neutralQuaternaryAlt}`,
        borderRadius: '4px',
        marginBottom: '8px',
      },
    },
    fieldsList: {
      root: {
        minHeight: '200px',
        border: `1px solid ${theme?.palette.neutralQuaternaryAlt}`,
        borderRadius: '4px',
        backgroundColor: theme?.palette.white,
      },
      headerWrapper: {
        backgroundColor: theme?.palette.neutralLighterAlt,
      },
    },
  };
};

export const getClassNames = classNamesFunction<IFieldsSectionStyleProps, IFieldsSectionStyles>();
