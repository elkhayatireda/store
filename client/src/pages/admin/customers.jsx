import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CustomersTable } from '@/components/admin/customers/table';
import customerColumns from '@/components/admin/customers/columns';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import CustomInput from '@/components/custom/CustomInput';
import { Button } from '@/components/ui/button';
import { useCustomers } from '@/contexts/customer';

function Customers() {
    const { data, createCustomer, validationErrors } = useCustomers();
    const [saving, setSaving] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        fullName: '',
        phone: '',
        address: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prevInfo => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            // Attempt to create a new customer using the context's function
            await createCustomer(guestInfo);

            // Reset the form if creation is successful
            setGuestInfo({
                fullName: '',
                phone: '',
                address: '',
            });
        } catch (error) {
            console.error('Error creating customer:', error);
        } finally {
            setSaving(false);
        }
    };

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