import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { ProjectDetails } from "@/hooks/queries/use-project.ts";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

const invitationSchema = z.object({
  email: z.string().min(1).email(),
});

type InvitationValues = z.infer<typeof invitationSchema>;

export default function InviteToProjectDialog({
  project,
}: {
  project: ProjectDetails;
}) {
  const form = useForm<InvitationValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: InvitationValues) {}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="size-6" variant="ghost" size="icon">
          <PlusIcon />
          <span className="sr-only">Invite</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to {project.name}</DialogTitle>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <Button type="submit">Invite</Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div>
          <span className="text-sm font-semibold">Members</span>
          <ScrollArea></ScrollArea>
        </div>

        <Separator />

        <div className="flex gap-4 items-center">
          <Button size="sm" className="font-semibold">
            Copy share link
          </Button>
          <p className="text-sm font-medium">
            Anyone with this link can join the project
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
