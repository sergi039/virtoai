import { ITheme, IStyleFunctionOrObject } from '@fluentui/react';

export interface ISecretsSettingsFormProps {
  apiKey: string;
  apiUrl: string;
  onApiKeyChange: (value: string | null) => void;
  onApiUrlChange: (value: string | null) => void;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<ISecretsSettingsFormStyleProps, ISecretsSettingsFormStyles>;
}

export interface ISecretsSettingsFormStyleProps {
  theme: ITheme;
}

export interface ISecretsSettingsFormStyles {
  rootStack?: any;
  formStack?: any;
  fieldContainer?: any;
  textField?: any;
  iconButton?: any;
}
