import { axiosClient } from '@/api/axios';
import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

const CustomersContext = createContext();

export const useCustomers = () => useContext(CustomersContext);

export const CustomersProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/customers');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching customers:", error);
                toast.error('Failed to fetch customers');
            }
        };
        fetchData();
    }, []);

    const validateCustomerData = async (customerData, isUpdate = false, customerId = null) => {
        const errors = {};
        const { fullName, phone, address } = customerData;

        // Check if full name is provided and valid
        if (!fullName) {
            errors.fullName = 'Full Name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
            errors.fullName = 'Full Name must contain only letters and spaces';
        }

        // Check if phone number is provided and valid
        if (!phone) {
            errors.phone = 'Phone number is required';
        } else if (!/^\d+$/.test(phone)) {
            errors.phone = 'Phone number must contain only digits';
        }

        // Check if address is provided
        if (!address) {
            errors.address = 'Address is required';
        }

        // Check for duplicate phone numbers
        try {
            const response = await axiosClient.get('/customers');
            const existingCustomer = response.data.find(c => c.phone === phone && c._id !== customerId);
            if (existingCustomer) {
                toast.error('Customer with this phone number already exists');
                errors.phone = 'Phone number already in use';
            }
        } catch (error) {
            console.error('Error checking for duplicate phone:', error);
            toast.error('Failed to validate phone number');
        }

        setValidationErrors(errors);
        return errors;
    };

    const createCustomer = async (customerData) => {
        const errors = await validateCustomerData(customerData);

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axiosClient.post('/customers', customerData);
                setData(prevData => [...prevData, response.data]);
                toast.success('Customer created successfully');
                setValidationErrors({})
                return true
            } catch (error) {
                console.error('Error creating customer:', error);
                toast.error('Failed to create customer');
                return false
            }
        } else {
            return false
        }
    };

    const updateCustomer = async (customerId, customerData) => {
        const errors = await validateCustomerData(customerData, true, customerId);

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axiosClient.put(`/customers/${customerId}`, customerData);
                setData(prevData =>
                    prevData.map(customer =>
                        customer._id === customerId ? response.data : customer
                    )
                );
                toast.success('Customer updated successfully');
                setValidationErrors({});
                return true;
            } catch (error) {
                console.error('Error updating customer:', error);
                toast.error('Failed to update customer');
                return false;
            }
        } else {
            setValidationErrors(errors);
            return false;
        }
    };

    const deleteCustomer = async (customerId) => {
        try {
            await axiosClient.delete(`/customers/${customerId}`);
            setData(prevData => prevData.filter(customer => customer._id !== customerId));
            toast.success('Customer deleted successfully');
        } catch (error) {
            console.error('Error deleting customer:', error);
            toast.error('Failed to delete customer');
        }
    };

    return (
        <CustomersContext.Provider value={{ data, createCustomer, updateCustomer, deleteCustomer, validationErrors }}>
            {children}
        </CustomersContext.Provider>
    );
};