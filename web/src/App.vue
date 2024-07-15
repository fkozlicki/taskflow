<script setup lang="ts">
import {Toaster} from "@/components/ui/sonner";
</script>

<template>
  <RouterView name="Header" />
  <main>
    <RouterView/>
  </main>
  <Toaster/>
</template>
