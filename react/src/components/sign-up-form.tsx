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
import { useSignUp } from "@/hooks/mutations/use-sign-up.ts";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { LoaderIcon } from "lucide-react";

const signUpSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const { mutate, isPending } = useSignUp();

  function onSubmit(values: SignUpValues) {
    mutate(values, {
      onSuccess() {
        toast.success("Signed up. Verify your email.");
        form.reset();
      },
      onError(error: Error | AxiosError) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.errors[0].detail);
        } else {
          toast.error("Something went wrong. Try again.");
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="*****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit" className="w-full">
          {isPending && <LoaderIcon className="size-4 animate-spin" />}
          Register
        </Button>
      </form>
    </Form>
  );
}
