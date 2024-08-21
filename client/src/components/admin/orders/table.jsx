import { Button } from "@/components/ui/button"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react";
import CustomInput from "@/components/custom/CustomInput";
import { toast } from "react-toastify";
import { useOrders } from "@/contexts/order";

export function OrdersTable({ columns, data }) {
    const { deleteMultipleOrders } = useOrders()

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([])
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    return (
        <div>
            <div className={`my-2 flex flex-col sm:flex-row items-start sm:items-center ${table.getFilteredSelectedRowModel().rows.length > 0 ? 'justify-between' : 'justify-end'}`}>
                {
                    table.getFilteredSelectedRowModel().rows.length > 0 &&
                    <Button
                        onClick={async () => {
                            const selectedRowIds = table.getFilteredSelectedRowModel().rows.map(row => row.original._id);
                            if (selectedRowIds.length > 0) {
                                if (window.confirm('Are you sure you want to delete the selected orders?')) {
                                    try {
                                        await deleteMultipleOrders(selectedRowIds)
                                        toast.success('Selected orders deleted successfully');
                                    } catch (error) {
                                        toast.error('Failed to delete selected orders');
                                        console.error('Delete error:', error);
                                    }
                                }
                            } else {
                                toast.info('No orders selected for deletion');
                            }
                        }}
                        variant='destructive'
                    >
                        Delete selected
                    </Button>
                }
            </div>
            <div className="flex items-center py-4">
                <CustomInput
                    placeholder="Filter customer..."
                    value={(table.getColumn("customer")?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table.getColumn("customer")?.setFilterValue(event.target.value)
                    }
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}