import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { CustomersTable } from '@/components/admin/customers/table';
import customerColumns from '@/components/admin/customers/columns';
import { axiosClient } from '@/api/axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import CustomInput from '@/components/custom/CustomInput';
import { Button } from '@/components/ui/button';

function Customers() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [guestInfo, setGuestInfo] = useState({
        fullName: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axiosClient.get('/customers');
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prevInfo => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const validateInputs = () => {
        const errors = {};

        if (!guestInfo.fullName.trim()) {
            errors.fullName = 'Full Name is required';
        }

        if (!guestInfo.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\d+$/.test(guestInfo.phone)) {
            errors.phone = 'Phone number must contain only digits';
        }

        if (!guestInfo.address.trim()) {
            errors.address = 'Address is required';
        }

        setValidationErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateInputs()) {
            return;
        }

        setSaving(true);

        const { fullName, address, phone } = guestInfo;

        try {
            const response = await axiosClient.post('/customers', { fullName, address, phone });
            toast.success('Customer created successfully');
            console.log('Customer created successfully:', response.data);

            // Push the new customer to the data state
            setData(prevData => [...prevData, response.data]);

            // Reset the form
            setGuestInfo({
                fullName: '',
                phone: '',
                address: '',
            });
        } catch (error) {
            toast.error('Error creating customer');
            console.error('Error creating customer:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                <div>
                    <h2 className="text-2xl font-semibold">Customers</h2>
                    <p className='text-sm'>Here you can manage your clients</p>
                </div>
                <Dialog>
                    <DialogTrigger className='flex items-center gap-1 px-3 py-1.5 rounded bg-blue-950 text-white'>
                        Create <Plus size={18} />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create new customer</DialogTitle>
                            <DialogDescription>
                                Create a new customer, make sure to enter correct info
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label>Full Name:</label>
                                <CustomInput
                                    type="text"
                                    name="fullName"
                                    value={guestInfo.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {validationErrors.fullName && (
                                    <p className="text-red-500 text-sm">{validationErrors.fullName}</p>
                                )}
                            </div>
                            <div>
                                <label>Phone:</label>
                                <CustomInput
                                    type="text"
                                    name="phone"
                                    value={guestInfo.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                {validationErrors.phone && (
                                    <p className="text-red-500 text-sm">{validationErrors.phone}</p>
                                )}
                            </div>
                            <div>
                                <label>Address:</label>
                                <CustomInput
                                    type="text"
                                    name="address"
                                    value={guestInfo.address}
                                    onChange={handleInputChange}
                                    required
                                />
                                {validationErrors.address && (
                                    <p className="text-red-500 text-sm">{validationErrors.address}</p>
                                )}
                            </div>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <CustomersTable columns={customerColumns} data={data} />
        </div>
    );
}

export default Customers;