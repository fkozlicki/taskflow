import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { PlusIcon } from "lucide-react";
import { useCreateMilestone } from "@/hooks/mutations/use-create-milestone.ts";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const createMilestoneSchema = z.object({
  content: z.string().min(1),
});

type CreateMilestoneValues = z.infer<typeof createMilestoneSchema>;

export default function CreateMilestoneSheet() {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateMilestoneValues>({
    resolver: zodResolver(createMilestoneSchema),
    defaultValues: {
      content: "",
    },
  });
  const params = useParams();
  const projectId = params.projectId!;

  const { mutate } = useCreateMilestone();

  function onSubmit(values: CreateMilestoneValues) {
    form.reset();
    setOpen(false);

    mutate(
      {
        ...values,
        projectId,
      },
      {
        onError() {
          toast.error("Something went wrong.");
        },
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-5">
          <PlusIcon />
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-lg flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle>Create Milestone</SheetTitle>
          <SheetDescription>
            Fill out the form to create new milestone
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Build an api" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Create milestone</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
