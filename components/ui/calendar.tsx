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
      className={cn("p-6 bg-background rounded-xl border border-border shadow-lg", className)}
      style={{
        '--rdp-cell-size': '2.5rem',
        '--rdp-accent-color': 'hsl(var(--primary))',
        '--rdp-background-color': 'hsl(var(--background))',
        '--rdp-accent-color-dark': 'hsl(var(--primary))',
        '--rdp-background-color-dark': 'hsl(var(--background))',
        '--rdp-outline': '2px solid hsl(var(--ring))',
        '--rdp-outline-selected': '2px solid hsl(var(--primary))',
      } as React.CSSProperties}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-2 pb-4 relative items-center border-b border-border",
        caption_label: "text-xl font-bold text-foreground tracking-wide",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 bg-background border-border p-0 hover:bg-accent hover:border-accent-foreground rounded-full shadow-sm",
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse mt-4",
        head_row: "grid grid-cols-7 border-b border-border pb-2 mb-3",
        head_cell:
          "text-muted-foreground rounded-md h-12 font-semibold text-sm flex items-center justify-center text-center uppercase tracking-wider",
        row: "grid grid-cols-7 border-b border-border last:border-b-0",
        cell: "h-12 text-center text-sm p-0 relative hover:bg-accent focus-within:relative focus-within:z-20",
        day: cn(
          "h-12 w-full p-0 font-medium hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-200 rounded-none",
          "aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-bold",
        day_today: "bg-accent text-accent-foreground font-bold ring-2 ring-primary ring-inset",
        day_outside:
          "day-outside text-muted-foreground opacity-40 aria-selected:bg-accent aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5 text-muted-foreground" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5 text-muted-foreground" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
