import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IServiceData } from '../../../../api/model';
import { TimeUnitType } from '../../../../api/constants';

export interface IPipedriveConfigProps {
  service: IServiceData;
  timeUnit: TimeUnitType;
  onConfigChange: (fieldName: string, value: any) => void;
  onTimeUnitChange: (fieldName: string, unit: TimeUnitType) => void;
  onSync: () => void;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<IPipedriveConfigStyleProps, IPipedriveConfigStyles>;
}

export type IPipedriveConfigStyleProps = Pick<IPipedriveConfigProps, 'theme'>;

export interface IPipedriveConfigStyles {
  configBox: IStyle;
  twoColumnContainer: IStyle;
  columnItem: IStyle;
  formGroup: IStyle;
  toggleRow: IStyle;
  entitySection: IStyle;
}