import { Component, Input } from '@angular/core';
import { VALUE_TYPES } from '@app/shared/constants/value-types';
import { GenericItem } from '@app/shared/models/generic.model';

@Component({
  selector: 'app-generic-asset',
  templateUrl: './generic.component.html',
  styleUrls: ['./generic.component.scss'],
})
export class GenericComponent {
  readonly VALUE_TYPES = VALUE_TYPES;

  @Input() items: GenericItem[] = [];
  @Input() columns: string[] = [];
  @Input() title?: string;

  // Theme detection
  isDarkTheme(): boolean {
    try {
      const theme = this.getCurrentTheme();
      return theme === 'dark';
    } catch {
      return false;
    }
  }

  private getCurrentTheme(): string {
    const themeAttr = document.documentElement?.getAttribute('data-theme');
    const storageTheme =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('theme')
        : null;
    return themeAttr || storageTheme || 'light';
  }

  // Column name formatting
  formatColumnName(columnName: string): string {
    const baseName = this.extractBaseName(columnName);
    return this.convertToTitleCase(baseName);
  }

  private extractBaseName(columnName: string): string {
    return columnName.includes('.') ? columnName.split('.')[0] : columnName;
  }

  private convertToTitleCase(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  }

  // Value type detection
  getValueType(value: any): string {
    if (Array.isArray(value)) {
      return this.isArrayOfObjects(value)
        ? VALUE_TYPES.OBJECT_ARRAY
        : VALUE_TYPES.ARRAY;
    }

    if (this.isURL(value)) {
      return VALUE_TYPES.URL;
    }

    if (this.isCommaSeparatedString(value)) {
      return VALUE_TYPES.ARRAY;
    }

    return VALUE_TYPES.TEXT;
  }

  private isArrayOfObjects(value: any[]): boolean {
    return (
      value.length > 0 && typeof value[0] === 'object' && value[0] !== null
    );
  }

  private isCommaSeparatedString(value: any): boolean {
    return typeof value === 'string' && value.includes(',');
  }

  isURL(value: any): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  // Array handling
  getArrayValues(value: any): string[] {
    return Array.isArray(value)
      ? value.map(String)
      : this.parseCommaSeparatedString(value);
  }

  private parseCommaSeparatedString(value: any): string[] {
    if (typeof value !== 'string') {
      return [];
    }

    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  // Object array handling
  getObjectKeys(objects: any[]): string[] {
    if (!Array.isArray(objects) || objects.length === 0) {
      return [];
    }
    return Object.keys(objects[0]);
  }

  formatObjectValue(value: any): string {
    return String(value);
  }

  isObjectValueURL(value: any): boolean {
    return this.isURL(value);
  }

  getDisplayValueForObjectTable(key: string, value: any): string {
    const formatters: Record<string, (val: any) => string> = {
      checksum_algorithm: (val) => String(val).toUpperCase(),
      name: String,
      encoding_format: String,
    };

    const formatter = formatters[key];
    return formatter ? formatter(value) : this.formatObjectValue(value);
  }

  // Distribution helpers
  getDistributionName(): string {
    return this.getNestedValue(['distribution', 0, 'name'], '');
  }

  getDistributionDependency(): string {
    return this.getNestedValue(['distribution', 0, 'dependency'], '');
  }

  private getNestedValue(
    path: (string | number)[],
    defaultValue: string,
  ): string {
    try {
      let current: any = this.items?.[0];

      for (const key of path) {
        current = current?.[key];
        if (current === undefined || current === null) {
          return defaultValue;
        }
      }

      return String(current);
    } catch {
      return defaultValue;
    }
  }

  // Description handling
  getDescription(item: GenericItem): string {
    const description = item['description'];

    if (!description || typeof description !== 'object') {
      return '';
    }

    return description['plain'] || description['html'] || '';
  }

  // Template helper methods
  shouldShowColumn(col: string, item: GenericItem): boolean {
    if (col === 'description') {
      return col.length > 0 && !!this.getDescription(item);
    }

    const value = item[col];

    // Check if value exists and is not 'N/A' or 'null'
    if (!value || value === 'N/A' || value === 'null') {
      return false;
    }

    // Check if it's an empty array
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    return true;
  }

  getThemeClass(): string {
    return this.isDarkTheme() ? 'dark' : 'light';
  }

  getDistributionItemClass(): Record<string, boolean> {
    const themeClass = this.getThemeClass();
    return {
      'distribution-item': true,
      [`distribution-item-${themeClass}`]: true,
    };
  }

  isArrayType(col: string, item: GenericItem): boolean {
    // Exclude columns that have special rendering
    const specialColumns = ['description', 'badge'];

    return (
      this.getValueType(item[col]) === VALUE_TYPES.ARRAY &&
      !specialColumns.includes(col)
    );
  }

  isDistributionType(col: string): boolean {
    return col === 'distribution' && col.length > 0;
  }

  isObjectArrayType(col: string, item: GenericItem): boolean {
    return (
      this.getValueType(item[col]) === VALUE_TYPES.OBJECT_ARRAY &&
      col !== 'description' &&
      col !== 'distribution'
    );
  }

  toggleState(obj: any, property: string): void {
    obj[property] = !obj[property];
  }

  getExpandIconTransform(isExpanded: boolean): string {
    return isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
  }

  getExpandIconLabel(isExpanded: boolean): string {
    return isExpanded ? 'Collapse' : 'Expand';
  }

  hasMediaProperties(obj: any): boolean {
    return !!(
      obj.checksum_algorithm ||
      obj.content_size_kb ||
      obj.content_url ||
      obj.copyright ||
      obj.date_published
    );
  }
}
