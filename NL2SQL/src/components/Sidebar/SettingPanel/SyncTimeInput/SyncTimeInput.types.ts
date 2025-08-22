import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { TimeUnitType } from '../../../../api/constants';

export interface ISyncTimeInputProps {
  label?: string;
  value: number;
  unit: TimeUnitType;
  onChange: (value: number) => void;
  onUnitChange: (unit: TimeUnitType) => void;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<ISyncTimeInputStyleProps, ISyncTimeInputStyles>;
}

export type ISyncTimeInputStyleProps = Pick<ISyncTimeInputProps, 'theme'>;

export interface ISyncTimeInputStyles {
  root: IStyle;
  timeFieldGroup: IStyle;
  unitDropdown: IStyle;
  timeValueContainer: IStyle;
}