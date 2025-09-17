// Centralized value type constants used across components and templates
export const VALUE_TYPES = {
  TEXT: 'text',
  ARRAY: 'array',
  OBJECT_ARRAY: 'object-array',
  URL: 'url',
} as const;

// Explicit union type for allowed value type strings
export type ValueType = 'text' | 'array' | 'object-array' | 'url';
