<script setup lang="ts">
import draggable from 'vuedraggable'
import {PlusIcon} from 'lucide-vue-next'
import {Button} from '@/components/ui/button'
import CreateTaskDialog from "@/components/CreateTaskDialog.vue";
import {useTask} from "@/store/task";
import {taskStatuses} from "@/utils/constants";
import {storeToRefs} from "pinia";

const taskStore = useTask()
const { tasks } = storeToRefs(taskStore)

const handleAddTask = (status: string) => {
  taskStore.changeStatus(status)
  taskStore.toggleModalOpen(true)
}

taskStore.getProjectTasks()
</script>

<template>
  <CreateTaskDialog />
  <div class="flex gap-4 h-full">
    <div v-for="status in taskStatuses" class="flex-1 p-4 border bg-background rounded-lg">
      <div class="mb-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="h-5 w-1 rounded bg-red-500" :style="{background: status.color}"></div>
          <span>{{ status.label }}</span>
        </div>
        <Button @click="handleAddTask(status.key)" size="icon" variant="ghost" class="size-7">
          <PlusIcon class="size-4"/>
        </Button>
      </div>
      <draggable
          v-if="tasks"
          :list="tasks[status.key]"
          group="tasks"
          class="flex flex-col gap-4"
          item-key="id"
          ghost-class="bg-secondary"
      >
        <template #item="{ element }">
          <div class="border p-2 rounded-lg bg-background">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped>

</style>