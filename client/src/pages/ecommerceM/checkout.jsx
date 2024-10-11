import { useState } from 'react';
import CustomInput from '@/components/custom/CustomInput';

function Checkout() {
    const [cartItems, setCartItems] = useState(() => {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
    });

    const [formDetails, setFormDetails] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
    });

    const [errors, setErrors] = useState({});

    // Validation function for the form
    const validateForm = (name, value) => {
        const newErrors = { ...errors }; // Keep existing errors
        switch (name) {
            case 'fullName':
                if (!value) {
                    newErrors.fullName = 'Le nom complet est requis.';
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    newErrors.fullName = 'Le nom complet doit contenir uniquement des lettres.';
                } else {
                    delete newErrors.fullName;
                }
                break;
            case 'phoneNumber':
                if (!value) {
                    newErrors.phoneNumber = 'Le numéro de téléphone est requis.';
                } else if (!/^\d+$/.test(value)) {
                    newErrors.phoneNumber = 'Le numéro de téléphone doit contenir uniquement des chiffres.';
                } else {
                    delete newErrors.phoneNumber;
                }
                break;
            case 'address':
                if (!value) {
                    newErrors.address = 'L\'adresse est requise.';
                } else {
                    delete newErrors.address;
                }
                break;
            default:
                break;
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDetails({ ...formDetails, [name]: value });
        const validationErrors = validateForm(name, value);
        setErrors(validationErrors); // Update errors in real-time
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm('fullName', formDetails.fullName);
        Object.assign(validationErrors, validateForm('phoneNumber', formDetails.phoneNumber));
        Object.assign(validationErrors, validateForm('address', formDetails.address));

        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        // Log the details upon successful form submission
        console.log({
            guestInfo: formDetails,
            items: cartItems,
            totalPrice,
            status: 'pending',
        });

        // Optionally reset form after submission
        setFormDetails({
            fullName: '',
            phoneNumber: '',
            address: '',
        });
        setErrors({});
    };

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0).toFixed(2);

    return (
        <div className='p-5'>
            <div className="w-full grid grid-cols-1 md:grid-cols-2">
                <div className='md:pr-5 md:border-r'>
                    <h1 className="text-2xl font-semibold mb-6">Caise</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <CustomInput
                            name="fullName"
                            label="Nom complet"
                            value={formDetails.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                        />
                        <CustomInput
                            name="phoneNumber"
                            label="Numéro de téléphone"
                            value={formDetails.phoneNumber}
                            onChange={handleChange}
                            error={errors.phoneNumber}
                        />
                        <CustomInput
                            name="address"
                            label="Adresse"
                            value={formDetails.address}
                            onChange={handleChange}
                            error={errors.address}
                        />
                        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
                            Sauvegarder
                        </button>
                    </form>
                </div>

                <div className='mt-10 md:mt-0 md:pl-5'>
                    <h2 className='text-lg font-medium mb-4'>Résumé de la commande</h2>
                    <ul className="space-y-2 mb-6">
                        {cartItems.map((item) => (
                            <li key={item.id + item.variant} className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                                <span className='text-sm'>{item.title} ({item.variant})</span>
                                <span className='text-xs'>{item.quantity} x {item.unitPrice} MAD</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">Total:</span>
                        <span className="text-lg">{totalPrice} MAD</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;