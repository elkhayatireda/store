import React from 'react';

const CustomInput = ({ label, value, onChange, error, ...props }) => {
    return (
        <div className="input-container">
            {label && <label>{label}</label>}
            <input
                className={`input ${error ? 'input-error' : ''}`}
                value={value}
                onChange={onChange}
                {...props}
            />
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default CustomInput;
