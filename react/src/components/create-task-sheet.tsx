import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { format } from "date-fns";
import { CalendarIcon, UserIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import { useCreateTask } from "@/hooks/mutations/use-create-task.ts";
import { toast } from "sonner";
import { useEffect } from "react";
import { columns } from "@/lib/constants.ts";
import MultiSelect from "@/components/ui/multi-select.tsx";
import { useProject } from "@/hooks/queries/use-project.ts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";

const createTaskSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.date(),
  status: z.string().min(1),
  projectId: z.string().min(1),
  position: z.number(),
  users: z
    .array(z.string().min(1))
    .min(1, "Assign at least 1 user to the task"),
});

type CreateTaskValues = z.infer<typeof createTaskSchema>;

export default function CreateTaskSheet({
  open,
  onOpenChange,
  status,
  projectId,
  position,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  status: string;
  projectId: string;
  position: number;
}) {
  const { data } = useProject(projectId);

  const form = useForm<CreateTaskValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      description: "",
      status,
      projectId,
      position,
      users: [],
    },
  });

  useEffect(() => {
    form.setValue("position", position);
  }, [position, form]);

  const { mutate } = useCreateTask();

  function onSubmit(values: CreateTaskValues) {
    form.reset();
    onOpenChange(false);

    mutate(values, {
      onError() {
        toast.error("Something went wrong. Try again.");
      },
      onSuccess() {
        toast.success("Created new task.");
      },
    });
  }

  const userOptions =
    data?.members.map((user) => ({
      value: user.id,
      label: user.name,
    })) ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle>Create Task</SheetTitle>
          <SheetDescription>
            Fill out the form to create new task
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {columns.map((col) => (
                          <SelectItem key={col.id} value={col.id}>
                            {col.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
