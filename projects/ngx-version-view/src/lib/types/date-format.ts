export type DateFormat =
  | 'dd.MM.yyyy'
  | 'MM.dd.yyyy'
  | 'yyyy.MM.dd'
  | 'yyyy-MM-dd'
  | 'MM-dd-yyyy'
  | 'dd-MM-yyyy';

export const VALID_DATE_FORMATS: DateFormat[] = [
  'dd.MM.yyyy',
  'MM.dd.yyyy',
  'yyyy.MM.dd',
  'yyyy-MM-dd',
  'MM-dd-yyyy',
  'dd-MM-yyyy',
];

export interface DateFormatPattern {
  regex: RegExp;
  parser: (matches: RegExpExecArray) => Date;
}

export type DateFormatPatterns = Record<DateFormat, DateFormatPattern>;

export const DATE_FORMAT_PATTERNS: DateFormatPatterns = {
  'dd.MM.yyyy': {
    regex: /^(\d{2})\.(\d{2})\.(\d{4})$/,
    parser: (matches) => new Date(+matches[3], +matches[2] - 1, +matches[1]),
  },
  'MM.dd.yyyy': {
    regex: /^(\d{2})\.(\d{2})\.(\d{4})$/,
    parser: (matches) => new Date(+matches[3], +matches[1] - 1, +matches[2]),
  },
  'yyyy.MM.dd': {
    regex: /^(\d{4})\.(\d{2})\.(\d{2})$/,
    parser: (matches) => new Date(+matches[1], +matches[2] - 1, +matches[3]),
  },
  'yyyy-MM-dd': {
    regex: /^(\d{4})-(\d{2})-(\d{2})$/,
    parser: (matches) => new Date(+matches[1], +matches[2] - 1, +matches[3]),
  },
  'MM-dd-yyyy': {
    regex: /^(\d{2})-(\d{2})-(\d{4})$/,
    parser: (matches) => new Date(+matches[3], +matches[1] - 1, +matches[2]),
  },
  'dd-MM-yyyy': {
    regex: /^(\d{2})-(\d{2})-(\d{4})$/,
    parser: (matches) => new Date(+matches[3], +matches[2] - 1, +matches[1]),
  },
};

export function isValidDateFormat(format: string): format is DateFormat {
  return VALID_DATE_FORMATS.includes(format as DateFormat);
}

export function getDefaultDateFormat(): DateFormat {
  return 'MM.dd.yyyy';
}
