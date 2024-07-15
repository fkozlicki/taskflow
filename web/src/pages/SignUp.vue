<script setup lang="ts">

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toTypedSchema} from "@vee-validate/zod";
import {z} from "zod";
import {useForm} from "vee-validate";
import {useFetch} from "@/utils/useFetch";
import {ref} from "vue";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import GoogleIcon from "@/components/icons/GoogleIcon.vue";
import GithubIcon from "@/components/icons/GithubIcon.vue";

const formSchema = toTypedSchema(z.object({
  email: z.string().min(1).email(),
  name: z.string().min(1),
  password: z.string().min(1)
}))

const accountExists = ref(false);

const {handleSubmit, values} = useForm({
  validationSchema: formSchema
})

const {execute, isFetching} = useFetch('/users/register', {
  immediate: false, onFetchError(ctx) {
    if (ctx.data.errors.some(error => error.code === "DuplicatedEmailConstraint")) {
      accountExists.value = true;
    }
  }
}).post(values).json();

const onSubmit = handleSubmit(() => {
  accountExists.value = false;
  execute()
})

</script>

<template>
  <div class="flex p-4 h-screen">
    <div class="flex-1  bg-gradient-to-tr from-[#1e3c72] to-[#2a5298] rounded-2xl"></div>
    <div class="flex-1 grid place-items-center">
      <div class="max-w-md m-auto w-full">

        <h2 class="text-4xl capitalize mb-2">Get started now</h2>
        <p class="text-muted-foreground mb-8">Enter your personal data to create your account</p>

        <Alert v-if="accountExists" variant="destructive" class="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>User with this email already exists</AlertDescription>
        </Alert>
        <form @submit="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input :disabled="isFetching" type="text" placeholder="John" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input :disabled="isFetching" type="email" placeholder="email@example.com" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input :disabled="isFetching" type="password" placeholder="********" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>

          <Button :disabled="isFetching" type="submit" class="w-full">
            Sign Up
          </Button>
        </form>

        <p class="text-center my-4 text-sm">
          Already have an account?
          <RouterLink class="text-blue-600 hover:underline" to="/sign-in">Sign in</RouterLink>
        </p>

        <Separator class="my-8" label="OR"/>

        <div class="flex gap-4">
          <Button class="flex-1" variant="outline" size="lg">
            <GoogleIcon class="size-4 mr-2"/>
            Google
          </Button>
          <Button class="flex-1" variant="outline" size="lg">
            <GithubIcon class="size-4 mr-2"/>
            Github
          </Button>
        </div>

        <RouterLink to="/" class="hover:underline mt-4 text-center block text-sm">Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>