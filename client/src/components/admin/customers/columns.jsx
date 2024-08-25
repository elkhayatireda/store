import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import CustomInput from "@/components/custom/CustomInput";
import { useCustomers } from "@/contexts/customer";
import { Checkbox } from "@/components/ui/checkbox";

const customerColumns = [
    {
        accessorKey: "fullName",
        header: ({ column }) => (
            <Button
                className='p-0'
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Full Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => {
            const address = row.original.address;
            return (
                <span className="text-xs block truncate max-w-xs" title={address}>
                    {address.length > 100 ? `${address.substring(0, 100)}...` : address}
                </span>
            );
        },
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        id: "inBlacklist",
        header: "Blacklisted",
        cell: ({ row }) => {
            return <span className={`font-medium ${row.original.inBlacklist ? 'text-red-500' : 'text-green-500'}`}>
                {row.original.inBlacklist ? 'yes' : 'no'}
            </span>
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                className='p-0'
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Created
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);

            // Extract components from the date
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            // Format date as y-m-d h:m:s
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            return <div>{formattedDate}</div>;
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const customer = row.original;
            const { updateCustomer, deleteCustomer, validationErrors } = useCustomers();
            const [guestInfo, setGuestInfo] = useState({
                fullName: customer.fullName || '',
                phone: customer.phone || '',
                address: customer.address || '',
                inBlacklist: customer.inBlacklist || false,
            });

            const [saving, setSaving] = useState(false);

            const handleInputChange = (e) => {
                const { name, type, checked, value } = e.target;
                setGuestInfo((prev) => ({
                    ...prev,
                    [name]: type === 'checkbox' ? checked : value, // Use checked for checkboxes
                }));
            };


            const handleSave = async () => {
                setSaving(true);
                try {
                    await updateCustomer(customer._id, guestInfo);
                } finally {
                    setSaving(false);
                }
            };

            const handleDelete = async () => {
                if (window.confirm("Are you sure you want to delete this customer?")) {
                    await deleteCustomer(customer._id);
                }
            };

            return (
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <DialogTrigger className='text-blue-600'>
                                    Update
                                </DialogTrigger>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Customer</DialogTitle>
                            <DialogDescription>
                                Update the customer information below.
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
                            <div>
                                <input
                                    type="checkbox"
                                    id="blacklist"
                                    name="inBlacklist"
                                    checked={guestInfo.inBlacklist}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor='blacklist'>Blacklisted</label>
                            </div>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            );
        },
    },
]

export default customerColumns;