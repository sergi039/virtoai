import { classNamesFunction, keyframes } from '@fluentui/react';
import type { IMessageStyleProps, IMessageStyles } from './Message.types';

const dotAnimation = keyframes({
  '0%': { opacity: 0.3 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.3 }
});

const pulseAnimation = keyframes({
  '0%': { opacity: 0.6 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.6 }
});

export const getStyles = (props: IMessageStyleProps): IMessageStyles => {
  const { theme, isUser } = props;

  return {
    root: {
      padding: '16px 0',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme?.palette.white,
      alignItems: isUser ? 'flex-end' : 'flex-start',
    },
    contentUser: {
      maxWidth: '500px',
      width: 'fit-content',
      margin: '5px 10px',
      marginBottom: '20px',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      color: theme?.palette.black,
      padding: '12px 15px',
      borderRadius: '20px',
      backgroundColor: theme?.palette.neutralLighter,
    },
    contentAI: {
      maxWidth: '1450px',
      width: '100%',
      margin: '5px 9px',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      color: theme?.palette.black,
    },
    userMessageContainer: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      width: '100%',
      maxWidth: '500px',
    },
    userMessageCopyButton: {
      position: 'absolute',
      bottom: '-8px',
      right: '10px',
      padding: '6px 8px',
      opacity: 0,
      transform: 'translateY(-4px)',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      selectors: {
        ':hover': {
          color: theme?.palette.themePrimary,
        },
      },
    },
    userMessageCopyIcon: {
      fontSize: '16px',
      color: theme?.palette.neutralSecondary,
      transition: 'color 0.2s ease',
      selectors: {
        ':hover': {
          color: theme?.palette.themePrimary,
        },
      },
    },
    redirectText: {
      cursor: 'pointer',
      color: theme?.palette.themeLighter,
      textDecoration: 'underline',
      wordBreak: 'break-word',
    },
    userMessageCopyButtonVisible: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    buttonRow: {
      display: 'flex',
      gap: '8px',
      padding: '8px 0',
      marginTop: '8px',
      justifyContent: 'flex-start',
      borderTop: `1px solid ${theme?.palette.neutralLighter}`,
    },
    iconButton: {
      fontSize: '16px',
      color: theme?.palette.neutralSecondary,
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      selectors: {
        ':hover': {
          color: theme?.palette.themePrimary,
        },
      },
    },
    iconButtonActive: {
      color: theme?.palette.themeDark,
      selectors: {
        ':hover': {
          color: theme?.palette.themeLighter,
        },
      },
    },
    iconButtonFeedbackActive: {
      root: {
        color: theme?.palette.themePrimary,
        ':hover': {
          color: theme?.palette.themeDarker,
        },
        backgroundComposite: theme?.palette.themeLighter,
      },
    },
    pageButton: {
      root: {
        minWidth: '28px',
        height: '28px',
        padding: '0',
        margin: '0 2px',
        borderRadius: '3px',
        fontSize: '12px',
      },
      rootChecked: {
        backgroundColor: theme?.palette.themePrimary,
        color: 'white'
      },
      rootHovered: {
        backgroundColor: theme?.palette.themePrimary,
      },
    },
    messageEmptyData: {
      root: {
        padding: '4px 6px',
        backgroundColor: theme?.palette.neutralLighter,
        borderRadius: '13px',
      },
      innerText: {
        padding: '1px 0px',
        fontSize: '14px',
      },
      icon: {
        fontSize: '17px',
      },
    },
    navButtonStyles: {
      root: {
        width: '24px',
        height: '24px',
        padding: 0,
        minWidth: 'auto',
        fontSize: '10px'
      },
      icon: {
        fontSize: '10px',
        margin: 0
      }
    },
    containerSingleMessage: {
      padding: '16px',
      border: `1px solid ${theme?.palette.neutralLight}`,
      borderRadius: '4px',
      backgroundColor: theme?.palette.white,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
      marginTop: '8px',
    },
    fieldContainerSingleMessage: {
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
      marginTop: '8px',
      paddingBottom: '10px',
      borderBottom: `1px solid ${theme?.palette.neutralLighter}`,
      selectors: {
        '&:last-child': {
          borderBottom: 'none',
          paddingBottom: '0'
        }
      }
    },
    fieldLabelSingleMessage: {
      fontWeight: 600,
      width: 150,
      color: theme?.palette.neutralPrimary
    },
    fieldValueSingleMessage: {
      color: theme?.palette.neutralSecondary,
      overflowWrap: 'break-word',
      flex: 1
    },
    sqlEditorContainer: {
      width: '99%',
      marginLeft: '7px',
      marginRight: '10px',
      backgroundColor: theme?.palette.white,
      borderRadius: '4px',
      border: `1px solid ${theme?.palette.neutralLighter}`,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.3s ease-in-out',
      opacity: 1,
      maxHeight: '500px',
      overflow: 'hidden',
    },
    sqlEditorContainerHidden: {
      opacity: 0,
      maxHeight: 0,
      padding: 0,
      margin: 0,
      border: 'none',
    },
    sqlEditorActions: {
      display: 'flex',
      gap: '8px',
      width: '6%',
      alignItems: 'center',
      flexShrink: 0
    },
    sqlEditorTextField: {
      root: {
        width: '100%',
        flex: '1 1 auto'
      },
      field: {
        fontFamily: 'Consolas, monospace',
        fontSize: '14px',
        padding: '8px 12px',
        backgroundColor: theme?.palette.white,
        height: 'auto',
        minHeight: '36px',
        maxHeight: '120px',
        resize: 'none',
        transition: 'background-color 0.2s ease'
      },
      fieldGroup: {
        border: 'none',
        selectors: {
          '&.ms-TextField-fieldGroup--is-active': {
            borderColor: 'transparent',
            boxShadow: 'none',
            outline: 'none',
          },
          '&:after': {
            borderColor: 'transparent',
            boxShadow: 'none',
          },
        },
      },
    },
    tableContainer: {
      width: '100%',
      overflowX: 'auto',
      display: 'block',
      border: `1px solid ${theme?.palette.neutralLight}`,
      borderRadius: '4px',
      backgroundColor: theme?.palette.white,
      minWidth: 0,
      maxWidth: '100vw',
      marginTop: '8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
    },
    detailsList: {
      root: {
        minWidth: 'max-content',
        width: '100%',
        overflowX: 'auto',
        display: 'block',
      },
      headerWrapper: {
        backgroundColor: theme?.palette.neutralLighter,
        borderBottom: `2px solid ${theme?.palette.neutralLight}`,
      },
      contentWrapper: {
        overflow: 'visible',
      },
      focusZone: {
        width: '100%',
        overflow: 'visible',
      },
    },
    sqlEditorReadOnly: {
      fontFamily: 'Consolas, monospace',
      whiteSpace: 'pre-wrap',
      padding: '8px 12px',
      backgroundColor: theme?.palette.white,
      border: `1px solid ${theme?.palette.neutralLight}`,
      borderRadius: '2px',
      minHeight: '36px',
      maxHeight: '120px',
      overflowY: 'auto',
      flex: '1 1 auto',
      width: '100%',
      transition: 'all 0.2s ease'
    },
    loadingDots: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: '2px',
      padding: '20px',
      minHeight: '60px',
    },
    pivotStyles: {
      root: {
        marginTop: '8px',
      },
      link: {
        fontSize: '14px',
        fontWeight: '400',
        color: theme?.palette.neutralSecondary,
        position: 'relative',
        selectors: {
          ':hover': {
            color: theme?.palette.themePrimary,
          },
          '&[aria-selected="true"]': {
            fontWeight: '600',
            color: theme?.palette.themePrimary,
          },
        },
      },
      linkIsSelected: {
        fontSize: '14px',
        fontWeight: '600',
        color: theme?.palette.themePrimary,
        selectors: {
          ':before': {
            backgroundColor: theme?.palette.themePrimary,
          },
        },
      },
    },
    pivotItemStyles: {
      root: {
        marginTop: '16px',
      },
    },
    loadingDot: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: theme?.palette.themePrimary,
      animationName: dotAnimation,
      animationDuration: '1.4s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-in-out',
      selectors: {
        '&:nth-child(1)': {
          animationDelay: '0s',
        },
        '&:nth-child(2)': {
          animationDelay: '0.2s',
        },
        '&:nth-child(3)': {
          animationDelay: '0.4s',
        },
      },
    },
    loadingTabContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      minHeight: '120px',
      backgroundColor: theme?.palette.neutralLighterAlt,
      borderRadius: '4px',
      border: `1px solid ${theme?.palette.neutralLight}`,
      animationName: pulseAnimation,
      animationDuration: '2s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-in-out',
    },
    aiQuestionContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '16px',
      backgroundColor: theme?.palette.white,
      borderRadius: '4px',
      border: `1px solid ${theme?.palette.neutralLight}`,
      marginBottom: '16px',
      width: '98%',
      maxWidth: '100%',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
    },
    aiQuestionIcon: {
      fontSize: '16px',
      color: theme?.palette.themePrimary,
      marginRight: '8px',
      flexShrink: 0,
    },
    aiQuestionContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    aiQuestionText: {
      fontSize: '14px',
      fontWeight: '500',
      color: theme?.palette.neutralPrimary,
      lineHeight: '1.4',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      margin: 0,
      padding: '4px 0',
    },
    suggestionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '12px 16px',
      backgroundColor: theme?.palette.neutralLighterAlt,
      borderRadius: '4px',
      border: `1px solid ${theme?.palette.neutralLight}`,
      marginBottom: '16px',
      width: '100%',
      maxWidth: '100%',
    },
    suggestionsTitle: {
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '8px',
      color: theme?.palette.neutralPrimary,
      margin: '0 0 8px 0',
      padding: 0,
    },
    suggestionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    suggestionButton: {
      root: {
        padding: '8px 12px',
        backgroundColor: theme?.palette.white,
        border: `1px solid ${theme?.palette.neutralTertiary}`,
        borderRadius: '4px',
        color: theme?.palette.neutralPrimary,
        fontSize: '13px',
        fontWeight: '400',
        maxWidth: '30%',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'left',
        justifyContent: 'flex-start',
        minHeight: '32px',
        width: '100%',
        selectors: {
          ':hover': {
            backgroundColor: theme?.palette.neutralLighter,
            borderColor: theme?.palette.themePrimary,
            color: theme?.palette.themePrimary,
          },
          ':focus': {
            borderColor: theme?.palette.themePrimary,
            outline: 'none',
          },
        },
      },
      label: {
        textAlign: 'left',
        justifyContent: 'flex-start',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      },
    },
    suggestionButtonDisabled: {
      root: {
        padding: '8px 12px',
        backgroundColor: theme?.palette.neutralLighter,
        border: `1px solid ${theme?.palette.neutralTertiary}`,
        borderRadius: '4px',
        color: theme?.palette.neutralTertiary,
        fontSize: '13px',
        fontWeight: '400',
        maxWidth: '30%',
        cursor: 'not-allowed',
        textAlign: 'left',
        justifyContent: 'flex-start',
        minHeight: '32px',
        width: '100%',
        opacity: 0.6,
        selectors: {
          ':hover': {
            backgroundColor: theme?.palette.neutralLighter,
            borderColor: theme?.palette.neutralTertiary,
            color: theme?.palette.neutralTertiary,
          },
        },
      },
      label: {
        textAlign: 'left',
        justifyContent: 'flex-start',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      },
    },
    questionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '12px 16px',
      backgroundColor: theme?.palette.neutralLighterAlt,
      borderRadius: '8px',
      border: `1px solid ${theme?.palette.neutralLight}`,
      marginBottom: '16px',
      width: '100%',
      maxWidth: '100%',
    },
    questionsTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      color: theme?.palette.themePrimary,
      margin: '0 0 8px 0',
      padding: 0,
    },
    suggestionsTextContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '12px 16px',
      backgroundColor: theme?.palette.themeLighterAlt,
      borderRadius: '8px',
      border: `1px solid ${theme?.palette.themeLight}`,
      marginTop: '12px',
      width: '100%',
      maxWidth: '100%',
    },
    suggestionsTextTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      color: theme?.palette.themePrimary,
      margin: '0 0 8px 0',
      padding: 0,
    },
    suggestionsTextList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    suggestionTextItem: {
      fontSize: '13px',
      fontWeight: '400',
      color: theme?.palette.neutralSecondary,
      lineHeight: '1.4',
      padding: '6px 8px',
      borderRadius: '4px',
      backgroundColor: 'transparent',
      border: 'none',
      wordBreak: 'break-word',
      whiteSpace: 'normal',
    },
    suggestionTextItemClickable: {
      fontSize: '13px',
      fontWeight: '400',
      color: theme?.palette.neutralDark,
      lineHeight: '1.4',
      padding: '6px 8px',
      borderRadius: '4px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      wordBreak: 'break-word',
      whiteSpace: 'normal',
      transition: 'all 0.15s ease',
    },
  };
};

export const getClassNames = classNamesFunction<IMessageStyleProps, IMessageStyles>();