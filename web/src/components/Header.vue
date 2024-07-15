<script setup lang="ts">
import {Button} from '@/components/ui/button'
import ThemeSwitch from "@/components/ThemeSwitch.vue";
import {useUser} from "@/store/user.ts";
import {storeToRefs} from "pinia";
import UserDropdown from "@/components/UserDropdown.vue";
import UserNavigation from "@/components/UserNavigation.vue";

const userStore = useUser()
const { user } = storeToRefs(userStore)
</script>

<template>
  <header class="flex px-4 items-center justify-between h-16 border-b">
    <div class="flex items-center gap-4">
      <RouterLink to="/">
        <div>Logo</div>
      </RouterLink>
      <UserNavigation v-if="user" />
    </div>
    <nav class="flex items-center gap-2">
      <ThemeSwitch/>
      <UserDropdown v-if="user" :user="user"  />
      <template v-else>
        <RouterLink to="/sign-in">
          <Button>Sign In</Button>
        </RouterLink>
        <RouterLink to="/sign-up">
          <Button>Sign Up</Button>
        </RouterLink>
      </template>
    </nav>
  </header>
</template>
