import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { Checkbox } from "@/components/ui/checkbox"

const categoryColumns = [
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
        header: "Items ordered",
        cell: ({ row }) => {
            return <span>
                {row.original.items.length}
            </span>
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
    // {
    //     id: "actions",
    //     header: "Actions",
    //     cell: ({ row }) => {
    //         const category = row.original
    //         const { deleteOrder } = useOrders()
    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem
    //                         onClick={() => navigator.clipboard.writeText(category._id)}
    //                     >
    //                         Copy category ID
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem className='text-blue-600'>
    //                         <Link to={'/admin/categories/' + category._id}>Update</Link>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem
    //                         onClick={async () => {
    //                             if (window.confirm('Are you sure you want to delete this category?')) {
    //                                 try {
    //                                     await deleteCategory(category._id)
    //                                     toast.success('Category deleted successfully');
    //                                 } catch (error) {
    //                                     toast.error('Failed to delete category');
    //                                     console.error('Delete error:', error);
    //                                 }
    //                             }
    //                         }}
    //                         className='text-red-500'
    //                     >
    //                         Delete
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         )
    //     },
    // },
]

export default categoryColumns;
