import { mergeStyleSets } from '@fluentui/react';
import type { IRulesPanelStyleProps, IRulesPanelStyles } from './RulesPanel.types';

export const getStyles = (props: IRulesPanelStyleProps): IRulesPanelStyles => {
  const { theme } = props;

  return {
    panel: {
      width: '600px',
    },
    header: {
      padding: '20px 24px 0',
      fontSize: '20px',
      fontWeight: '600',
      color: theme.palette.neutralPrimary,
    },
    content: {
      padding: '20px 24px 24px',
    },
  };
};

export const getClassNames = (
  getStyles: (props: IRulesPanelStyleProps) => IRulesPanelStyles,
  props: IRulesPanelStyleProps
) => mergeStyleSets(getStyles(props));
