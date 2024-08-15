import React, { useState, useEffect } from 'react';
import { axiosClient } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

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
            <h1 className="text-2xl font-bold mb-6">Categories</h1>
            <Link to={'/admin/categories/create'}>create</Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div key={category._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img
                            src={category.imgPath}
                            alt={category.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                            <p className="text-gray-600 mb-4">{category.description}</p>
                            <Button
                                variant='destructive'
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                onClick={() => handleDelete(category._id)}
                            >
                                Delete
                            </Button>
                            <Link to={'/admin/categories/' + category._id}>update</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Categories;