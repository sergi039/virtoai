import { mergeStyleSets } from '@fluentui/react';
import type { ISecretsSettingsFormStyleProps, ISecretsSettingsFormStyles } from './SecretsSettingsForm.types';

export const getStyles = (_props: ISecretsSettingsFormStyleProps): ISecretsSettingsFormStyles => {
  return {
    rootStack: {
      width: '100%',
      padding: 0,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    formStack: {
      width: '100%',
      borderRadius: 4,
    },
    fieldContainer: {
      width: '100%',
    },
    textField: {
      root: { flex: 1 },
      field: {
        height: 32,
        fontSize: 14,
        padding: '4px 8px',
        borderRadius: 2,
      },
    },
    iconButton: {
      root: {
        marginTop: 22,
        marginLeft: 4,
        height: 28,
        width: 28,
        alignSelf: 'flex-end',
      },
    },
  };
};

export const getClassNames = (
  getStyles: (props: ISecretsSettingsFormStyleProps) => ISecretsSettingsFormStyles,
  props: ISecretsSettingsFormStyleProps
) => mergeStyleSets(getStyles(props));
