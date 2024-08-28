import { MoreHorizontal, Pen, Trash2 } from "lucide-react"
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
import { axiosClient } from "@/api/axios"
import { toast } from "react-toastify"
import { Checkbox } from "@/components/ui/checkbox"
import { useCategories } from "@/contexts/category"

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
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    className='p-0'
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const img = row.original.imgPath
            return <div className="flex items-start gap-3">
                <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={img}
                    alt={row.original.title}
                />
                <h4 className="font-medium">{row.original.title}</h4>
            </div>
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const desc = row.original.description;
            return (
                <span className="text-xs block truncate max-w-xs" title={desc}>
                    {desc.length > 100 ? `${desc.substring(0, 100)}...` : desc}
                </span>
            );
        },
    },
    {
        accessorKey: "productCount",
        header: "Products",
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
            const category = row.original
            const { deleteCategory } = useCategories()
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className='text-blue-600'>
                            <Link className="flex items-center gap-1" to={'/admin/categories/' + category._id}>
                                <Pen size={15} /> Update
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this category?')) {
                                    try {
                                        await deleteCategory(category._id)
                                    } catch (error) {
                                        console.error('Delete error:', error);
                                    }
                                }
                            }}
                            className='flex items-center gap-1 text-red-500'
                        >
                            <Trash2 size={15} /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default categoryColumns;
