<script setup lang="ts">
import ProjectCombobox from "@/components/ProjectCombobox.vue";
import {HomeIcon, FileIcon, MessageCircleIcon} from 'lucide-vue-next'
import {cn} from "@/lib/utils.ts";
import {buttonVariants} from "@/components/ui/button";
import {useRoute} from "vue-router";
const route = useRoute()
const id = route.params.id

const links = [
  {href: `/projects/${id}`, label: "Home", Icon: HomeIcon},
  {href: `/projects/${id}/tasks`, label: "Tasks", Icon: FileIcon},
  {href: `/projects/${id}/chat`, label: "Chat", Icon: MessageCircleIcon},
]

</script>

<template>
  <div class="p-2 flex gap-2 h-screen">
    <aside>
      <ProjectCombobox/>
      <div class="flex flex-col mt-4">
        <RouterLink
            v-for="link of links"
            :to="link.href"
            :class="cn(buttonVariants({variant: $route.path === link.href ? 'default' : 'ghost'}), 'justify-start')"
        >
          <component :is="link.Icon" class="size-4 mr-2" />
          {{ link.label}}
        </RouterLink>
      </div>
    </aside>
    <main class="flex-1 p-6 rounded-3xl border bg-secondary">
      <RouterView/>
    </main>
  </div>
</template>

<style scoped>

</style>