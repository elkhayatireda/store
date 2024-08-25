import { CalendarRange } from 'lucide-react';
import React, { useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DatePickerDemo = ({ onDateChange, selected }) => {
  const [date, setDate] = React.useState(selected); // Initialize with null

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate); // Call the prop to update the formData
    }
  };
  useEffect(()=>{
    handleDateSelect(selected);
  },[selected]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-11  border-2 border-gray-200 rounded hover:bg-white",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarRange className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect} // Use the new handler
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerDemo;
