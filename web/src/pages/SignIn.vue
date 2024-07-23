<script setup lang="ts">
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {toTypedSchema} from "@vee-validate/zod";
import {z} from "zod";
import {useForm} from 'vee-validate'
import {Button} from '@/components/ui/button'
import {Separator} from "@/components/ui/separator";
import {useUser} from "@/store/user.ts";
import GoogleIcon from "@/components/icons/GoogleIcon.vue";
import GithubIcon from "@/components/icons/GithubIcon.vue";
import {LoaderCircleIcon} from "lucide-vue-next";

const formSchema = toTypedSchema(z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1)
}))

const {handleSubmit, isSubmitting} = useForm({
  validationSchema: formSchema
})

const userStore = useUser()

const onSubmit = handleSubmit( async (values) => {
  await userStore.signIn(values)
})
</script>

<template>
  <div class="flex p-4 h-screen">
    <div class="flex-1 relative bg-gradient-to-tr from-[#1e3c72] to-[#2a5298] rounded-2xl">
      <div class="absolute top-8 left-9">
        <p class="text-white/50 mb-4">Join now and</p>
        <p class="text-4xl text-white font-medium">Boost your productivity <br/> with Taskflow</p>
      </div>
    </div>
    <div class="flex-1 grid place-items-center">
      <div class="max-w-md m-auto w-full">

        <h2 class="text-4xl capitalize mb-2">Welcome back</h2>
        <p class="text-muted-foreground mb-8">Please log in into your account to continue</p>

        <form @submit="onSubmit" class="space-y-8">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input :disabled="isSubmitting" type="email" placeholder="email@example.com" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input :disabled="isSubmitting" type="password" placeholder="********" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>

          <Button :disabled="isSubmitting" type="submit" class="w-full">
            <LoaderCircleIcon v-if="isSubmitting" class="size-4 animate-spin"/>
            <template v-else>Sign In</template>
          </Button>
        </form>

        <p class="text-center my-4 text-sm">
          Don't have an account?
          <RouterLink class="text-blue-600 hover:underline" to="/sign-up">Sign up</RouterLink>
        </p>

        <Separator class="my-8" label="OR" />

        <div class="flex gap-4">
          <Button @click="userStore.googleSignIn()" class="flex-1" variant="outline" size="lg">
            <GoogleIcon class="size-4 mr-2"/>
            Google
          </Button>
          <Button @click="userStore.githubSignIn()" class="flex-1" variant="outline" size="lg">
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