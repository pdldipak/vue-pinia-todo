import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Intl.DateTimeFormat since it might behave differently in different environments
const mockDateTimeFormat = vi.fn((locale, options) => ({
  format: (date) => new Date(date).toLocaleString(locale, options),
}))

globalThis.Intl.DateTimeFormat = mockDateTimeFormat
