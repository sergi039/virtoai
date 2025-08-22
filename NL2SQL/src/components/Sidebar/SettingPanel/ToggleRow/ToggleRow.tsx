import { Stack, Toggle, styled } from '@fluentui/react';
import { IToggleRowProps, IToggleRowStyleProps, IToggleRowStyles } from './ToggleRow.types';
import { getClassNames, getStyles } from './ToggleRow.styles';

const ToggleRowBase: React.FC<IToggleRowProps> = ({
  toggles,
  theme,
  styles
}) => {
  const classNames = getClassNames(styles, { theme, togglesLength: toggles.length });

  return (
    <Stack className={classNames.root}>
      {toggles.map((toggle, index) => (
        <Toggle
          key={index}
          label={toggle.label}
          checked={toggle.checked}
          onChange={(_, checked) => toggle.onChange(!!checked)}
          className={classNames.toggleItem}
        />
      ))}
    </Stack>
  );
};

export const ToggleRow = styled<
  IToggleRowProps,
  IToggleRowStyleProps,
  IToggleRowStyles
>(ToggleRowBase, getStyles);