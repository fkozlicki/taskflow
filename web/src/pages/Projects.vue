<script setup lang="ts">
import {useProject} from "@/store/project.ts";
import {storeToRefs} from "pinia";
import {useRoute} from "vue-router";

const projectStore = useProject()
const {projects} = storeToRefs(projectStore)
const route = useRoute()

projectStore.getUserProjects().then(() => {
  const id = route.params.id
  selectedProject.value = projects.value.find(project => project.id === id)
})
</script>

<template>
  <div class="max-w-6xl m-auto py-4">
    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <RouterLink v-for="project in projects" :to="`/projects/${project.id}`" class="border p-4 rounded-lg">
        {{project.name}}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>