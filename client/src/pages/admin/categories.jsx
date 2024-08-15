import React, { useState, useEffect } from 'react';
import { axiosClient } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

function Categories() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosClient.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error(error);
                toast.error('Error fetching categories')
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axiosClient.delete(`/categories/${id}`);
                setCategories(categories.filter((category) => category._id !== id));
                toast.success('category deleted')
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete category')
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className='mb-6 flex justify-between items-center'>
                <div>
                    <h2 className="text-2xl font-semibold">Categories</h2>
                    <p className='text-sm'>Here you can manage the catagories in your store</p>
                </div>
                <Link
                    className='flex items-center gap-1 px-3 py-1.5 rounded bg-blue-950 text-white'
                    to={'/admin/categories/create'}
                >
                    Create <Plus size={18} />
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div key={category._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img
                            src={category.imgPath}
                            alt={category.title}
                            className="w-full h-48 object-cover aspect-square"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-medium">{category.title}</h3>
                            <p className="text-xs text-gray-600 mb-4">{category.description}</p>
                            <div className='flex justify-end items-center gap-2'>
                                <Button
                                    variant='destructive'
                                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(category._id)}
                                >
                                    Delete
                                </Button>
                                <Link
                                    className='px-3 py-2 rounded bg-blue-600 text-white'
                                    to={'/admin/categories/' + category._id}
                                >
                                    update
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Categories;