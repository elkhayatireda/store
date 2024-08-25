import { axiosClient } from '@/api/axios';
import { createContext, useState, useEffect, useContext } from 'react';

const CouponsContext = createContext();

export const useCoupons = () => useContext(CouponsContext);

export const CouponsProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await axiosClient.get('/coupons');
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
    const deleteCoupon = async (id) => {
        try {
            await axiosClient.delete(`/coupons/${id}`);
            setData(prevData => prevData.filter(coupon => coupon._id !== id));
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    const changeStatus = async (id) => {
        try {
            await axiosClient.post(`/coupons/status/${id}`);
            setData(prevData => prevData.map(coupon => 
                coupon._id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
            ));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const deleteMultipleCoupons = async (id) => {
        try {
            await axiosClient.post('/coupons/delete-multiple', { ids: id });
            setData(prevData => prevData.filter(coupon => !id.includes(coupon._id)));
            fetchData();
        } catch (error) {
            console.error('Error deleting multiple coupons:', error);
        }
    };

    return (
        <CouponsContext.Provider value={{ data, deleteCoupon, changeStatus, deleteMultipleCoupons }}>
            {children}
        </CouponsContext.Provider>
    );
};