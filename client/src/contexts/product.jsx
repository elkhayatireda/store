import { axiosClient } from '@/api/axios';
import { createContext, useState, useEffect, useContext } from 'react';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await axiosClient.get('/products');
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    useEffect(() => {
        
        fetchData();
    }, []);
    // deleteCategory
    const deleteProduct = async (productId) => {
        try {
            await axiosClient.delete(`/products/${productId}`);
            setData(prevData => prevData.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const changeVisibility = async (productId) => {
        try {
            await axiosClient.post(`/products/hide-show/${productId}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const deleteMultipleProducts = async (productIds) => {
        try {
            await axiosClient.post('/products/delete-multiple', { ids: productIds });
            setData(prevData => prevData.filter(product => !productIds.includes(product._id)));
            fetchData();
        } catch (error) {
            console.error('Error deleting multiple products:', error);
        }
    };

    return (
        <ProductsContext.Provider value={{ data, deleteProduct, changeVisibility, deleteMultipleProducts }}>
            {children}
        </ProductsContext.Provider>
    );
};