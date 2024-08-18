import { axiosClient } from '@/api/axios';
import { createContext, useState, useEffect, useContext } from 'react';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/products');
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchData();
    }, []);

    const deleteCategory = async (categoryId) => {
        try {
            await axiosClient.delete(`/products/${categoryId}`);
            setData(prevData => prevData.filter(category => category._id !== categoryId));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const deleteMultipleCategories = async (categoryIds) => {
        try {
            await axiosClient.post('/categories/delete-multiple', { ids: categoryIds });
            setData(prevData => prevData.filter(category => !categoryIds.includes(category._id)));
        } catch (error) {
            console.error('Error deleting multiple categories:', error);
        }
    };

    return (
        <ProductsContext.Provider value={{ data, deleteCategory, deleteMultipleCategories }}>
            {children}
        </ProductsContext.Provider>
    );
};