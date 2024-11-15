import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Button } from "@/components/ui/button.tsx";
import { EditIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { ProjectDetails } from "@/hooks/queries/use-project.ts";
import { useEffect, useState } from "react";
import { useEditProject } from "@/hooks/mutations/use-edit-project.ts";

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

type CreateProjectValues = z.infer<typeof createProjectSchema>;

export default function EditProjectSheet({
  project,
}: {
  project: ProjectDetails;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: project,
  });

  const { mutate } = useEditProject();

  useEffect(() => {
    form.reset(project);
  }, [project, form]);

  function onSubmit(values: CreateProjectValues) {
    mutate(
      { id: project.id, ...values },
      {
        onSuccess() {
          toast.success("Edited project");
          form.reset();
          setOpen(false);
        },
        onError() {
          toast.error("Something went wrong. Try again.");
        },
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <EditIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle>Edit Project</SheetTitle>
          <SheetDescription>
            Fill out the form to edit the project
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

            <Button type="submit">Save</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
