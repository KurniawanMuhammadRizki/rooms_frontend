"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useSelectedDate from "@/hooks/useSelectedDate";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { DateRange as DayPickerDateRange } from "react-day-picker";
import { DateRange as DateRangeDatePicker } from "react-day-picker";

// interface DateRange {
//   from?: Date;
//   to?: Date;
// }

// const DateRangePicker: React.FC = () => {
//   const { selectedDates, setSelectedDates } = useSelectedDate();
//   const startOfThisMonth = startOfMonth(new Date());
//   const endOfThisMonth = endOfMonth(new Date());
//   const [date, setDate] = useState<DateRange>({
//     from: selectedDates?.startDate
//       ? new Date(selectedDates.startDate)
//       : startOfThisMonth,
//     to: selectedDates?.endDate
//       ? new Date(selectedDates.endDate)
//       : endOfThisMonth,
//   });

//   const handleDateChange = (range: DayPickerDateRange | undefined) => {
//     if (!range) {
//       setDate({ from: undefined, to: undefined });
//       return;
//     }

//     setDate(range);
//     if (range.from && range.to) {
//       setSelectedDates(
//         range.from.toISOString().split("T")[0],
//         range.to.toISOString().split("T")[0]
//       );
//     }
//   };

//   const selectedRange: DayPickerDateRange | undefined = date.from
//     ? { from: date.from, to: date.to }
//     : undefined;

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           id="date"
//           variant={"outline"}
//           className="w-full justify-center text-center font-normal">
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {date?.from ? (
//             date.to ? (
//               <>
//                 {format(date.from, "LLL dd, y")} -{" "}
//                 {format(date.to, "LLL dd, y")}
//               </>
//             ) : (
//               format(date.from, "LLL dd, y")
//             )
//           ) : (
//             <span>Pick a date</span>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0" align="start">
//         <Calendar
//           initialFocus
//           mode="range"
//           defaultMonth={date?.from}
//           selected={selectedRange}
//           onSelect={handleDateChange}
//           numberOfMonths={2}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default DateRangePicker;

interface DateRange {
  from?: Date;
  to?: Date;
}

const DateRangePicker: React.FC = () => {
  const { selectedDates, setSelectedDates } = useSelectedDate();
  const startOfThisMonth = startOfMonth(new Date());
  const endOfThisMonth = endOfMonth(new Date());

  // Gunakan state untuk menyimpan sementara range tanggal yang dipilih
  const [tempDate, setTempDate] = useState<DateRangeDatePicker>({
    from: selectedDates?.startDate
      ? new Date(selectedDates.startDate)
      : startOfThisMonth,
    to: selectedDates?.endDate
      ? new Date(selectedDates.endDate)
      : endOfThisMonth,
  });

  // Handle perubahan tanggal di dalam calendar
  const handleDateChange = (range: DateRangeDatePicker | undefined) => {
    setTempDate(range ?? { from: undefined, to: undefined });
  };

  // Saat popover ditutup, simpan tanggal yang dipilih
  const handlePopoverClose = () => {
    if (tempDate.from && tempDate.to) {
      setSelectedDates(
        tempDate.from.toISOString().split("T")[0],
        tempDate.to.toISOString().split("T")[0]
      );
    }
  };

  return (
    <Popover onOpenChange={(open) => !open && handlePopoverClose()}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className="w-full justify-center text-center font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {tempDate?.from ? (
            tempDate.to ? (
              <>
                {format(tempDate.from, "LLL dd, y")} -{" "}
                {format(tempDate.to, "LLL dd, y")}
              </>
            ) : (
              format(tempDate.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={tempDate?.from}
          selected={tempDate}
          onSelect={handleDateChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
