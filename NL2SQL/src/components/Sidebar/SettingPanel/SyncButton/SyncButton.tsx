import { PrimaryButton, Stack, styled, IIconProps } from '@fluentui/react';
import { ISyncButtonProps, ISyncButtonStyleProps, ISyncButtonStyles } from './SyncButton.types';
import { getClassNames, getStyles } from './SyncButton.styles';

const SyncButtonBase: React.FC<ISyncButtonProps> = ({
  text,
  onClick,
  theme,
  styles
}) => {
  const classNames = getClassNames(styles, { theme });
  const syncIcon: IIconProps = { iconName: 'Sync' };

  return (
    <Stack className={classNames.root}>
      <PrimaryButton
        iconProps={syncIcon}
        text={text || "Sync"}
        className={classNames.button}
        onClick={onClick}
      />
    </Stack>
  );
};

export const SyncButton = styled<
  ISyncButtonProps,
  ISyncButtonStyleProps,
  ISyncButtonStyles
>(SyncButtonBase, getStyles);