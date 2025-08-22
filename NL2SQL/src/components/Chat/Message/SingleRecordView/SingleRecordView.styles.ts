import type { ISingleRecordViewStyleProps, ISingleRecordViewStyles } from './SingleRecordView.types';

export const getStyles = (props: ISingleRecordViewStyleProps): ISingleRecordViewStyles => {
  const { theme } = props;

  return {
    containerSingleMessage: {
      backgroundColor: theme.palette.neutralLighterAlt,
      border: `1px solid ${theme.palette.neutralLight}`,
      borderRadius: '8px',
      padding: '16px',
    },
    fieldContainerSingleMessage: {
      padding: '8px 0',
      borderBottom: `1px solid ${theme.palette.neutralLighter}`,
      ':last-child': {
        borderBottom: 'none',
      },
    },
    fieldLabelSingleMessage: {
      minWidth: '120px',
      fontWeight: '600',
      color: theme.palette.neutralPrimary,
      marginRight: '12px',
    },
    fieldValueSingleMessage: {
      color: theme.palette.neutralSecondary,
      wordBreak: 'break-word',
    },
    redirectText: {
      color: theme.palette.themePrimary,
      cursor: 'pointer',
      textDecoration: 'underline',
      ':hover': {
        color: theme.palette.themeDarkAlt,
      },
    },
  };
};
