import CustomInput from '@/components/custom/CustomInput';
import CustomTextInput from '@/components/custom/CustomTextInput';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { axiosClient } from '@/api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CategoryForm = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [img, setImg] = useState(null);
    const [imgPreview, setImgPreview] = useState(null); // State to store the image preview URL
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
                    setImgPreview(imgPath); // Set the existing image path for preview
                } catch (error) {
                    console.error(error);
                    toast.error('Error fetching category');
                }
            };
            fetchCategory();
        }
    }, [id]);

    const validate = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (!imgPreview && id === 'create') newErrors.img = 'Image is required';
        return newErrors;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg(file);
            setImgPreview(URL.createObjectURL(file)); // Create a preview URL for the image
        }
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
                setImg(null);
                setImgPreview(null);
                setErrors({});

                toast.success('Category saved successfully');
                navigate('/admin/categories');
            } catch (error) {
                console.error(error);
                toast.error('Error submitting');
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
                <div className='flex items-center justify-between'>
                    <CustomInput
                        label="Image"
                        onChange={handleImageChange} // Use the new handler
                        error={errors.img}
                        type="file"
                    />
                    {imgPreview && (
                        <img
                            className='w-80 h-80 aspect-square object-cover'
                            src={imgPreview}
                            alt="Selected preview"
                        />
                    )}
                </div>
                <Button type="submit">{id !== 'create' ? 'Update' : 'Create'}</Button>
            </form>
        </div>
    );
};

export default CategoryForm;