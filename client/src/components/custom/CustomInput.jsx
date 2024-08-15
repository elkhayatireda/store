import React from 'react';

const CustomInput = ({ label, value, onChange, error, ...props }) => {
    return (
        <div className="my-2">
            {label && <label>{label}</label>}
            <input
                className='py-2 pl-5  outline-none border-2 border-gray-200 rounded-xl w-full'
                value={value}
                onChange={onChange}
                {...props}
            />
            {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
    );
};

export default CustomInput;
