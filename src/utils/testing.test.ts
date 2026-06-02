import { describe, it, expect, beforeEach } from 'vitest';
import { isTesting } from './testing';

describe('isTesting', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should return true when NODE_ENV is "test"', () => {
    process.env.NODE_ENV = 'test';
    expect(isTesting()).toBe(true);
  });

  it('should return false when NODE_ENV is "development"', () => {
    process.env.NODE_ENV = 'development';
    expect(isTesting()).toBe(false);
  });

  it('should return false when NODE_ENV is "production"', () => {
    process.env.NODE_ENV = 'production';
    expect(isTesting()).toBe(false);
  });

  it('should return false when NODE_ENV is undefined', () => {
    delete process.env.NODE_ENV;
    expect(isTesting()).toBe(false);
  });

  it('should return false when NODE_ENV is empty string', () => {
    process.env.NODE_ENV = '';
    expect(isTesting()).toBe(false);
  });
});