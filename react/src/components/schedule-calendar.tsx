import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  formatISO,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { cn } from "@/lib/utils.ts";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.tsx";
import { useState } from "react";
import { PlusIcon } from "lucide-react";

function useCalendarDates(currentDate: Date, weekStartsOnMonday: boolean) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, {
    weekStartsOn: weekStartsOnMonday ? 1 : 0,
  });
  const calendarEnd = endOfWeek(monthEnd, {
    weekStartsOn: weekStartsOnMonday ? 1 : 0,
  });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
  const firstWeek = eachDayOfInterval({
    start: calendarStart,
    end: endOfWeek(calendarStart, { weekStartsOn: weekStartsOnMonday ? 1 : 0 }),
  });

  return {
    monthStart,
    monthEnd,
    calendarStart,
    calendarEnd,
    calendarDays,
    firstWeek,
  };
}

const ScheduleCalendar = () => {
  const [params, setParams] = useSearchParams();
  const date = params.get("date");
  const selectedDate = params.get("selectedDate");
  const currentDate = date ? new Date(date) : new Date();

  const { calendarDays, firstWeek } = useCalendarDates(currentDate, true);

  return (
    <div>
      <CalendarDaySheet
        date={selectedDate ?? formatISO(new Date())}
        open={!!selectedDate}
        onOpenChange={(value) => {
          if (!value) {
            const newParams = new URLSearchParams(params);
            newParams.delete("selectedDate");
            setParams(newParams);
          }
        }}
      />
      <CalendarHeader />
      <CalendarGrid
        firstWeek={firstWeek}
        calendarDays={calendarDays}
        currentDate={currentDate}
      />
    </div>
  );
};

export default ScheduleCalendar;

function CalendarHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <span className="text-3xl font-semibold">Schedule</span>
      <CalendarMonthSelect />
    </div>
  );
}

function CalendarMonthSelect() {
  const [params, setParams] = useSearchParams();
  const date = params.get("date");
  const currentDate = date ? new Date(date) : new Date();

  const selectPrevMonth = () => {
    setParams({
      date: formatISO(startOfMonth(addMonths(currentDate, -1)), {
        representation: "date",
      }),
    });
  };

  const selectNextMonth = () => {
    setParams({
      date: formatISO(startOfMonth(addMonths(currentDate, 1)), {
        representation: "date",
      }),
    });
  };

  return (
    <div className="flex items-center border h-9 bg-background rounded-md overflow-hidden">
      <Button variant="ghost" size="icon" onClick={selectPrevMonth}>
        <ChevronLeftIcon className="size-6" />
      </Button>
      <span className="text-center w-28">{format(currentDate, "MMMM")}</span>
      <Button variant="ghost" size="icon" onClick={selectNextMonth}>
        <ChevronRightIcon className="size-6" />
      </Button>
    </div>
  );
}

interface CalendarGridProps {
  firstWeek: Date[];
  calendarDays: Date[];
  currentDate: Date;
}

function CalendarGrid({
  firstWeek,
  calendarDays,
  currentDate,
}: CalendarGridProps) {
  return (
    <div className="grid grid-cols-7 gap-px border border-border bg-border rounded-xl overflow-hidden">
      {firstWeek.map((day) => (
        <div
          key={day.toString()}
          className="py-4 px-3 bg-background text-xs font-medium text-[#878787] font-mono"
        >
          {format(day, "EEE").toUpperCase()}
        </div>
      ))}
      {calendarDays.map((date, index) => (
        <CalendarDay
          key={index.toString()}
          date={date}
          currentDate={currentDate}
        />
      ))}
    </div>
  );
}

interface CalendarDayProps {
  date: Date;
  currentDate: Date;
  selectedDate?: string;
}

function CalendarDay({ date, currentDate }: CalendarDayProps) {
  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
  const formattedDate = formatISO(date, { representation: "date" });
  const [params, setSearchParams] = useSearchParams();

  return (
    <div
      className={cn(
        "aspect-square md:aspect-[3/2] pt-2 pb-10 px-3 font-mono text-lg relative transition-all duration-100 text-left flex space-x-2 select-none group cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950",
        isCurrentMonth && isToday(date)
          ? "bg-[#f0f0f0] dark:bg-[#202020]"
          : "bg-background",
        !isCurrentMonth &&
          "bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]",
      )}
      onClick={() => {
        const newParams = new URLSearchParams(params);
        newParams.append("selectedDate", formattedDate);
        setSearchParams(newParams);
      }}
    >
      <div className="group-hover:underline">{format(date, "d")}</div>
    </div>
  );
}

function CalendarDaySheet({
  date,
  open,
  onOpenChange,
}: {
  date: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const [create, setCreate] = useState<boolean>(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg flex flex-col">
        <SheetHeader className="space-y-0">
          <SheetTitle>{format(date, "do MMMM yyyy")}</SheetTitle>
          <SheetDescription>Events & activities</SheetDescription>
        </SheetHeader>
        <div className="flex-1 grid place-items-center">
          <span className="text-muted-foreground">No events this day</span>
        </div>
        {create ? (
          <Button onClick={() => setCreate(false)}>
            <ArrowLeftIcon />
            Events
          </Button>
        ) : (
          <Button onClick={() => setCreate(true)}>
            <PlusIcon />
            Create event
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
}
