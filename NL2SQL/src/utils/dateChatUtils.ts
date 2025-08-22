import strings from "../Ioc/en-us";

export class DateChatUtils {

  static getDateCategory(date: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const chatDate = new Date(date);
    chatDate.setHours(0, 0, 0, 0);

    if (chatDate.getTime() === today.getTime()) {
      return strings.Chat.dateCategories.today;
    } else if (chatDate.getTime() === yesterday.getTime()) {
      return strings.Chat.dateCategories.yesterday;
    } else if (chatDate >= sevenDaysAgo) {
      return strings.Chat.dateCategories.lastSevenDays;
    } else {
      return strings.Chat.dateCategories.months[chatDate.getMonth()];
    }
  }

  static isDateLikeValue = (value: any): boolean => {
    if (value == null) return false;

    const stringValue = value.toString();

    if (/^\d+$/.test(stringValue)) {
      return false;
    }

    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{2}\/\d{2}\/\d{4}$/,
      /^\d{2}-\d{2}-\d{4}$/,
      /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    ];

    const isDateLike = datePatterns.some(pattern => pattern.test(stringValue));

    return isDateLike || (!isNaN(Date.parse(stringValue)) && isNaN(Number(stringValue)));
  };

  static formatDateString = (dateString: string): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    const hasTime = dateString.includes('T') || dateString.includes(':');

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: hasTime ? 'numeric' : undefined,
      minute: hasTime ? 'numeric' : undefined,
    };

    return date.toLocaleDateString('en-US', options);
  };
}