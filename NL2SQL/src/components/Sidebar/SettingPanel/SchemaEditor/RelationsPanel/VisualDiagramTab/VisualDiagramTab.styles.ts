import { classNamesFunction, mergeStyleSets } from '@fluentui/react';
import { IVisualDiagramTabStyleProps, IVisualDiagramTabStyles } from './VisualDiagramTab.types';

export const getStyles = (props: IVisualDiagramTabStyleProps): IVisualDiagramTabStyles => {
    const { theme } = props;

    return mergeStyleSets({
        container: {
            height: 'calc(100vh - 200px)',
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: 1,
            overflow: 'hidden',
            padding: '20px',
        },
        noDataContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
        },
        noDataText: {
            color: theme?.palette.neutralSecondary || '#605e5c',
            fontSize: '16px',
            textAlign: 'center',
            maxWidth: '400px',
        },
        reactFlowContainer: {
            height: '100%',
            border: `1px solid ${theme?.palette.neutralTertiaryAlt || '#edebe9'}`,
            borderRadius: '4px',
        },
    });
};

export const getClassNames = classNamesFunction<IVisualDiagramTabStyleProps, IVisualDiagramTabStyles>();
