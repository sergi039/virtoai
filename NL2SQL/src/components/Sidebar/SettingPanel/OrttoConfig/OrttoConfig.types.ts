import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IServiceData } from '../../../../api/model';
import { TimeUnitType } from '../../../../api/constants';

export interface IOrttoConfigProps {
  service: IServiceData;
  timeUnit: TimeUnitType;
  onConfigChange: (fieldName: string, value: any) => void;
  onTimeUnitChange: (fieldName: string, unit: TimeUnitType) => void;
  onSync: () => void;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<IOrttoConfigStyleProps, IOrttoConfigStyles>;
}

export type IOrttoConfigStyleProps = Pick<IOrttoConfigProps, 'theme'>;

export interface IOrttoConfigStyles {
  configBox: IStyle;
  twoColumnContainer: IStyle;
  columnItem: IStyle;
  formGroup: IStyle;
}