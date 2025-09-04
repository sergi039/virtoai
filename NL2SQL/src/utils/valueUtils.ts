export class ValueUtils {
  static isNullValue(value: any): boolean {
    return value == null || (typeof value === 'string' && value.toLowerCase().includes('value is null'));
  }

  static formatForDisplay(value: any, fallback: string = '—'): string {
    if (ValueUtils.isNullValue(value)) {
      return fallback;
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return value.toString();
  }
}
