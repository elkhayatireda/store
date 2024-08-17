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
import { Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { useProducts } from "@/contexts/product";

const productColumns = [
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
    accessorKey: "image",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        ></Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={row.original.images[0]}
            alt={row.original.title}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{row.original.title}</h4>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "category",
    cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <h4 className="font-medium">{row.original.categoryId.title}</h4>
          </div>
        );
      },
  },
  {
    accessorKey: "price",
    header: "price",
  },
  {
    accessorKey: "variant",
    header: "orders",
  },
  {
    accessorKey: "variant",
    header: "visibility",
    cell: ({ row }) => {
      return (
        <>
          {row.original.visible ? (
            <p className="flex items-center justify-center py-2  bg-green-100 text-green-600">
              visible
            </p>
          ) : (
            <p className="flex items-center justify-center py-2  bg-red-100 text-red-600">
              invisible
            </p>
          )}
        </>
      );
    },
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
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;
      const { deleteCategory } = useProducts();
      return <div className="flex items-center justify-start gap-2">

      </div>;
    },
  },
];

export default productColumns;
