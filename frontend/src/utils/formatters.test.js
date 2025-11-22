import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, capitalizeFirst } from '@utils/formatters'

describe('Formatters', () => {
    describe('formatCurrency', () => {
        it('formats number as currency', () => {
            expect(formatCurrency(1000)).toBe('$1.000')
            expect(formatCurrency(1500.50)).toBe('$1.501')
        })
    })

    describe('formatDate', () => {
        it('formats date correctly', () => {
            const date = new Date('2024-01-15T10:30:00')
            expect(formatDate(date, 'dd/MM/yyyy')).toBe('15/01/2024')
        })
    })

    describe('capitalizeFirst', () => {
        it('capitalizes first letter', () => {
            expect(capitalizeFirst('hello')).toBe('Hello')
            expect(capitalizeFirst('WORLD')).toBe('World')
        })
    })
})
