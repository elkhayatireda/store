import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression'; // Import the library
import { axiosClient } from '@/api/axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronLeft, CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomInput from '@/components/custom/CustomInput';
import CustomTextInput from '@/components/custom/CustomTextInput';

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
    }, [id, navigate]);

    const validate = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (id === 'create' && !img && !imgPreview) newErrors.img = 'Image is required';
        return newErrors;
    };

    const handleDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            try {
                if (file.size > 5 * 1024 * 1024) { // 5MB
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        img: 'File size too large. Max size is 5MB.'
                    }));
                    setImg(null);
                    setImgPreview(null);
                    return;
                }

                // Compress the image
                const options = {
                    maxSizeMB: 1, // Max size of compressed image in MB
                    maxWidthOrHeight: 800, // Max width or height of compressed image
                    useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, options);

                // Create a preview URL for the compressed image
                const compressedImagePreviewUrl = URL.createObjectURL(compressedFile);

                setImg(compressedFile);
                setImgPreview(compressedImagePreviewUrl);
                setErrors(prevErrors => ({
                    ...prevErrors,
                    img: null
                }));
            } catch (error) {
                console.error('Error compressing image:', error);
                toast.error('Error compressing image');
            }
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: 'image/*',
        maxSize: 5 * 1024 * 1024 // 5MB
    });

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
            <Link
                className='flex items-center gap-0.5 text-blue-500'
                to={'/admin/categories'}
            >
                <ChevronLeft size={18} /> Back
            </Link>
            <h2 className='text-xl font-semibold'>
                {id !== 'create' ? `Edit ${title} Category` : 'Create a new category'}
            </h2>

            <form className='mt-7' onSubmit={handleSubmit}>
                <div className='w-full flex flex-col sm:flex-row justify-center items-center gap-8'>
                    <div>
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
                        <div
                            {...getRootProps({ className: 'dropzone' })}
                            className='border-2 border-dashed border-gray-300 p-4 text-center'
                        >
                            <input {...getInputProps()} />
                            <div className='text-gray-500 flex flex-col items-center justify-center'>
                                <CloudUpload size={90} />
                                <p>Drag & drop an image here, or click to select one</p>
                            </div>
                        </div>
                        {errors.img && <p className='text-red-500'>{errors.img}</p>}
                    </div>
                    <div>
                        <h4 className='font-medium'>Preview</h4>
                        <div className='rounded border shadow-sm'>
                            {imgPreview ? (
                                <img
                                    className='w-44 h-44 aspect-square object-cover rounded-sm rounded-b-none'
                                    src={imgPreview}
                                    alt="Selected preview"
                                />
                            ) :
                                <div className='bg-gray-200 w-44 h-44'></div>
                            }
                            <div className='p-2'>
                                <p className='font-medium capitalize'>{title || 'Title'}</p>
                                <p className='text-xs text-gray-500 max-w-36 overflow-x-auto'>
                                    {description.length > 100 ? `${description.substring(0, 100)}...` : description || 'Description'}
                                </p>
                            </div>
                        </div>
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