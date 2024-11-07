<script setup lang="ts">

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {User, useUser} from "@/store/user.ts";
import {UserIcon} from "lucide-vue-next";

const {user} = defineProps<{ user: User }>()
const userStore = useUser()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Avatar>
        <AvatarImage :src="undefined" :alt="user.name"/>
        <AvatarFallback>
          <UserIcon class="size-5"/>
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>{{ user.name }}</DropdownMenuLabel>
      <DropdownMenuSeparator/>
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Billing</DropdownMenuItem>
      <DropdownMenuItem @click="userStore.signOut()">Sign Out</DropdownMenuItem>

    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped>

</style>