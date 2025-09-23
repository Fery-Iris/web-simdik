"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-6 bg-white rounded-xl border border-gray-200 shadow-lg", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-2 pb-4 relative items-center border-b border-gray-100",
        caption_label: "text-xl font-bold text-gray-800 tracking-wide",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 bg-white border-gray-300 p-0 hover:bg-blue-50 hover:border-blue-300 rounded-full shadow-sm",
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse mt-4",
        head_row: "border-b border-gray-200 pb-2 mb-3", // FIX: 'flex' dihapus
        head_cell:
          "text-gray-600 rounded-md h-12 font-semibold text-sm flex items-center justify-center text-center uppercase tracking-wider", // FIX: 'flex-1' dihapus (tidak relevan lagi)
        row: "border-b border-gray-100 last:border-b-0", // FIX: 'flex' dihapus
        cell: "h-12 text-center text-sm p-0 relative hover:bg-blue-50 focus-within:relative focus-within:z-20 border-r border-gray-100 last:border-r-0", // FIX: 'flex-1' dihapus (tidak relevan lagi)
        day: cn(
          "h-12 w-full p-0 font-medium hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-all duration-200 rounded-none",
          "aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white font-bold",
        day_today: "bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-200 ring-inset",
        day_outside:
          "day-outside text-gray-300 opacity-40 aria-selected:bg-blue-100 aria-selected:text-gray-400 aria-selected:opacity-30",
        day_disabled: "text-gray-200 opacity-30 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-800",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5 text-gray-600" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5 text-gray-600" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
