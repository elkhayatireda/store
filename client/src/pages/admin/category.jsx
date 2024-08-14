import CustomInput from '@/components/custom/CustomInput';
import React, { useState } from 'react';

const CategoryForm = () => {
    const [title, setTitle] = useState('');
    const [imgPath, setImgPath] = useState('');
    const [url, setUrl] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (!imgPath) newErrors.imgPath = 'Image Path is required';
        if (!url) newErrors.url = 'URL is required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            // Submit the form data (e.g., send it to the backend)
            const categoryData = { title, imgPath, url };
            console.log('Submitting:', categoryData);

            // Reset form after submission
            setTitle('');
            setImgPath('');
            setUrl('');
            setErrors({});
        }
    };

    return (
        <form onSubmit={handleSubmit} className='bg-red-700'>
            <CustomInput
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                type="text"
            />
            <CustomInput
                label="Image Path"
                value={imgPath}
                onChange={(e) => setImgPath(e.target.value)}
                error={errors.imgPath}
                type="text"
            />
            <CustomInput
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                error={errors.url}
                type="text"
            />
            <button type="submit" className="submit-button">Submit</button>
        </form>
    );
};

export default CategoryForm;
