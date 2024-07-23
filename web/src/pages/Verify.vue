<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useUser} from "@/store/user.ts";
import {LoaderIcon} from 'lucide-vue-next'

const status = ref<string>('loading')

onMounted(async () => {
  const userStore = useUser()
  status.value = await userStore.verify()
})

</script>

<template>
  <div class="grid place-items-center h-screen">
    <div v-if="status === 'loading'">Please wait. We are verifying your account
      <LoaderIcon class="size-4 animate-spin ml-2"/>
    </div>
    <div v-if="status === 'success'" class="text-center">
      <h1 class="text-3xl mb-2">Successfully verified your account</h1>
      <p class="text-muted-foreground mb-4">You can sing in now.</p>
      <RouterLink to="/sign-in" class="text-blue-600 hover:underline">Sign In</RouterLink>
    </div>
    <div v-else class="text-center">
      <h1 class="text-3xl mb-2">We couldn't verify your account</h1>
      <p class="text-muted-foreground mb-4">Try to sign up again</p>
      <RouterLink to="/sign-up" class="text-blue-600 hover:underline">Sign Up</RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>