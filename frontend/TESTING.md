# Testing Guide

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Structure

- `src/components/**/*.test.jsx` - Component tests
- `src/utils/**/*.test.js` - Utility function tests
- `src/test/setup.js` - Test configuration

## Writing Tests

Example component test:

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Coverage

Run `npm run test:coverage` to generate a coverage report in `coverage/` directory.
