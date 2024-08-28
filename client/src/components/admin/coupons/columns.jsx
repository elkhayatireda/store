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
import { useCoupons } from "@/contexts/coupon";

const couponColumns = [
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
    accessorKey: "code",
    header: "code",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{row.original.code}</h4>
        </div>
      );
    },
  },
  {
    accessorKey: "discountType",
    header: "Type",
  },
  {
    accessorKey: "discountValue",
    header: "value",
  },
  {
    accessorKey: "usageCount",
    header: "count usage",
  },
  {
    accessorKey: "expirationDate",
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expiration date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.expirationDate);
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
    accessorKey: "status",
    header: "status",
    cell: ({ row }) => {
      const coupon = row.original;
      const { changeStatus } = useCoupons();
      return (
        <div  className="flex items-center justify-start "  >
           <label
                  className="inline-flex items-center cursor-pointer outline-none"
                  htmlFor={row.original._id}
                >
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    id={row.original._id}
                    value={row.original.isActive}
                    checked={row.original.isActive}
                    onChange={()=>{changeStatus(coupon._id)}}
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
      const coupon = row.original;
      const { deleteCoupon } = useCoupons();
      return (
        <div className="flex items-center justify-start gap-3">
          

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  to={`/admin/coupons/update/${coupon._id}`}
                  target="_blank"
                >
                  <div className="cursor-pointer rounded-full p-2 border-[2px] border-gray-200">
                    <Pen size={20} color="gray" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>update Coupon</p>
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
                        "Are you sure you want to delete this coupon?"
                      )
                    ) {
                      try {
                        await deleteCoupon(coupon._id);
                        toast.success("coupon deleted successfully");
                      } catch (error) {
                        toast.error("Failed to delete coupon");
                        console.error("Delete error:", error);
                      }
                    }
                  }}
                >
                  <Trash size={20} color="red" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>delete coupon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* </div> */}
        </div>
      );
    },
  },
];

export default couponColumns;
