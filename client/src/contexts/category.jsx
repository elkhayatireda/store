import { axiosClient } from '@/api/axios';
import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({ children }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/categories');
                setData(response.data);
                console.log(response);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchData();
    }, []);

    const deleteCategory = async (categoryId) => {
        try {
            await axiosClient.delete(`/categories/${categoryId}`);
            setData(prevData => prevData.filter(category => category._id !== categoryId));
            toast.success('Category deleted successfully');
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        }
    };

    const deleteMultipleCategories = async (categoryIds) => {
        try {
            await axiosClient.post('/categories/delete-multiple', { ids: categoryIds });
            setData(prevData => prevData.filter(category => !categoryIds.includes(category._id)));
            toast.success('Selected categories deleted successfully');
        } catch (error) {
            console.error('Error deleting multiple categories:', error);
            toast.error('Failed to delete selected categories');
        }
    };

    return (
        <CategoriesContext.Provider value={{ data, deleteCategory, deleteMultipleCategories }}>
            {children}
        </CategoriesContext.Provider>
    );
};