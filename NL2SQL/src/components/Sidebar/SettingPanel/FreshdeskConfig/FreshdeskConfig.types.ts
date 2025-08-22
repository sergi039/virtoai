import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IServiceData } from '../../../../api/model';
import { TimeUnitType } from '../../../../api/constants';

export interface IFreshdeskConfigProps {
  service: IServiceData;
  timeUnit: TimeUnitType;
  timeoutUnit: TimeUnitType;
  onConfigChange: (fieldName: string, value: any) => void;
  onTimeUnitChange: (fieldName: string, unit: TimeUnitType) => void;
  onSync: () => void;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<IFreshdeskConfigStyleProps, IFreshdeskConfigStyles>;
}

export type IFreshdeskConfigStyleProps = Pick<IFreshdeskConfigProps, 'theme'>;

export interface IFreshdeskConfigStyles {
  configBox: IStyle;
  twoColumnContainer: IStyle;
  columnItem: IStyle;
  formGroup: IStyle;
  toggleRow: IStyle;
  datePickerContainer: IStyle;
}