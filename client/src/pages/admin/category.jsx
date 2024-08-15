import CustomInput from '@/components/custom/CustomInput';
import CustomTextInput from '@/components/custom/CustomTextInput';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { axiosClient } from '@/api/axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronLeft } from 'lucide-react';

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
            <div className='flex items-center justify-between'>
                <h2 className='text-xl font-semibold'>
                    {id !== 'create' ? `Edit ${title} Category` : 'Create a new category'}
                </h2>
                <Link
                    className='flex items-center gap-0.5 text-blue-500'
                    to={'/admin/categories'}
                >
                    <ChevronLeft size={18} /> Back
                </Link>
            </div>
            <form className='mt-7' onSubmit={handleSubmit}>
                <div className='w-full flex justify-center items-center gap-8'>
                    <div className='w-full'>
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
                    </div>
                    <div className='w-full'>
                        {imgPreview && (
                            <img
                                className='w-24 h-24 aspect-square object-cover rounded-sm'
                                src={imgPreview}
                                alt="Selected preview"
                            />
                        )}
                        <CustomInput
                            label="Image"
                            onChange={handleImageChange} // Use the new handler
                            error={errors.img}
                            type="file"
                        />
                    </div>
                </div>
                <div className='mt-5 flex justify-end'>
                    <Button
                        className='bg-blue-600 text-white'
                        type="submit"
                    >
                        {id !== 'create' ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;