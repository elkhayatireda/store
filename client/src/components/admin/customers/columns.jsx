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
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return <div>{date.toLocaleDateString('fr-FR', options)}</div>;
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
            });
            const [saving, setSaving] = useState(false);

            const handleInputChange = (e) => {
                const { name, value } = e.target;
                setGuestInfo((prev) => ({ ...prev, [name]: value }));
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