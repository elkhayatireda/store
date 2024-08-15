import CustomInput from '@/components/custom/CustomInput';
import CustomTextInput from '@/components/custom/CustomTextInput';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { axiosClient } from '@/api/axios';
import { useParams } from 'react-router-dom';

const CategoryForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [img, setImgPath] = useState(null);
    const [errors, setErrors] = useState({});
    const { id } = useParams();

    useEffect(() => {
        if (id !== 'create') {
            const fetchCategory = async () => {
                try {
                    const res = await axiosClient.get(`/categories/${id}`);
                    const { title, description, imgPath } = res.data;
                    setTitle(title);
                    setDescription(description);
                    setImgPath(imgPath);
                } catch (error) {
                    console.error('Error fetching category:', error);
                }
            };
            fetchCategory();
        }
    }, [id]);

    const validate = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (!img && id === 'create') newErrors.img = 'Image is required';
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
            if (img) formData.append('img', img); // Append file only if a new one is selected

            try {
                if (id !== 'create') {
                    // Update existing category
                    await axiosClient.put(`/categories/${id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } else {
                    // Create new category
                    await axiosClient.post('/categories', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                }

                // Reset form and errors
                setTitle('');
                setDescription('');
                setImgPath(null);
                setErrors({});

                console.log("Category saved successfully");
                // Optionally, redirect or show a success message
            } catch (error) {
                console.error('Error submitting category:', error);
            }
        }
    };

    return (
        <div>
            <h2>{id !== 'create' ? 'Edit Category' : 'Create a new category'}</h2>
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
                <Button type="submit">{id !== 'create' ? 'Update' : 'Create'}</Button>
            </form>
        </div>
    );
};

export default CategoryForm;