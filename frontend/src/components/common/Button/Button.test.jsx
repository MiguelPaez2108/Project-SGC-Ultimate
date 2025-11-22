import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@components/common/Button'

describe('Button Component', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('applies primary variant class', () => {
        render(<Button variant="primary">Primary</Button>)
        const button = screen.getByText('Primary')
        expect(button).toHaveClass('btn--primary')
    })

    it('handles click events', () => {
        let clicked = false
        render(<Button onClick={() => { clicked = true }}>Click</Button>)
        screen.getByText('Click').click()
        expect(clicked).toBe(true)
    })

    it('disables button when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>)
        expect(screen.getByText('Disabled')).toBeDisabled()
    })
})
