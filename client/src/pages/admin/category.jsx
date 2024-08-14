import CustomInput from '@/components/custom/CustomInput';
import CustomTextInput from '@/components/custom/CustomTextInput';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { axiosClient } from '@/api/axios';

const CategoryForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [img, setImgPath] = useState(null);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (!img) newErrors.img = 'Image is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('img', img);

            try {
                const res = await axiosClient.post('/categories', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log(res);
                setTitle('');
                setDescription('');
                setImgPath(null);
                setErrors({});
            } catch (error) {
                console.error('Error creating category:', error);
            }
        }
    };

    return (
        <div>
            <h2>Create a new category</h2>
            <form onSubmit={handleSubmit}>
                <CustomInput
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={errors.title}
                    type="text"
                />
                <CustomTextInput
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={errors.description}
                    type="text"
                />
                <CustomInput
                    label="Image"
                    onChange={(e) => setImgPath(e.target.files[0])}
                    error={errors.img}
                    type="file"
                />
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default CategoryForm;