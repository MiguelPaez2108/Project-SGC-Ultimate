import './Card.css';
import clsx from 'clsx';

export const Card = ({
    children,
    title,
    subtitle,
    footer,
    hoverable = false,
    className,
    ...props
}) => {
    const cardClasses = clsx(
        'card',
        {
            'card--hoverable': hoverable,
        },
        className
    );

    return (
        <div className={cardClasses} {...props}>
            {(title || subtitle) && (
                <div className="card__header">
                    {title && <h3 className="card__title">{title}</h3>}
                    {subtitle && <p className="card__subtitle">{subtitle}</p>}
                </div>
            )}

            <div className="card__body">
                {children}
            </div>

            {footer && (
                <div className="card__footer">
                    {footer}
                </div>
            )}
        </div>
    );
};
