import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from '@components/common/Input'

describe('Input Component', () => {
    it('renders input with label', () => {
        render(<Input label="Email" />)
        expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('displays error message', () => {
        render(<Input error="This field is required" />)
        expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('displays helper text', () => {
        render(<Input helperText="Enter your email" />)
        expect(screen.getByText('Enter your email')).toBeInTheDocument()
    })
})
