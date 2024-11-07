import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSignIn} from "@/hooks/mutations/use-sign-in.ts";
import {LoaderIcon} from "lucide-react";
import {toast} from "sonner";
import {useQueryClient} from "@tanstack/react-query";

const signInSchema = z.object({
    email: z.string().min(1, "Email is required").email(),
    password: z.string().min(1, "Password is required")
})

type SignInValues = z.infer<typeof signInSchema>

export default function SignInForm() {
    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const { mutate, isPending } = useSignIn()
    const queryClient = useQueryClient()

    function onSubmit(values: SignInValues) {
        mutate(values, {
            onSuccess: ({data}) => {
                console.log(data)
                queryClient.setQueryData(['session'], data)
                toast.success('Signed in')
            },
            onError: (error) => {
                console.log(error)

                toast.error("Couldn't sign in")
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="john.doe@example.com" {...field} />
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
                    {isPending && <LoaderIcon className="size-4 animate-spin mr-2"/>}
                    Sign In
                </Button>
            </form>
        </Form>
    )
}
