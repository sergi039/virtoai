import type { IChatUsersTooltipStyleProps, IChatUsersTooltipStyles } from './ChatUsersTooltip.types';
import { classNamesFunction } from '@fluentui/react';

export const getStyles = (props: IChatUsersTooltipStyleProps): IChatUsersTooltipStyles => {
  const { theme } = props;

  return {
    content: {
      width: '320px',
      maxHeight: '400px',
      padding: '12px',
      backgroundColor: theme.palette.white,
      border: `1px solid ${theme.palette.neutralLight}`,
      borderRadius: '4px',
      boxShadow: theme.effects.elevation8,
    },
    header: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '12px',
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      flex: 1,
    },
    backIcon: {
      cursor: 'pointer',
      marginRight: '8px',
      fontSize: '14px',
    },
    searchBox: {
      marginBottom: '8px',
    },
    usersList: {
      maxHeight: '200px',
      overflowY: 'auto',
      marginBottom: '12px',
    },
    userItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
      borderRadius: '4px',
      marginBottom: '4px',
      transition: 'background-color 0.1s ease',
      selectors: {
        ':hover': {
          backgroundColor: theme.palette.neutralLighter,
        },
        ':hover .remove-user-icon': {
          opacity: 1,
          visibility: 'visible',
        }
      }
    },
    userItemSelected: {
      backgroundColor: theme.palette.themeLight,
    },
    selectableUserItem: {
      cursor: 'pointer',
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      marginRight: '12px',
      backgroundColor: theme.palette.themePrimary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.white,
      fontSize: '12px',
      fontWeight: '600',
      flexShrink: 0,
    },
    userInfo: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    userName: {
      fontSize: '15px',
      fontWeight: '500',
      color: theme.palette.neutralPrimary,
      marginBottom: '2px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    userEmail: {
      fontSize: '13px',
      color: theme.palette.neutralSecondary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    userRole: {
      fontSize: '12px',
      color: theme.palette.neutralSecondary,
      fontStyle: 'italic',
    },
    footer: {
      display: 'flex',
      justifyContent: 'center',
      borderTop: `1px solid ${theme.palette.neutralLight}`,
      paddingTop: '8px',
    },
    selectedCount: {
      fontSize: '12px',
      color: theme.palette.neutralSecondary,
    },
    actions: {
      display: 'flex',
      gap: '6px',
    },
    removeUserIcon: {
      fontSize: '12px',
      color: theme.palette.neutralSecondary,
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '2px',
      transition: 'all 0.1s ease',
      opacity: 0,
      visibility: 'hidden',
      selectors: {
        ':hover': {
          color: theme.palette.red,
        }
      }
    },
    closeIcon: {
      fontSize: '12px',
      color: theme.palette.neutralSecondary,
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '2px',
      transition: 'all 0.1s ease',
      selectors: {
        ':hover': {
          color: theme.palette.neutralPrimary,
          backgroundColor: theme.palette.neutralLighter,
        }
      }
    },
    searchInput: {
      root: {
        marginBottom: '8px'
      },
      field: {
        fontSize: '14px',
        padding: '6px 8px'
      }
    },
    searchText: {
      root: {
        textAlign: 'center',
        color: theme.palette.neutralSecondary,
        fontSize: '12px',
        padding: '12px'
      }
    },
    iconCheck: {
      root: {
        color: theme.palette.themePrimary,
        fontSize: '12px',
      }
    },
    saveButton: {
      root: {
        fontSize: '12px',
        padding: '4px 12px',
        minWidth: '60px',
        height: '28px',
      },
      label: {
        fontSize: '12px',
      }
    },
    cancelButton: {
      root: {
        fontSize: '12px',
        padding: '4px 12px',
        minWidth: '60px',
        height: '28px',
      },
      label: {
        fontSize: '12px',
      }
    },
    addButton: {
      root: {
        fontSize: '12px',
        padding: '4px 12px',
        minWidth: '80px',
        height: '28px',
        marginRight: '6px',
      },
      label: {
        fontSize: '12px',
      }
    },
    leaveButton: {
      root: {
        fontSize: '12px',
        padding: '4px 12px',
        minWidth: '60px',
        height: '28px',
      },
      label: {
        fontSize: '12px',
      }
    }
  };
};

export const getClassNames = classNamesFunction<IChatUsersTooltipStyleProps, IChatUsersTooltipStyles>();
