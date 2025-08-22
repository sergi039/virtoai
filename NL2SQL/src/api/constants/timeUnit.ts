export enum TimeUnitType {
  MINUTES = 'minutes',
  HOURS = 'hours'
}

export interface TimeValue {
  value: number;
  unit: TimeUnitType;
}

export const DEFAULT_DURATIONS = {
  apollo: { value: 60, unit: TimeUnitType.MINUTES },
  ortto: { value: 60, unit: TimeUnitType.MINUTES },
  freshdesk: { value: 60, unit: TimeUnitType.MINUTES },
  pipedrive: { value: 60, unit: TimeUnitType.MINUTES },
};

export const TIME_UNIT_OPTIONS = [
  { key: TimeUnitType.MINUTES, text: 'minutes' },
  { key: TimeUnitType.HOURS, text: 'hours' }
];