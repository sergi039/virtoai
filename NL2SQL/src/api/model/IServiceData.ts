import { TimeUnitType } from "../constants";

export interface IServiceData {
  id: string;
  serviceId: number;
  name: string;
  isSelected: boolean;
  tables: string[];
 config: {
    [key: string]: any;
    duration?: number;
    timeUnit?: TimeUnitType;
  };
}