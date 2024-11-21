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
import { LoaderIcon, PlusIcon, UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { useInvite } from "@/hooks/mutations/use-invite.ts";
import { toast } from "sonner";

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

  const { mutate, isPending } = useInvite();

  function onSubmit(values: InvitationValues) {
    mutate(
      { projectId: project.id, ...values },
      {
        onSuccess() {
          toast.success("Sent invitation");
          form.reset();
        },
        onError() {
          toast.error("Couldn't send invitation. Try again.");
        },
      },
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="size-5" variant="ghost" size="icon">
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
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <LoaderIcon className="size-4 animate-spin" />
                      ) : (
                        "Invite"
                      )}
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div>
          <span className="text-sm font-semibold inline-block mb-3">
            Members
          </span>
          <ScrollArea className="max-h-28 overflow-auto flex flex-col">
            <div className="flex flex-col gap-2">
              {project.members.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback>
                      <UserIcon className="size-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{member.name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        <div className="flex gap-4 items-center">
          <Button
            size="sm"
            className="font-semibold"
            onClick={() => {
              void navigator.clipboard.writeText(
                `${window.origin}/projects/join?code=${project.invitationCode}`,
              );
              toast.success("Copied share link");
            }}
          >
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
