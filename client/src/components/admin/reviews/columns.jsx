import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown, Image, EyeOff, Pen, Trash } from "lucide-react";
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
import { useReviews } from "@/contexts/review";
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

const reviewColumns = [
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
        <div className="flex items-center gap-3 ">
          {row.original.images.length !== 0  ?  
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={row.original.images[0]}
          /> : 
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <Image color="gray" />
          </div>
          }
          
        </div>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{row.original.fullName}</h4>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "email",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{row.original.email}</h4>
        </div>
      );
    },
  },
  {
    accessorKey: "product",
    header: "product",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{row.original.productId.title}</h4>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "rating",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-start ">
          {Array.from({ length: row.original.rating }).map((_, index) => (
            <img
              key={index}
              src={"/assets/star.svg"}
              className="w-4 cursor-pointer"
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "status",
    cell: ({ row }) => {
      const review = row.original;
      const { changeStatus } = useReviews();
      return (
        <div
          className="flex items-center justify-start "
          onClick={() => {
            changeStatus(review._id);
          }}
        >
          <label
            className="inline-flex items-center cursor-pointer outline-none"
            htmlFor="isVariant"
          >
            <input
              type="checkbox"
              className="sr-only peer"
              id={row.original._id}
              value={row.original.status}
              checked={row.original.status}
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
          </label>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formattedDate = date
        .toLocaleString("fr-FR", options)
        .replace(",", "");
      return <div>{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const review = row.original;
      const { deleteReview } = useReviews();
      return (
        <div className="flex items-center justify-start gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  to={`/admin/reviews/update/${review._id}`}
                  target="_blank"
                >
                  <div className="cursor-pointer rounded-full p-2 border-[2px] border-gray-200">
                    <Pen size={20} color="gray" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>update Review</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="cursor-pointer rounded-full p-2 border-[2px] border-red-500"
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this product?"
                      )
                    ) {
                      try {
                        await deleteReview(review._id);
                        toast.success("Product deleted successfully");
                      } catch (error) {
                        toast.error("Failed to delete product");
                        console.error("Delete error:", error);
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

export default reviewColumns;
