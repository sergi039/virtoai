import type { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IInfoPanelProps {
  children?: React.ReactNode;
  styles?: IStyleFunctionOrObject<IInfoPanelStyleProps, IInfoPanelStyles>;
  theme?: ITheme;
}

export type IInfoPanelStyleProps = Pick<IInfoPanelProps, 'theme'>;

export interface IInfoPanelStyles {
  root: IStyle;
  panelContainer: IStyle;
  panelContent: IStyle;
  servicesGrid: IStyle;
  serviceCard: IStyle;
  serviceIcon: IStyle;
  serviceInfo: IStyle;
  serviceName: IStyle;
  serviceDetails: IStyle;
  syncTime: IStyle;
  recordCount: IStyle;
  icon: IStyle;
  recordCounts: IStyle;
  totalRecordCount: IStyle;
  syncButton: IStyle;
  syncButtonIcon: IStyle;
  spinning: IStyle;
}