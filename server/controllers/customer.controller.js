import Customer from '../models/customer.model.js';

// Create a New Customer
export const createCustomer = async (req, res) => {
    try {
        const { fullName, phone, address } = req.body;

        // Check if a customer with the same phone number already exists
        const existingCustomer = await Customer.findOne({ phone });
        if (existingCustomer) {
            return res.status(400).json({ message: "Customer with this phone number already exists" });
        }

        const customer = new Customer({
            fullName,
            phone,
            address,
        });

        const createdCustomer = await customer.save();
        res.status(201).json(createdCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Customers
export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Customer by ID
export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: "Customer not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Customer
export const updateCustomer = async (req, res) => {
    try {
        const { fullName, phone, address } = req.body;

        // Check if a customer with the same phone number exists (excluding the current customer)
        const existingCustomer = await Customer.findOne({ phone });
        if (existingCustomer && existingCustomer._id.toString() !== req.params.id) {
            return res.status(400).json({ message: "There is another customer with this phone number" });
        }

        // Find the customer by ID
        const customer = await Customer.findById(req.params.id);

        if (customer) {
            // Update the fields only if new data is provided
            customer.fullName = fullName ?? customer.fullName;
            customer.phone = phone ?? customer.phone;
            customer.address = address ?? customer.address;

            // Save the updated customer
            const updatedCustomer = await customer.save();
            res.status(200).json(updatedCustomer);
        } else {
            res.status(404).json({ message: "Customer not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a Customer
export const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (customer) {
            res.status(200).json({ message: "Customer removed" });
        } else {
            res.status(404).json({ message: "Customer not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
