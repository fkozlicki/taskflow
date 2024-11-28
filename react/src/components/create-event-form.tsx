import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import TimePicker from "@/components/ui/time-picker.tsx";
import { useCreateEvent } from "@/hooks/mutations/use-create-event.ts";
import { useEffect } from "react";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { useParams } from "react-router-dom";

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  date: z.date(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  allDay: z.boolean(),
});

type CreateEventValues = z.infer<typeof createEventSchema>;

export default function CreateEventForm({
  date,
  onSuccess,
}: {
  date: Date;
  onSuccess: () => void;
}) {
  const form = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      allDay: false,
      date,
    },
  });
  const params = useParams();

  const { mutate, isPending } = useCreateEvent();

  function onSubmit(values: CreateEventValues) {
    mutate(
      { ...values, projectId: params.projectId! },
      {
        onSuccess() {
          toast.success("Created event");
          form.reset();
          onSuccess();
        },
        onError() {
          toast.error("Something went wrong");
        },
      },
    );
  }

  const isAllDay = form.watch("allDay");

  useEffect(() => {
    if (isAllDay) {
      form.unregister("startTime");
      form.unregister("endTime");
    }
  }, [isAllDay]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex flex-col"
      >
        <div className="flex-1 space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Meeting with client" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Will be planning on CMS" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="allDay"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>All day event</FormLabel>
                  <FormDescription>
                    Marks event as all day event. No longer need to specify
                    start time & end time.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {!isAllDay && (
            <>
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start time</FormLabel>
                    <FormControl>
                      <TimePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End time</FormLabel>
                    <FormControl>
                      <TimePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : (
            "Create event"
          )}
        </Button>
      </form>
    </Form>
  );
}
