import { classNamesFunction } from '@fluentui/react';
import type { ISidebarFooterStyleProps, ISidebarFooterStyles } from './SidebarFooter.types';

export const getStyles = (props: ISidebarFooterStyleProps): ISidebarFooterStyles => {
    const { theme } = props;

    return {
        root: {
            position: 'relative',
            marginTop: 'auto',
        },
        button: {
            root: {
                width: '100%',
                height: 'auto',
                padding: '20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: theme?.palette.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start', 
                textAlign: 'start',
                transition: 'all 0.2s',
            },
            rootHovered: {
                color: theme?.palette.white,
                backgroundColor: theme?.palette.themeTertiary,
            },
            rootPressed: {
                color: theme?.palette.white,
                backgroundColor: theme?.palette.themeTertiary,
            },
            flexContainer: {
                justifyContent: 'center', 
                alignItems: 'center',
            }
        },
        avatar: {
            marginRight: '10px',
        },
        text: {
            fontSize: '14px',
            fontWeight: 500,
            color: theme?.palette.white,
        },
        menu: {
            container: {
                backgroundColor: `${theme?.palette.neutralPrimary} !important`,
                border: '0 !important',
            },
            root: {
                backgroundColor: `${theme?.palette.neutralPrimary} !important`,
                margin: '0 !important',
                padding: '0 !important',
                border: '0 !important',
            },
            subComponentStyles: {
                callout: {
                    root: {
                        backgroundColor: `${theme?.palette.neutralPrimary} !important`,
                        margin: '0 !important',
                        padding: '0 !important',
                        border: '0 !important',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.14) !important',
                    },
                    calloutMain: {
                        backgroundColor: `${theme?.palette.neutralPrimary} !important`,
                        margin: '0 !important',
                        padding: '0 !important',
                        border: '0 !important',
                    },
                    beak: {
                        backgroundColor: `${theme?.palette.neutralPrimary} !important`,
                    },
                    beakCurtain: {
                        backgroundColor: `${theme?.palette.neutralPrimary} !important`,
                    },
                },
                menuItem: {
                    root: {
                        color: `${theme?.palette.white} !important`,
                        backgroundColor: `${theme?.palette.neutralPrimary} !important`,
                        height: '36px',
                        lineHeight: '36px',
                        padding: '0 16px',
                        margin: '4px 0',
                        border: '0 !important',
                        selectors: {
                            ':hover': {
                                backgroundColor: `${theme?.palette.themeTertiary} !important`,
                                color: `${theme?.palette.white} !important`
                            },
                            ':active': {
                                backgroundColor: `${theme?.palette.themeTertiary} !important`,
                                color: `${theme?.palette.white} !important`
                            }
                        }
                    },
                    icon: {
                        fontSize: '16px',
                        color: `${theme?.palette.white} !important`,
                        textAlign: 'center',
                        width: '16px',
                        marginRight: '12px',
                    },
                    labelHovered: {
                        color: `${theme?.palette.white} !important`,
                    },
                    splitButtonFlexContainer: {
                        backgroundColor: `${theme?.palette.neutralPrimary} !important`,
                    },
                }
            }
        },
    };
};

export const getClassNames = classNamesFunction<ISidebarFooterStyleProps, ISidebarFooterStyles>();