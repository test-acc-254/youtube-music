export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export const sanitizeHtmlLenient = (input: string): string => {
  return input.replace(/<[^>]*>/g, '');
};

export const validateString = (
  input: unknown,
  maxLength: number = 1000,
  pattern?: RegExp,
): input is string => {
  if (typeof input !== 'string') return false;
  if (input.length > maxLength) return false;
  if (pattern && !pattern.test(input)) return false;
  return true;
};

export const validateNumber = (
  input: unknown,
  min?: number,
  max?: number,
): input is number => {
  if (typeof input !== 'number' || Number.isNaN(input)) return false;
  if (min !== undefined && input < min) return false;
  if (max !== undefined && input > max) return false;
  return true;
};

export const validateBoolean = (input: unknown): input is boolean => {
  return typeof input === 'boolean';
};

export const validateObject = (
  input: unknown,
): input is Record<string, unknown> => {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
};

export const sanitizePluginId = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9_-]/g, '');
};

export const validatePluginId = (input: unknown): input is string => {
  return validateString(input, 100, /^[a-zA-Z0-9_-]+$/);
};

export const sanitizePathSegment = (input: string): string => {
  return input.replace(/\.\.\//g, '').replace(/\.\.\\/g, '').replace(/\0/g, '');
};

export const validatePathSegment = (input: unknown): input is string => {
  if (typeof input !== 'string') return false;
  if (input.includes('..')) return false;
  if (input.includes('\0')) return false;
  if (input.length > 255) return false;
  return true;
};

export const sanitizeConfigValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return sanitizeHtmlLenient(value);
  }
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return value.map(sanitizeConfigValue);
    }
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeConfigValue(val);
    }
    return sanitized;
  }
  return value;
};
