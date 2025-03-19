export enum DateFormat {
  DD_MM_YYYY_DOT = 'dd.MM.yyyy',
  MM_DD_YYYY_DOT = 'MM.dd.yyyy',
  YYYY_MM_DD_DOT = 'yyyy.MM.dd',
  YYYY_MM_DD_DASH = 'yyyy-MM-dd',
  MM_DD_YYYY_DASH = 'MM-dd-yyyy',
  DD_MM_YYYY_DASH = 'dd-MM-yyyy',
}

export interface DateFormatPattern {
  regex: RegExp;
  parser: (matches: RegExpExecArray) => Date;
}

export type DateFormatPatterns = Record<DateFormat, DateFormatPattern>;

export const DATE_FORMAT_PATTERNS: DateFormatPatterns = {
  [DateFormat.DD_MM_YYYY_DOT]: {
    regex: /^(\d{2})\.(\d{2})\.(\d{4})$/,
    parser: (matches) => new Date(+matches[3], +matches[2] - 1, +matches[1]),
  },
  [DateFormat.MM_DD_YYYY_DOT]: {
    regex: /^(\d{2})\.(\d{2})\.(\d{4})$/,
    parser: (matches) => new Date(+matches[3], +matches[1] - 1, +matches[2]),
  },
  [DateFormat.YYYY_MM_DD_DOT]: {
    regex: /^(\d{4})\.(\d{2})\.(\d{2})$/,
    parser: (matches) => new Date(+matches[1], +matches[2] - 1, +matches[3]),
  },
  [DateFormat.YYYY_MM_DD_DASH]: {
    regex: /^(\d{4})-(\d{2})-(\d{2})$/,
    parser: (matches) => new Date(+matches[1], +matches[2] - 1, +matches[3]),
  },
  [DateFormat.MM_DD_YYYY_DASH]: {
    regex: /^(\d{2})-(\d{2})-(\d{4})$/,
    parser: (matches) => new Date(+matches[3], +matches[1] - 1, +matches[2]),
  },
  [DateFormat.DD_MM_YYYY_DASH]: {
    regex: /^(\d{2})-(\d{2})-(\d{4})$/,
    parser: (matches) => new Date(+matches[3], +matches[2] - 1, +matches[1]),
  },
};

export const VALID_DATE_FORMATS = Object.values(DateFormat);

export function isValidDateFormat(format: string): format is DateFormat {
  return Object.values(DateFormat).includes(format as DateFormat);
}

export function getDefaultDateFormat(): DateFormat {
  return DateFormat.MM_DD_YYYY_DOT;
}
