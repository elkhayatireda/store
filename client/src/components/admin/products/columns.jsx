import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown, Eye, EyeOff, Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { useProducts } from "@/contexts/product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

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
    accessorKey: "category",
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
    accessorKey: "orders",
    header: "orders",
  },
  {
    accessorKey: "visible",
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
      const product = row.original;
      const { deleteProduct, changeVisibility } = useProducts();
      return (
        <div className="flex items-center justify-start gap-3">
          {/* <div className="rounded-full p-1 border-[2px] border-gray-200"> */}
          {row.original.visible ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div 
                    className="cursor-pointer rounded-full p-2 border-[2px] border-gray-200"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to hide this product?')) {
                          try {
                              await changeVisibility(product._id)
                              toast.success('Product updated successfully');
                          } catch (error) {
                              toast.error('Failed to update product');
                              console.error('Delete error:', error);
                          }
                      }
                    }}
                  >
                    <Eye size={20} color="gray" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>hide product</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className="cursor-pointer rounded-full p-2 border-[2px] border-gray-200"
                    onClick={async () => {
                    if (window.confirm('Are you sure you want to show this product on your store?')) {
                        try {
                            await changeVisibility(product._id)
                            toast.success('Product updated successfully');
                        } catch (error) {
                            toast.error('Failed to update product');
                            console.error('Delete error:', error);
                        }
                    }
                    }}
                  >
                    <EyeOff size={20} color="gray" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>show product</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
              to={`/admin/products/update/${product._id}`}
              target="_blank"
            >
              <div className="cursor-pointer rounded-full p-2 border-[2px] border-gray-200">
                <Pen size={20} color="gray" />
              </div>
            </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>update product</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="cursor-pointer rounded-full p-2 border-[2px] border-red-500"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this product?')) {
                            try {
                                await deleteProduct(product._id)
                                toast.success('Product deleted successfully');
                            } catch (error) {
                                toast.error('Failed to delete product');
                                console.error('Delete error:', error);
                            }
                        }
                      }}
                    >
                      <Trash size={20} color="red" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>delete product</p>
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
           
          {/* </div> */}
        </div>
      );
    },
  },
];

export default productColumns;
