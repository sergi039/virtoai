import { mergeStyleSets } from '@fluentui/react';
import { classNamesFunction } from '@fluentui/react';
import { ICreateRelationTabStyleProps, ICreateRelationTabStyles } from './CreateRelationTab.types';

export const getStyles = (props: ICreateRelationTabStyleProps): ICreateRelationTabStyles => {
    const { theme } = props;

    return mergeStyleSets({
        container: {
            height: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: 1,
            overflow: 'auto',
            padding: '20px',
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginTop: '20px',
        },
        footer: {
            padding: '16px 20px',
            borderTop: `1px solid ${theme?.palette.neutralTertiaryAlt || '#edebe9'}`,
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: theme?.palette.white || '#ffffff',
            minHeight: '70px',
            alignItems: 'center',
        },
        warningMessage: {
            marginBottom: '16px',
        },
    });
};

export const getClassNames = classNamesFunction<ICreateRelationTabStyleProps, ICreateRelationTabStyles>();