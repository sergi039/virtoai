import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IServiceData } from '../../../../api/model';
import { TimeUnitType } from '../../../../api/constants';

export interface IApolloConfigProps {
  service: IServiceData;
  timeUnit: TimeUnitType;
  onConfigChange: (fieldName: string, value: any) => void;
  onTimeUnitChange: (fieldName: string, unit: TimeUnitType) => void;
  onSync: () => void;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<IApolloConfigStyleProps, IApolloConfigStyles>;
}

export type IApolloConfigStyleProps = Pick<IApolloConfigProps, 'theme'>;

export interface IApolloConfigStyles {
  configBox: IStyle;
  twoColumnContainer: IStyle;
  columnItem: IStyle;
  formGroup: IStyle;
}