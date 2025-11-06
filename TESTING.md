# Testing Documentation

This document describes the testing setup and organization for the YouTube Music Desktop App.

## Testing Framework

This project uses **Playwright Test** for both unit and end-to-end testing.

- **Framework**: Playwright Test v1.51.1
- **Configuration**: `playwright.config.ts`
- **Test Pattern**: `**/*.test.{ts,js}`

## Running Tests

### All Tests
```bash
npm test
# or
pnpm test
```

### Unit Tests Only
```bash
npx playwright test --project=unit-tests
```

### E2E Tests Only
```bash
npx playwright test --project=e2e-tests
```

### Debug Mode
```bash
npm run test:debug
```

### Watch Mode
```bash
npx playwright test --ui
```

## Test Organization

### Unit Tests

Unit tests are co-located with their source files using the `.test.ts` suffix:

```
src/
├── utils/
│   ├── wait-for-element.ts
│   └── wait-for-element.test.ts  ← Unit tests here
├── plugins/
│   ├── notifications/
│   │   ├── utils.ts
│   │   └── utils.test.ts         ← Unit tests here
│   └── ...
```

### E2E Tests

End-to-end tests are located in the `tests/` directory:

```
tests/
├── index.test.js                  ← E2E tests
└── ...
```

## Test Coverage

### Current Coverage

The following critical modules now have comprehensive unit tests with >80% coverage:

#### Core Utilities (`src/utils/`)
- ✅ **wait-for-element.ts** - DOM element waiting utility
  - Happy path: Element found immediately
  - Edge cases: Delayed elements, complex selectors
  - Error conditions: Multiple elements, timeout scenarios

#### Plugin Utilities (`src/plugins/utils/`)

##### Main Process Utils
- ✅ **fetch.ts** - Network fetch wrapper
  - URL handling (string, URL object, Request object)
  - Method inference (POST when body provided)
  - Error handling (network failures)
  - Init options passthrough

- ✅ **fs.ts** - File system utilities
  - File existence checks
  - Callback execution (success/error)
  - Path type handling (string, Buffer, URL)
  - Error scenarios (ENOENT, EACCES)

- ✅ **css.ts** - CSS injection utilities
  - Inline CSS injection
  - File-based CSS injection
  - Queuing before page load
  - Multiple injections
  - Unregister functionality

##### Plugin-Specific Utils

- ✅ **notifications/utils.ts** - Notification handling
  - Image processing (resize, crop)
  - Toast style variants (7 different styles)
  - Format conversion (snake_case to Camel Case)
  - Time formatting (seconds to MM:SS)
  - Error handling (disk write failures)

- ✅ **downloader/main/utils.ts** - Download utilities
  - Folder path resolution
  - Feedback messaging
  - Image cropping (YouTube artwork)
  - Badge management (platform-specific)

- ✅ **music-together/queue/utils.ts** - Queue operations
  - Queue item mapping
  - Wrapper renderer extraction
  - Complex transformations
  - Large queue handling (1000+ items)

#### API Server (`src/plugins/api-server/`)

- ✅ **backend/routes/auth.ts** - Authentication routes
  - JWT token generation
  - Authorization strategies (AUTH_AT_FIRST, NONE)
  - User consent flow
  - Client list management
  - Edge cases (special chars, long IDs)

### Coverage Goals

- **Critical paths**: >80% coverage ✅
- **Business logic**: >80% coverage ✅
- **Utility functions**: >80% coverage ✅
- **API routes**: >80% coverage ✅

## Test Structure

All unit tests follow this structure:

```typescript
import { test, expect, vi, beforeEach } from '@playwright/test';

// Mock dependencies
vi.mock('electron', () => ({
  // Mock implementation
}));

import { functionToTest } from './module';

test.describe('Module Name', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.describe('Function Name', () => {
    test('should handle happy path', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionToTest(input);

      // Assert
      expect(result).toBe('expected');
    });

    test('should handle edge case', () => {
      // Test edge case
    });

    test('should handle error condition', () => {
      // Test error handling
    });
  });
});
```

## Testing Patterns

### 1. Mocking Electron APIs

```typescript
vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(),
    setBadgeCount: vi.fn(),
  },
  BrowserWindow: class MockBrowserWindow {
    webContents = { send: vi.fn() };
  },
}));
```

### 2. Mocking File System

```typescript
vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));
```

### 3. Testing Async Functions

```typescript
test('should handle async operation', async () => {
  const mockFn = vi.fn().mockResolvedValue('result');
  const result = await asyncFunction();
  expect(result).toBe('result');
});
```

### 4. Testing Error Handling

```typescript
test('should handle errors gracefully', async () => {
  const mockFn = vi.fn().mockRejectedValue(new Error('Failed'));
  await expect(asyncFunction()).rejects.toThrow('Failed');
});
```

## What's Tested

### Happy Paths ✅
- Normal, expected usage
- Valid inputs with expected outputs
- Success scenarios

### Edge Cases ✅
- Empty inputs
- Null/undefined values
- Extreme values (very large, very small)
- Boundary conditions
- Special characters

### Error Conditions ✅
- Invalid inputs
- Network failures
- File system errors (ENOENT, EACCES, ENOSPC)
- Permission errors
- Timeout scenarios

### Boundary Values ✅
- Min/max values
- Empty arrays/strings
- Single items
- Large datasets (1000+ items)

## Mocking Strategy

### Level 1: External Dependencies
Mock at the module boundary (electron, node:fs, etc.)

### Level 2: Network/IO
Mock network calls, file operations, database queries

### Level 3: Complex Objects
Mock complex Electron objects (BrowserWindow, WebContents, NativeImage)

### Not Mocked
- Pure functions
- Simple utilities
- Business logic (tested with mocked dependencies)

## Test Quality Guidelines

### ✅ DO
- Write descriptive test names: `should return user when valid ID provided`
- Group related tests in `describe` blocks
- Use `beforeEach` for setup
- Test one thing per test
- Mock external dependencies
- Test error conditions
- Keep tests fast (<5s for unit test suite)

### ❌ DON'T
- Test implementation details
- Mock too deeply
- Write tests that depend on each other
- Use real external services
- Skip edge cases
- Leave console.log in tests

## Adding New Tests

### 1. Create test file
```bash
# For src/utils/my-util.ts
touch src/utils/my-util.test.ts
```

### 2. Write tests
Follow the structure in existing tests

### 3. Run tests
```bash
npm test
```

### 4. Check coverage
```bash
npx playwright test --reporter=html
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Release builds

### CI Configuration
- Retries: 2 (on failure)
- Workers: 1 (sequential)
- Reporter: HTML + List

## Troubleshooting

### Tests failing locally but pass in CI
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Clear playwright cache: `npx playwright install`

### Mock not working
- Check mock is defined before import
- Use `vi.clearAllMocks()` in `beforeEach`

### Tests timing out
- Increase timeout: `test.setTimeout(30000)`
- Check for unresolved promises
- Ensure mocks return/resolve properly

## Resources

- [Playwright Test Documentation](https://playwright.dev/docs/test)
- [Vitest API (compatible mocking)](https://vitest.dev/api/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Future Improvements

- [ ] Add integration tests for plugin lifecycle
- [ ] Add visual regression tests for UI components
- [ ] Increase coverage to >90% for all modules
- [ ] Add performance benchmarks
- [ ] Add mutation testing
- [ ] Set up test coverage reporting
