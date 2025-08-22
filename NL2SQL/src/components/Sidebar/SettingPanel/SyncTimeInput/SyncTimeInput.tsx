import { Stack, Label, TextField, Dropdown, styled } from '@fluentui/react';
import { ISyncTimeInputProps, ISyncTimeInputStyleProps, ISyncTimeInputStyles } from './SyncTimeInput.types';
import { getClassNames, getStyles } from './SyncTimeInput.style';
import { TIME_UNIT_OPTIONS, TimeUnitType } from '../../../../api/constants';

const SyncTimeInputBase: React.FC<ISyncTimeInputProps> = ({
  label = 'Sync Time',
  value,
  unit,
  onChange,
  onUnitChange,
  theme,
  styles
}) => {
  const classNames = getClassNames(styles, { theme });

  return (
    <Stack className={classNames.root}>
      <Label>{label}</Label>
      <Stack horizontal className={classNames.timeValueContainer}>
        <TextField
          type="number"
          className={classNames.timeFieldGroup}
          value={(value || 60).toString()}
          onChange={(_, newValue) => {
            const numValue = newValue ? parseInt(newValue) : 60;
            onChange(numValue);
          }}
        />
        <Dropdown
          selectedKey={unit || TimeUnitType.MINUTES}
          options={TIME_UNIT_OPTIONS}
          className={classNames.unitDropdown}
          onChange={(_, option) => {
            if (option) {
              onUnitChange(option.key as TimeUnitType);
            }
          }}
        />
      </Stack>
    </Stack>
  );
};

export const SyncTimeInput = styled<
  ISyncTimeInputProps,
  ISyncTimeInputStyleProps,
  ISyncTimeInputStyles
>(SyncTimeInputBase, getStyles);