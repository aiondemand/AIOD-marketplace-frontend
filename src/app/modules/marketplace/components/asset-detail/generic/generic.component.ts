import { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { VALUE_TYPES } from '@app/shared/constants/value-types';
import { GenericItem } from '@app/shared/models/generic.model';

@Component({
  selector: 'app-generic-asset',
  templateUrl: './generic.component.html',
  styleUrls: ['./generic.component.scss'],
})
export class GenericComponent implements OnInit {
  // expose constants to template
  readonly VALUE_TYPES = VALUE_TYPES;

  // Return true when the app is currently using the dark theme.
  // The app stores theme on the root <html> element as `data-theme` and
  // also in localStorage under the key `theme` (toggled from the top-navbar).
  isDarkTheme(): boolean {
    try {
      const html = document.documentElement;
      const themeAttr = html ? html.getAttribute('data-theme') : null;
      const storageTheme =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem('theme')
          : null;
      const theme = themeAttr || storageTheme || 'light';
      return theme === 'dark';
    } catch (e) {
      return false;
    }
  }
  ngOnInit(): void {
    console.log('items:', this.items);
  }
  @Input() items: GenericItem[] = [];
  @Input() columns: string[] = [];
  @Input() title?: string;

  formatColumnName(columnName: string): string {
    if (columnName.includes('.')) {
      columnName = columnName.split('.')[0];
    }

    return columnName
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize first letter of each word
      .trim();
  }

  getValueType(value: any): string {
    if (Array.isArray(value)) {
      // Check if it's an array of objects
      if (
        value.length > 0 &&
        typeof value[0] === 'object' &&
        value[0] !== null
      ) {
        return VALUE_TYPES.OBJECT_ARRAY;
      }
      // It's an array of primitive values
      return VALUE_TYPES.ARRAY;
    }
    if (this.isURL(value)) {
      return VALUE_TYPES.URL;
    }
    if (typeof value === 'string' && value.includes(',')) {
      return VALUE_TYPES.ARRAY;
    }
    return VALUE_TYPES.TEXT;
  }

  isURL(value: string): boolean {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  getArrayValues(value: any): string[] {
    if (Array.isArray(value)) {
      return value.map((item) => String(item));
    }
    return this.parseArray(value);
  }

  parseArray(value: string): string[] {
    if (typeof value !== 'string') return [];
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  getObjectKeys(objects: any[]): string[] {
    if (!Array.isArray(objects) || objects.length === 0) return [];
    return Object.keys(objects[0]);
  }

  formatObjectValue(value: any): string {
    if (typeof value === 'string' && this.isURL(value)) {
      return value;
    }
    return String(value);
  }

  isObjectValueURL(value: any): boolean {
    return typeof value === 'string' && this.isURL(value);
  }

  getDisplayValueForObjectTable(key: string, value: any): string {
    // Special formatting for certain field types
    if (key === 'name' && typeof value === 'string') {
      return value;
    }
    if (key === 'encoding_format' && typeof value === 'string') {
      return value;
    }
    if (key === 'checksum_algorithm' && typeof value === 'string') {
      return value.toUpperCase();
    }
    return this.formatObjectValue(value);
  }
  getDistributionName(): string {
    // Example: get from first item, or implement your logic
    return this.items[0] && this.items[0]['distribution'][0]
      ? this.items[0]['distribution'][0].name
      : '';
  }
}
