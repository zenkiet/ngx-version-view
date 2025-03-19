import { Inject, Injectable, Optional } from '@angular/core';
import { VersionStrategy } from '../models/version.model';
import {
  DATE_FORMAT_PATTERNS,
  DateFormat,
  getDefaultDateFormat,
  isValidDateFormat,
  VALID_DATE_FORMATS,
} from '../types';

@Injectable()
export class DateVersionStrategy implements VersionStrategy {
  private _compareCache = new Map<string, number>();
  private _dateParseCache = new Map<string, Date>();
  private _formatConfig!: { regex: RegExp; parser: (matches: RegExpExecArray) => Date };

  constructor(@Optional() @Inject('DATE_FORMAT') private dateFormat = getDefaultDateFormat()) {
    if (!isValidDateFormat(dateFormat)) {
      throw new Error(
        `Invalid date format: ${dateFormat}. Supported formats: ${VALID_DATE_FORMATS.join(', ')}`
      );
    }
    this.setDateFormat(dateFormat);
  }

  setDateFormat(format: DateFormat): void {
    if (!DATE_FORMAT_PATTERNS[format]) {
      throw new Error(
        `Unsupported date format: ${format}. Supported formats: ${VALID_DATE_FORMATS.join(', ')}`
      );
    }

    this._formatConfig = DATE_FORMAT_PATTERNS[format];
    this.clearCache();
  }

  private parseDate(dateStr: string): Date {
    if (this._dateParseCache.has(dateStr)) {
      return this._dateParseCache.get(dateStr)!;
    }

    try {
      const matches = this._formatConfig.regex.exec(dateStr);
      if (!matches) {
        throw new Error(
          `Date string does not match expected format ${this.dateFormat}: ${dateStr}`
        );
      }

      const date = this._formatConfig.parser(matches);

      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${dateStr}`);
      }

      this._dateParseCache.set(dateStr, date);
      return date;
    } catch (e) {
      console.error(`Failed to parse date: ${dateStr}`, e);
      return new Date(0);
    }
  }

  compare(a: string, b: string): number {
    const cacheKey = `${a}:${b}`;

    if (this._compareCache.has(cacheKey)) {
      return this._compareCache.get(cacheKey)!;
    }

    const dateA = this.parseDate(a);
    const dateB = this.parseDate(b);

    const result = dateA.getTime() - dateB.getTime();
    this._compareCache.set(cacheKey, result);
    return result;
  }

  gte(a: string, b: string): boolean {
    return this.compare(a, b) >= 0;
  }

  lt(a: string, b: string): boolean {
    return this.compare(a, b) < 0;
  }

  clearCache(): void {
    this._compareCache.clear();
    this._dateParseCache.clear();
  }
}
