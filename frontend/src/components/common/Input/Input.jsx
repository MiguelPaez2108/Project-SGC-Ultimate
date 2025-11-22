import './Input.css';
import clsx from 'clsx';
import { forwardRef } from 'react';

export const Input = forwardRef(({
    label,
    error,
    helperText,
    fullWidth = false,
    icon,
    type = 'text',
    className,
    ...props
}, ref) => {
    const inputClasses = clsx(
        'input',
        {
            'input--error': error,
            'input--full-width': fullWidth,
            'input--with-icon': icon,
        },
        className
    );

    return (
        <div className={clsx('input-wrapper', { 'input-wrapper--full-width': fullWidth })}>
            {label && (
                <label className="input__label">
                    {label}
                    {props.required && <span className="input__required">*</span>}
                </label>
            )}

            <div className="input__container">
                {icon && <span className="input__icon">{icon}</span>}
                <input
                    ref={ref}
                    type={type}
                    className={inputClasses}
                    {...props}
                />
            </div>

            {(error || helperText) && (
                <p className={clsx('input__helper', { 'input__helper--error': error })}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});
