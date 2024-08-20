import { axiosClient } from '@/api/axios';
import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

const OrdersContext = createContext();

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/orders');
                setData(response.data);
                console.log(response);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchData();
    }, []);

    const deleteOrder = async (id) => {
        try {
            await axiosClient.delete(`/orders/${id}`);
            setData(prevData => prevData.filter(order => order._id !== id));
            toast.success('Order deleted successfully');
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Failed to delete order');
        }
    };

    const deleteMultipleOrders = async (ids) => {
        try {
            await axiosClient.post('/orders/delete-multiple', { ids });
            setData(prevData => prevData.filter(order => !ids.includes(order._id)));
        } catch (error) {
            console.error('Error deleting multiple categories:', error);
        }
    };

    return (
        <OrdersContext.Provider value={{ data, deleteOrder, deleteMultipleOrders }}>
            {children}
        </OrdersContext.Provider>
    );
};