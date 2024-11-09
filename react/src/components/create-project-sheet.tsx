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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProject } from "@/hooks/mutations/use-create-project.ts";
import { toast } from "sonner";

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

type CreateProjectValues = z.infer<typeof createProjectSchema>;

interface CreateProjectSheetProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export default function CreateProjectSheet({
  open,
  onOpenChange,
}: CreateProjectSheetProps) {
  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate } = useCreateProject();

  function onSubmit(values: CreateProjectValues) {
    mutate(values, {
      onSuccess() {
        toast.success("Created project");
        form.reset();
        onOpenChange(false);
      },
      onError(err) {
        console.log(err);

        toast.error("Something went wrong. Try again.");
      },
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle>Create Project</SheetTitle>
          <SheetDescription>
            Fill out the form to create new project
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
                      <Input placeholder="My first project" {...field} />
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
                      <Input placeholder="We are cooking here..." {...field} />
                    </FormControl>
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
