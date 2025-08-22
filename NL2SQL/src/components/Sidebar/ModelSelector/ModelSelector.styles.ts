import { classNamesFunction } from '@fluentui/react';
import type { IModelSelectorStyleProps, IModelSelectorStyles } from './ModelSelector.types';
import { IDropdownStyles } from '@fluentui/react/lib/Dropdown';

export const getStyles = (props: IModelSelectorStyleProps): IModelSelectorStyles => {
    const { theme } = props;

    const dropdownStyles: Partial<IDropdownStyles> = {
        root: {
            width: '100%',
            fontSize: '14px',
        },
        dropdown: {
            border: `1px solid ${theme?.palette.neutralQuaternary}`,
            borderRadius: '6px',
            backgroundColor: theme?.palette.themeDark,
            color: theme?.palette.white,
            selectors: {
                ':hover': {
                    backgroundColor: theme?.palette.themeTertiary,
                    color: theme?.palette.white,
                },
                ':focus': {
                    outline: 'none',
                },
                ':focus-within': {
                    borderColor: theme?.palette.neutralQuaternary,
                },
            },
        },
        title: {
            border: 'none',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            color: `${theme?.palette.white} !important`,
            height: '100%',
            padding: '5px 12px',
            fontSize: '14px',
            selectors: {
                ':hover': {
                    backgroundColor: `${theme?.palette.themeTertiary} !important`,
                    color: `${theme?.palette.white} !important`,
                },
                ':active': {
                    backgroundColor: `${theme?.palette.themeTertiary} !important`,
                    color: `${theme?.palette.white} !important`,
                },
            },
        },
        caretDown: {
            color: `${theme?.palette.white} !important`,
            fontSize: '12px',
        },
        dropdownItem: {
            backgroundColor: theme?.palette.neutralDark,
            color: `${theme?.palette.white} !important`,
            selectors: {
                ':hover': {
                    backgroundColor: `${theme?.palette.themeSecondary} !important`,
                    color: `${theme?.palette.white} !important`,
                },
                ':active': {
                    backgroundColor: `${theme?.palette.themeSecondary} !important`,
                    color: `${theme?.palette.white} !important`,
                },
            },
        },
        dropdownItemSelected: {
            backgroundColor: `${theme?.palette.themeLighter} !important`,
            color: `${theme?.palette.white} !important`,
            selectors: {
                ':hover': {
                    backgroundColor: `${theme?.palette.themePrimary} !important`,
                    color: `${theme?.palette.white} !important`,
                },
                ':active': {
                    backgroundColor: `${theme?.palette.themePrimary} !important`,
                    color: `${theme?.palette.white} !important`,
                },
            },
        },
        subComponentStyles: {
            panel: {
                main: {
                    backgroundColor: theme?.palette.neutralDark,
                },
            },
            label: {},
            multiSelectItem: {},
        },
    };

    return {
        root: {
            padding: '10px',
            color: theme?.palette.neutralLighter,
            fontSize: '13px',
            borderBottom: `1px solid ${theme?.palette.neutralQuaternary}`,
        },
        title: {
            fontSize: '12px',
            color: theme?.palette.neutralTertiary,
            marginBottom: '8px',
        },
        content: {
            display: 'flex',
            alignItems: 'left',
        },
        dropdown: dropdownStyles,
    };
};

export const getClassNames = classNamesFunction<IModelSelectorStyleProps, IModelSelectorStyles>();