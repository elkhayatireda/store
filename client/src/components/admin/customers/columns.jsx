import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import { axiosClient } from "@/api/axios";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/custom/CustomInput";

const customerColumns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "fullName",
        header: ({ column }) => {
            return (
                <Button
                    className='p-0'
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "address",
        header: "Adress",
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
        header: ({ column }) => {
            return (
                <Button
                    className='p-0'
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('fr-FR', options);
            return <div>
                {formattedDate}
            </div>
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const customer = row.original;
            const [guestInfo, setGuestInfo] = useState({
                fullName: customer.fullName || '',
                phone: customer.phone || '',
                address: customer.address || '',
            });
            const [validationErrors, setValidationErrors] = useState({});
            const [saving, setSaving] = useState(false);

            const handleInputChange = (e) => {
                const { name, value } = e.target;
                setGuestInfo((prev) => ({ ...prev, [name]: value }));
            };

            const handleSave = async () => {
                setSaving(true);
                try {
                    // Validate inputs (example)
                    let errors = {};
                    if (!guestInfo.fullName) errors.fullName = "Full name is required.";
                    if (!guestInfo.phone) errors.phone = "Phone number is required.";
                    if (!guestInfo.address) errors.address = "Address is required.";

                    if (Object.keys(errors).length) {
                        setValidationErrors(errors);
                        setSaving(false);
                        return;
                    }

                    // Send update request to the server
                    await axiosClient.put(`/customers/${customer._id}`, guestInfo);
                    toast.success("Customer updated successfully!");
                } catch (error) {
                    console.error("Update error:", error);
                    toast.error(error.response.data.message);
                } finally {
                    setSaving(false);
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
