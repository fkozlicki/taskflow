import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import MultiSelect from "@/components/ui/multi-select.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { CalendarIcon, LoaderIcon, UserIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "@/hooks/queries/use-project-tasks.ts";
import { useProject } from "@/hooks/queries/use-project.ts";
import { useParams } from "react-router-dom";
import { useEditTask } from "@/hooks/mutations/use-edit-task.ts";
import { toast } from "sonner";

const editTaskSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.date(),
  status: z.string().min(1),
  users: z
    .array(z.string().min(1))
    .min(1, "Assign at least 1 user to the task"),
});

type EditTaskValues = z.infer<typeof editTaskSchema>;

export default function EditTaskForm({ task }: { task: Task }) {
  const form = useForm<EditTaskValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      ...task,
      dueDate: parseISO(task.dueDate),
      users: task.users.map((user) => user.id),
    },
  });
  const params = useParams();
  const projectId = params.projectId!;
  const { data } = useProject(projectId);
  const { mutate, isPending } = useEditTask();

  function onSubmit(values: EditTaskValues) {
    mutate(
      { id: task.id, ...values },
      {
        onSuccess() {
          toast.success("Saved task");
        },
        onError() {
          toast.error("Something went wront. Try again");
        },
      },
    );
  }

  const userOptions =
    data?.members.map((user) => ({
      value: user.id,
      label: user.name,
    })) ?? [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <div className="space-y-8 flex-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Design hero section" {...field} />
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
                  <Input placeholder="Make it pixel perfect" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="users"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Users</FormLabel>
                <FormControl>
                  <MultiSelect
                    value={userOptions.filter((option) =>
                      field.value.includes(option.value),
                    )}
                    onChange={(options) =>
                      field.onChange(options.map((option) => option.value))
                    }
                    options={userOptions}
                    formatOptionLabel={(data) => (
                      <div className="flex gap-1 items-center">
                        <Avatar className="size-5 border">
                          <AvatarFallback>
                            <UserIcon className="size-3" />
                          </AvatarFallback>
                        </Avatar>
                        {data.label}
                      </div>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending && <LoaderIcon className="size-4 animate-spin mr-2" />}
          Save
        </Button>
      </form>
    </Form>
  );
}
