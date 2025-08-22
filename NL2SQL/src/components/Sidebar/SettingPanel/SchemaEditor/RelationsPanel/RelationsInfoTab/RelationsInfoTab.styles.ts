import { classNamesFunction, mergeStyleSets } from '@fluentui/react';
import { IRelationsInfoTabStyleProps, IRelationsInfoTabStyles } from './RelationsInfoTab.types';

export const getStyles = (props: IRelationsInfoTabStyleProps): IRelationsInfoTabStyles => {
    const { theme } = props;

    return mergeStyleSets({
        container: {
            padding: '20px',
            height: 'calc(100vh - 200px)',
            overflow: 'auto',
        },
        header: {
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px',
            color: theme?.palette.neutralPrimary,
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        },
        noRelationsText: {
            fontSize: '14px',
            color: theme?.palette.neutralSecondary,
            fontStyle: 'italic',
            textAlign: 'left',
            padding: '40px 20px',
        },
        relationsList: {
            width: '100%',
        },
    });
};

export const getClassNames = classNamesFunction<IRelationsInfoTabStyleProps, IRelationsInfoTabStyles>();
