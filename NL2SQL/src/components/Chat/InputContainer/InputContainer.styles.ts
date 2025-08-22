import { classNamesFunction } from '@fluentui/react';
import type { IInputContainerStyleProps, IInputContainerStyles } from './InputContainer.types';

export const getStyles = (props: IInputContainerStyleProps): IInputContainerStyles => {
    const { theme } = props;

    return {
        root: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '10px 12px',
            background: theme?.palette.white,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '24px',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
        wrapper: {
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        input: {
            root: {
                paddingTop: '8px',
                backgroundColor: 'transparent',
                width: '100%',
                color: theme?.palette.black,
            },
            field: {
                fontSize: '16px',
                color: theme?.palette.black,
                backgroundColor: theme?.palette.white,
                resize: 'none',
                maxHeight: '150px',
                minHeight: '24px',
                paddingTop: '0',
                paddingBottom: '0',
                overflow: "auto"
            },
            fieldGroup: {
                borderRadius: '16px',
                minHeight: '24px',
                marginBottom: '12px',
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
        voiceWaveContainer: {
            position: 'relative',
            width: '97%',
            height: '50px',
            backgroundColor: theme?.palette.neutralLighterAlt,
            borderRadius: '16px',
            marginBottom: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
        },
        audioVisualizer: {
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'center',
            height: '40px',
            width: '100%',
            gap: '2px',
            marginBottom: '8px',
        },
        audioBar: {
            width: '3px',
            minHeight: '4px',
            backgroundColor: '#c8c8c8',
            borderRadius: '2px',
            transition: 'height 0.1s ease, background-color 0.1s ease',
        },
        voiceWave: {
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            backgroundColor: theme?.palette.themeLighter,
            transition: 'width 0.1s ease',
            borderRadius: '16px',
            opacity: 0.6,
        },
        voiceText: {
            position: 'relative',
            zIndex: 1,
            color: theme?.palette.neutralDark,
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center',
        },
        errorText: {
            color: theme?.palette.red,
            fontSize: '12px',
            fontWeight: '400',
        },
        actionsRow: {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            padding: '2px 0',
            alignItems: 'center',
        },
        toolButtons: {
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
        },
        voiceButton: {
            root: {
                backgroundColor: theme?.palette.neutralLighter,
                color: theme?.palette.neutralDark,
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                alignSelf: 'flex-end',
                padding: 0,
                minWidth: 'unset',
                marginLeft: '8px',
            },
            rootHovered: {
                backgroundColor: theme?.palette.themePrimary,
            },
            rootPressed: {
                backgroundColor: theme?.palette.themePrimary,
            },
            icon: {
                color: theme?.palette.neutralDark,
                fontSize: '14px',
            },
            iconHovered: {
                color: theme?.palette.white,
            }
        },
        submitButton: {
            root: {
                backgroundColor: theme?.palette.themePrimary,
                color: theme?.palette.white,
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                alignSelf: 'flex-end',
                padding: 0,
                minWidth: 'unset',
                marginLeft: '8px',
            },
            rootHovered: {
                backgroundColor: theme?.palette.themeDark,
            },
            rootPressed: {
                backgroundColor: theme?.palette.themeDark,
            },
            icon: {
                color: theme?.palette.white,
                fontSize: '14px',
            },
        },
        cancelButton: {
            root: {
                backgroundColor: theme?.palette.neutralLighter,
                color: theme?.palette.neutralDark,
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                alignSelf: 'flex-end',
                padding: 0,
                minWidth: 'unset',
                marginLeft: '8px',
            },
            rootHovered: {
                backgroundColor: theme?.palette.neutralLight,
            },
            rootPressed: {
                backgroundColor: theme?.palette.neutralLight,
            },
            icon: {
                color: theme?.palette.neutralDark,
                fontSize: '14px',
            },
        },
        confirmButton: {
            root: {
                backgroundColor: theme?.palette.neutralLighter,
                color: theme?.palette.neutralDark,
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                alignSelf: 'flex-end',
                padding: 0,
                minWidth: 'unset',
                marginLeft: '8px',
            },
            rootHovered: {
                backgroundColor: theme?.palette.neutralLight,
            },
            rootPressed: {
                backgroundColor: theme?.palette.neutralLight,
            },
            icon: {
                color: theme?.palette.neutralDark,
                fontSize: '14px',
            },
        },
        modelDropdown: {
            root: {
                minWidth: '180px',
                maxWidth: '200px',
            },
            dropdown: {
                height: '32px',
                minHeight: '32px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.1)',
                selectors: {
                    '::after': {
                        border: 'none !important',
                        boxShadow: 'none !important',
                    },
                },
            },
            title: {
                lineHeight: '30px',
                height: '29px',
                borderRadius: '12px',
                paddingTop: 0,
                paddingBottom: 0,
                border: 'none',
                selectors: {
                    '&:focus': {
                        borderColor: 'transparent',
                        boxShadow: 'none',
                        outline: 'none',
                    },
                },
            },
        },
    };
};

export const getClassNames = classNamesFunction<IInputContainerStyleProps, IInputContainerStyles>();