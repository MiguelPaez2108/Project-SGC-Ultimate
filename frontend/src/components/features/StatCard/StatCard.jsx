import './StatCard.css';

export const StatCard = ({
    label,
    value,
    icon,
    color = 'var(--primary-500)',
    change,
    trend = 'up'
}) => {
    return (
        <div className="stat-card-component">
            <div className="stat-card-icon" style={{ color }}>
                {icon}
            </div>
            <div className="stat-card-content">
                <p className="stat-card-label">{label}</p>
                <div className="stat-card-value-row">
                    <h3 className="stat-card-value">{value}</h3>
                    {change && (
                        <span className={`stat-card-change stat-card-change--${trend}`}>
                            {change}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
