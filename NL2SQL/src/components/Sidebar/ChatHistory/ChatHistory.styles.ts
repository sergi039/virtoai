import { classNamesFunction } from '@fluentui/react';
import type { IChatHistoryStyleProps, IChatHistoryStyles } from './ChatHistory.types';

export const getStyles = (props: IChatHistoryStyleProps): IChatHistoryStyles => {
    const { theme } = props;

    return {
        root: {
            flex: 1,
            overflowY: 'auto',
            padding: '10px',
        },
        header: {
            fontSize: '12px',
            color: theme?.palette.neutralTertiary,
            padding: '6px 0px',
            marginBottom: '8px',
        },
        list: {
            display: 'flex',
            flexDirection: 'column',
        },
        categoryHeader: {
            fontSize: '12px',
            fontWeight: 400,
            color: theme?.palette.neutralTertiary,
            padding: '3px 0px',
            marginBottom: '4px',
        },
        callout: {
            padding: 0,
        },
        calloutContent: {
            padding: '20px',
            maxWidth: '300px'
        }
    };
};

export const getClassNames = classNamesFunction<IChatHistoryStyleProps, IChatHistoryStyles>();