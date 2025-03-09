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
import { useParams, useSearchParams } from "react-router-dom";
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
import CreateEventForm from "@/components/create-event-form.tsx";
import {
  ProjectEvent,
  useProjectEvents,
} from "@/hooks/queries/use-project-events.ts";
import { useMediaQuery } from "@/hooks/use-media-query.ts";

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
    <>
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
    </>
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
  const params = useParams();
  const projectId = params.projectId!;

  const { data } = useProjectEvents(projectId);

  return (
    <div className="grid flex-1 grid-rows-[auto_repeat(6,1fr)] grid-cols-7 gap-px border border-border bg-border rounded-lg overflow-hidden">
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
          events={data?.[formatISO(date, { representation: "date" })] ?? []}
        />
      ))}
    </div>
  );
}

interface CalendarDayProps {
  date: Date;
  currentDate: Date;
  events: ProjectEvent[];
}

function CalendarDay({ date, currentDate, events }: CalendarDayProps) {
  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
  const formattedDate = formatISO(date, { representation: "date" });
  const [params, setSearchParams] = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 1440px)");

  const slicedEvents = events.length > 3 ? events.slice(0, 2) : events;

  return (
    <div
      className={cn(
        " p-2 font-mono text-lg relative transition-all duration-100 text-left flex flex-col select-none group cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950",
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
      <div className="group-hover:underline mb-2">{format(date, "d")}</div>
      {events.length > 0 && (
        <>
          {isDesktop ? (
            <div className="flex flex-col gap-1">
              {slicedEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={cn(
                    "text-xs font-semibold font-sans text-white rounded-full px-2 py-0.5 inline-flex justify-between",
                  )}
                  style={{
                    background: getEventBackground(index),
                  }}
                >
                  <span className="line-clamp-1">{event.title}</span>
                  {event.startTime && event.endTime && (
                    <span className="shrink-0">
                      {format(event.startTime, "HH:mm")} -
                      {format(event.endTime, "HH:mm")}
                    </span>
                  )}
                  {event.allDay && <span className="shrink-0">All day</span>}
                </div>
              ))}
              {events.length > 3 && (
                <div className="text-xs font-semibold font-sans text-white rounded-full px-2 py-0.5 bg-slate-400">
                  +{events.length - 2} events
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs font-semibold font-sans text-white rounded-full px-2 py-0.5 bg-slate-400">
              {events.length} events
            </span>
          )}
        </>
      )}
    </div>
  );
}

function getEventBackground(index: number) {
  const colors = ["#FF5733", "#33B5FF", "#33FF57", "#FFC133"]; // Array of vibrant colors

  // Use modulo to cycle through the colors
  return colors[index % colors.length];
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
  const params = useParams();

  const projectId = params.projectId!;

  const { data } = useProjectEvents(projectId);

  const events = data?.[date] ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg flex flex-col">
        <SheetHeader className="space-y-0">
          <SheetTitle>{format(date, "do MMMM yyyy")}</SheetTitle>
          <SheetDescription>Events & activities</SheetDescription>
        </SheetHeader>
        {create ? (
          <CreateEventForm
            date={new Date(date)}
            onSuccess={() => setCreate(false)}
          />
        ) : events.length > 0 ? (
          <div className="flex-1 flex flex-col gap-2">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={cn(
                  "text-sm font-semibold font-sans text-white rounded-full px-4 py-2 inline-flex justify-between",
                )}
                style={{
                  background: getEventBackground(index),
                }}
              >
                <span>{event.title}</span>
                {event.startTime && event.endTime && (
                  <span>
                    {format(event.startTime, "HH:mm")} -
                    {format(event.endTime, "HH:mm")}
                  </span>
                )}
                {event.allDay && <span>All day</span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 grid place-items-center">
            <span className="text-muted-foreground">No events this day</span>
          </div>
        )}

        {create ? (
          <Button variant="outline" onClick={() => setCreate(false)}>
            <ArrowLeftIcon />
            Events
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setCreate(true)}>
            <PlusIcon />
            Create event
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
}
