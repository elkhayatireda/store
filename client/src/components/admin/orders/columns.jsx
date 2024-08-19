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
            return <span>
                {row.original.status}
            </span>
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
            const { deleteOrder } = useOrders()
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
                                <DialogTrigger>View details</DialogTrigger>
                            </DropdownMenuItem>
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

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Order items</DialogTitle>
                        </DialogHeader>
                        <div className="h-72 overflow-auto">
                            {order.items.map(item => (
                                <div className="border px-4 py-2 rounded-sm mb-2">
                                    <div className="flex gap-2 items-start">
                                        <img className="w-9 h-9 rounded-full" src={item.image} alt={item.title} />
                                        <p className="text-sm">{item.title} - {item.variant}</p>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs text-gray-400">{item.quantity} * {item.unitPrice}DH</p>
                                        <p className="text-sm text-gray-500">{item.quantity * item.unitPrice}DH</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            )
        },
    },
]

export default orderColumns;
