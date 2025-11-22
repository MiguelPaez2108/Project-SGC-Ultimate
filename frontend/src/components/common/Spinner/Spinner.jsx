import './Spinner.css';

export const Spinner = ({ size = 'md', color = 'var(--primary-600)' }) => {
    return (
        <div className={`spinner spinner--${size}`}>
            <div className="spinner-circle" style={{ borderTopColor: color }} />
        </div>
    );
};
