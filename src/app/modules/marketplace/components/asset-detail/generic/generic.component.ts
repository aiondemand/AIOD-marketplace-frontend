import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { GenericItem } from '@app/shared/models/generic.model';

@Component({
  selector: 'app-generic',
  templateUrl: './generic.component.html',
  styleUrls: ['./generic.component.scss'],
})
export class GenericComponent {
  @Input() items: GenericItem[] = [];
  @Input() columns: string[] = [];
  @Input() title?: string;

  formatColumnName(columnName: string): string {
    // Convert camelCase or snake_case to readable format
    return columnName
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\./g, ' ') // Replace dots with spaces for nested properties
      .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize first letter of each word
      .trim();
  }

  getValueType(value: any): string {
    if (this.isURL(value)) {
      return 'url';
    }
    if (typeof value === 'string' && value.includes(',')) {
      return 'array';
    }
    return 'text';
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

  parseArray(value: string): string[] {
    if (typeof value !== 'string') return [];
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
}
