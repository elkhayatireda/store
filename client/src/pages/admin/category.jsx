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
    const [imgPreview, setImgPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        if (id !== 'create') {
            const fetchCategory = async () => {
                try {
                    const res = await axiosClient.get(`/categories/${id}`);
                    const { title, description, imgPath } = res.data;
                    setTitle(title);
                    setDescription(description);
                    setImgPreview(imgPath);
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
            if (file.size > 5 * 1024 * 1024) { // 5MB
                setErrors(prevErrors => ({
                    ...prevErrors,
                    img: 'File size too large. Max size is 5MB.'
                }));
                setImg(null);
                setImgPreview(null);
            } else {
                setImg(file);
                setImgPreview(URL.createObjectURL(file)); // Create a preview URL for the image
                setErrors(prevErrors => ({
                    ...prevErrors,
                    img: null
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setLoading(true);
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (img) formData.append('img', img);

            try {
                const url = id !== 'create' ? `/categories/${id}` : '/categories';
                await axiosClient.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setTitle('');
                setDescription('');
                setImg(null);
                setImgPreview(null);
                setErrors({});
                setLoading(false);

                toast.success('Category saved successfully');
                navigate('/admin/categories');
            } catch (error) {
                console.error(error);
                toast.error(error.response.data.message);
                setLoading(false);
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
                            onChange={handleImageChange}
                            error={errors.img}
                            type="file"
                        />
                    </div>
                </div>
                <div className='mt-5 flex justify-end'>
                    <Button
                        className='bg-blue-600 text-white'
                        type="submit"
                        disabled={loading}
                    >
                        {id !== 'create' ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;