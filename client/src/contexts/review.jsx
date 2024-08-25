import { axiosClient } from '@/api/axios';
import { createContext, useState, useEffect, useContext } from 'react';

const ReviewsContext = createContext();

export const useReviews = () => useContext(ReviewsContext);

export const ReviewsProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await axiosClient.get('/reviews');
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
    const deleteReview = async (id) => {
        try {
            await axiosClient.delete(`/reviews/${id}`);
            setData(prevData => prevData.filter(review => review._id !== id));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const changeStatus = async (id) => {
        try {
            console.log('good')
            await axiosClient.post(`/reviews/status/${id}`);
            setData(prevData => prevData.map(review => 
                review._id === id ? { ...review, status: !review.status } : review
            ));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const deleteMultipleReviews = async (id) => {
        try {
            await axiosClient.post('/reviews/delete-multiple', { ids: id });
            setData(prevData => prevData.filter(review => !id.includes(review._id)));
            fetchData();
        } catch (error) {
            console.error('Error deleting multiple reviews:', error);
        }
    };

    return (
        <ReviewsContext.Provider value={{ data, deleteReview, changeStatus, deleteMultipleReviews }}>
            {children}
        </ReviewsContext.Provider>
    );
};