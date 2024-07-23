<script setup lang="ts">

import {Separator} from "@/components/ui/separator";
</script>

<template>
  <div class="h-screen grid place-items-center">
    <div class="text-center">
      <h1 class="text-3xl mb-2">You have successfully signed up</h1>
      <p class="text-muted-foreground mb-8">Verify your email to continue</p>
      <div class="flex justify-center h-6">
        <RouterLink to="/" class="text-blue-500 hover:underline">Home</RouterLink>
        <Separator orientation="vertical" class="mx-2 bg-border" />
        <RouterLink to="/sign-in" class="text-blue-500 hover:underline">Sign in</RouterLink>
      </div>
    </div>
  </div>
</template>
