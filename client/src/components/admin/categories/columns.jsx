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
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
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
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(category._id)}
                        >
                            Copy category ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-blue-600'>
                            <Link to={'/admin/categories/' + category._id}>Update</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this category?')) {
                                    try {
                                        await deleteCategory(category._id)
                                        toast.success('Category deleted successfully');
                                    } catch (error) {
                                        toast.error('Failed to delete category');
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
            )
        },
    },
]

export default categoryColumns;
