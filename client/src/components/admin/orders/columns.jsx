import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { Checkbox } from "@/components/ui/checkbox"
import { useOrders } from "@/contexts/order"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useState } from "react"
import { axiosClient } from "@/api/axios"

const orderColumns = [
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
        id: "customer",
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
        },
        cell: ({ row }) => {
            return <span>
                {row.original.guestInfo.fullName}
            </span>
        },
    },
    {
        header: "Phone Number",
        cell: ({ row }) => {
            return <span>
                {row.original.guestInfo.phone}
            </span>
        },
    },
    {
        header: "Total items",
        cell: ({ row }) => {
            const totalQuantity = row.original.items.reduce((sum, item) => sum + item.quantity, 0);
            return <span>{totalQuantity}</span>;
        },
    },
    {
        accessorKey: 'totalPrice',
        header: "Total Price",
    },
    {
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            const getStatusStyles = (status) => {
                switch (status) {
                    case 'pending':
                        return 'bg-yellow-50 text-yellow-600';
                    case 'confirmed':
                        return 'bg-blue-50 text-blue-600';
                    case 'shipped':
                        return 'bg-purple-50 text-purple-600';
                    case 'delivered':
                        return 'bg-green-50 text-green-600';
                    case 'canceled':
                        return 'bg-red-50 text-red-600';
                    default:
                        return 'bg-gray-50 text-gray-600';
                }
            };

            return (
                <span className={`px-1.5 py-0.5 rounded-md text-sm font-medium ${getStatusStyles(status)}`}>
                    {status}
                </span>
            );
        },
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    className='p-0'
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ordered
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
            const order = row.original
            const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'];
            const [status, setStatus] = useState(row.original.status);
            const [isDetailsOpen, setIsDetailsOpen] = useState(false)
            const [isStatusOpen, setIsStatusOpen] = useState(false)
            const { deleteOrder, setData } = useOrders()

            const handleStatusChange = (e) => {
                const newStatus = e.target.value;
                setStatus(newStatus);
            };
            const handleStatusSave = async (e) => {
                try {
                    await axiosClient.put(`/orders/status/${row.original._id}`, { status });
                    console.log("Status updated successfully");
                    toast.success("Status updated successfully");

                    // Update the orders state
                    setData((prevOrders) =>
                        prevOrders.map((order) =>
                            order._id === row.original._id
                                ? { ...order, status }
                                : order
                        )
                    );
                    isStatusOpen ? setIsStatusOpen(false) : setIsDetailsOpen(false)
                } catch (error) {
                    console.error("Failed to update status", error);
                    toast.error("Failed to update status");
                }
            };
            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>View details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsStatusOpen(true)}>Edit status</DropdownMenuItem>
                            {/* <DropdownMenuItem className='text-blue-600'>
                            <Link to={'/admin/categories/' + order._id}>Update</Link>
                        </DropdownMenuItem> */}
                            <DropdownMenuItem
                                onClick={async () => {
                                    if (window.confirm('Are you sure you want to delete this order?')) {
                                        try {
                                            await deleteOrder(order._id)
                                        } catch (error) {
                                            console.error('Delete error:', error);
                                        }
                                    }
                                }}
                                className='text-red-500'
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={isDetailsOpen}
                        onOpenChange={isDetailsOpen ?
                            setIsDetailsOpen : setIsStatusOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Order info</DialogTitle>
                            </DialogHeader>
                            <div className="text-sm text-gray-600 font-light">
                                <p><span className="text-gray-700 font-medium">Customer:</span> {order.guestInfo.fullName}</p>
                                <p><span className="text-gray-700 font-medium">Phone number:</span> {order.guestInfo.phone}</p>
                                <p><span className="text-gray-700 font-medium">Address:</span> {order.guestInfo.address}</p>
                            </div>
                            <div className="h-72 overflow-auto">
                                {order.items.map(item => (
                                    <div className="border px-4 py-1 rounded-sm mb-2">
                                        <div className="flex gap-2 items-start">
                                            <img className="w-9 h-9 rounded-full" src={item.image} alt={item.title} />
                                            <div>
                                                <p className="text-sm">{item.title} - {item.variant}</p>
                                                <p className="text-xs text-gray-400">{item.quantity} * {item.unitPrice}DH</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <p className="test-sm text-gray-500">Total:</p>
                                            <p className="text-sm text-gray-500">{item.quantity * item.unitPrice}DH</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isStatusOpen}
                        onOpenChange={isStatusOpen ?
                            setIsStatusOpen : setIsDetailsOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit status</DialogTitle>
                            </DialogHeader>
                            <select
                                value={status}
                                onChange={handleStatusChange}
                            >
                                {statusOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <Button onClick={handleStatusSave}>Save</Button>
                        </DialogContent>
                    </Dialog>
                </>
            )
        },
    },
]

export default orderColumns;
