import { Panel, PanelType, styled } from '@fluentui/react';
import type { IRulesPanelProps, IRulesPanelStyleProps, IRulesPanelStyles } from './RulesPanel.types';
import { getStyles, getClassNames } from './RulesPanel.styles';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';
import strings from '../../../Ioc/en-us';
import { RulesManager } from '../SettingPanel/RulesManager';

const RulesPanelBase: React.FunctionComponent<IRulesPanelProps> = ({
  theme: customTheme,
  isOpen,
  onDismiss,
}) => {
  const { currentTheme } = useNL2SQLStore();

  const theme = customTheme || currentTheme;
  const styleProps: IRulesPanelStyleProps = { theme };
  const classNames = getClassNames(getStyles, styleProps);

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.medium}
      headerText={strings.SettingsPanel.rules.title}
      styles={{
        main: classNames.panel,
        header: classNames.header,
        content: classNames.content,
      }}
      isLightDismiss
      closeButtonAriaLabel={strings.btnClose}
    >
      <RulesManager theme={theme} />
    </Panel>
  );
};

export const RulesPanel = styled<IRulesPanelProps, IRulesPanelStyleProps, IRulesPanelStyles>(
  RulesPanelBase,
  getStyles,
  undefined,
  { scope: 'RulesPanel' }
);
