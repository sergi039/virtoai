import { classNamesFunction } from '@fluentui/react';
import { IChatItemStyleProps, IChatItemStyles } from './ChatItem.types';

export const getStyles = (props: IChatItemStyleProps): IChatItemStyles => {
  const { isActive, theme, showActions, shouldShowPeopleButton } = props;

  return {
    root: {
      root: {
        padding: '10px 10px',
        marginBottom: '8px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isActive ? theme.palette.themeDarker : 'transparent',
        selectors: {
          ':hover': {
            backgroundColor: isActive ? theme.palette.themeDarker : theme.palette.themeTertiary,
            '.chat-item-actions': {
              opacity: 1,
              visibility: 'visible',
            },
            '.chat-users-container': {
              opacity: 1,
              visibility: 'visible',
            },
          },
          '&.active': {
            backgroundColor: theme.palette.themeDarker,
          },
        },
      },
    },
    editTitle: {
      root: {
        flex: 1,
        backgroundColor: 'transparent',
        marginRight: 8,
      },
      field: {
        backgroundColor: 'transparent',
        color: theme.palette.white,
        borderColor: theme.palette.themePrimary,
        borderBottom: `1px solid ${theme.palette.white}`,
      },
      fieldGroup: {
        border: 'none',
        backgroundColor: 'transparent',
        selectors: {
          '&.ms-TextField-fieldGroup--is-active': {
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
    text: {
      root: {
        color: theme.palette.white,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
        minWidth: 0, 
        maxWidth: '100px', 
      },
    },
    actions: {
      root: {
        display: 'flex',
        opacity: showActions ? 1 : 0,
        visibility: showActions ? 'visible' : 'hidden',
        transition: 'opacity 0.2s, visibility 0.2s',
      },
    },
    actionButton: {
      root: {
        background: 'none !important',
        border: 'none !important',
        color: theme.palette.neutralTertiary,
        minWidth: '16px',
        height: '24px',
        '& button': {
          background: 'none !important',
          border: 'none !important',
          selectors: {
            ':hover': {
              backgroundColor: `${theme.palette.themeDarker} !important`,
              color: `${theme.palette.white} !important`,
            },
            ':active': {
              backgroundColor: `${theme.palette.themeDarker} !important`,
              color: `${theme.palette.white} !important`,
            },
            ':focus': {
              backgroundColor: `${theme.palette.themeDarker} !important`,
              outline: 'none !important',
              boxShadow: 'none !important',
            },
            ':focus-visible': {
              backgroundColor: `${theme.palette.themeDarker} !important`,
              outline: 'none !important',
              boxShadow: 'none !important',
            },
          },
        },
      },
      icon: {
        fontSize: '12px',
        color: 'inherit',
      },
      iconHovered: {
        color: theme.palette.white,
        backgroundColor: 'none !important',
      },
    },
    icon: {
      root: {
        fontSize: '16px',
        marginRight: '8px',
        color: theme.palette.neutralLighter,
      },
    },
    chatContentContainer: {
      root: {
        flex: 1,
      },
    },
    chatTitleContainer: {
      root: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        minWidth: 0, 
      },
    },
    usersIconContainer: {
      root: {
        marginLeft: '8px',
        alignItems: 'center',
        flexShrink: 0, 
        opacity: shouldShowPeopleButton ? 1 : 0,
        visibility: shouldShowPeopleButton ? 'visible' : 'hidden',
        transition: 'opacity 0.2s, visibility 0.2s',
      },
    },
    usersActionButton: {
      root: {
        background: 'none !important',
        border: 'none !important',
        color: theme.palette.neutralTertiary,
        minWidth: '16px',
        height: '24px',
        '& button': {
          background: 'none !important',
          border: 'none !important',
          selectors: {
            ':hover': {
              backgroundColor: `${theme.palette.themeDarker} !important`,
              color: `${theme.palette.white} !important`,
            },
            ':active': {
              backgroundColor: `${theme.palette.themeDarker} !important`,
              color: `${theme.palette.white} !important`,
            },
            ':focus': {
              backgroundColor: `${theme.palette.themeDarker} !important`,
              outline: 'none !important',
              boxShadow: 'none !important',
            },
            ':focus-visible': {
              backgroundColor: `${theme.palette.themeDarker} !important`,
              outline: 'none !important',
              boxShadow: 'none !important',
            },
          },
        },
      },
      icon: {
        fontSize: '12px',
        color: 'inherit',
      },
      iconHovered: {
        color: theme.palette.white,
        backgroundColor: 'none !important',
      },
    },
    usersIcon: {
      root: {
        fontSize: '12px',
        color: theme.palette.themePrimary,
        marginRight: '4px',
      },
    },
    usersCountText: {
      root: {
        fontSize: '11px',
        color: theme.palette.neutralTertiary,
        fontWeight: '500',
        marginLeft: '-7px',
      },
    },
  };
};

export const getClassNames = classNamesFunction<IChatItemStyleProps, IChatItemStyles>();