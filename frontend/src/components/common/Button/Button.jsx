import './Button.css';
import clsx from 'clsx';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    className,
    ...props
}) => {
    const buttonClasses = clsx(
        'button',
        `button--${variant}`,
        `button--${size}`,
        {
            'button--full-width': fullWidth,
            'button--loading': loading,
        },
        className
    );

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <span className="button__spinner"></span>
            ) : (
                children
            )}
        </button>
    );
};
