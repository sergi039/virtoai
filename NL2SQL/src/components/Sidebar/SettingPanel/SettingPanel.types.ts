import type { IStyle, IStyleFunctionOrObject, ITheme, IPanelStyles, IPivotStyles } from '@fluentui/react';

export interface ISettingPanelProps {
  theme?: ITheme;
  isOpen: boolean;
  onDismiss: () => void;
  styles?: IStyleFunctionOrObject<ISettingPanelStyleProps, ISettingPanelStyles>;
}

export type ISettingPanelStyleProps = Pick<ISettingPanelProps, 'theme'>;

export interface ISettingPanelStyles {
  panel: Partial<IPanelStyles>;
  panelContent: IStyle;
  sectionTitle: IStyle;
  section: IStyle;
  serviceSelection: IStyle;
  tableSelection: IStyle;
  serviceConfig: IStyle;
  formGroup: IStyle;
  formField: IStyle;
  separator: IStyle;
  compactSeparator: IStyle;
  messageBar: IStyle;
  loadingContainer: IStyle;
  toggleRow: IStyle;
  toggleItem: IStyle;
  timeFieldGroup: IStyle;
  unitDropdown: IStyle;
  syncButton: IStyle;
  configBox: IStyle;
  addServiceOption: IStyle;
  addServiceTab: IStyle;
  pivot: Partial<IPivotStyles>;
  pivotContent: IStyle;
  timeValueContainer: IStyle;
  twoColumnContainer: IStyle;
  columnItem: IStyle;
  syncButtonContainer: IStyle;
}