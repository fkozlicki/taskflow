<script setup lang="ts">
import {cn} from '@/lib/utils'
import {Check, ChevronsUpDown, ImageIcon, LoaderCircleIcon} from 'lucide-vue-next'
import {Button} from '@/components/ui/button'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover'
import {ref} from 'vue'
import {useProject} from "@/store/project.ts";
import {storeToRefs} from "pinia";
import {useToggle} from "@vueuse/core";
import {toTypedSchema} from "@vee-validate/zod";
import {z} from "zod";
import {useForm} from "vee-validate";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()
const route = useRoute()
const projectStore = useProject()
const {projects} = storeToRefs(projectStore)

const open = ref(false)
const dialogOpen = ref(false)
const selectedProject = ref()

projectStore.getUserProjects().then(() => {
  const id = route.params.id
  selectedProject.value = projects.value.find(project => project.id === id)
})

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(50),
}))

const {handleSubmit, isSubmitting} = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  await projectStore.create(values)
  console.log('Form submitted!', values)
})

const onSelect = (project) => {
  router.push(`/projects/${project.id}`)
  open.value = false
}

</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          class="w-[250px] justify-between h-auto"
      >
        <div class="flex gap-2 items-center">
          <Avatar class="size-8">
            <AvatarImage src="" alt="project avatar"/>
            <AvatarFallback>
              <ImageIcon class="size-4"/>
            </AvatarFallback>
          </Avatar>
          <div class="flex flex-col items-start">
            <span class="text-xs text-muted-foreground">Project</span>
            <span>
              {{ selectedProject?.name }}
            </span>
          </div>

        </div>

        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50"/>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[250px] p-0">
      <Command v-model="selectedProject">
        <CommandInput placeholder="Search framework..."/>
        <CommandEmpty>No framework found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
                v-for="project in projects"
                :key="project.id"
                :value="project"
                @select="onSelect(project)"
            >
              <Check
                  :class="cn(
                  'mr-2 h-4 w-4',
                  selectedProject.id === project.id ? 'opacity-100' : 'opacity-0',
                )"
              />
              {{ project.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div class="p-1.5 border-t">
          <Button @click="dialogOpen = true" size="sm" type="button" class="w-full">Create new</Button>
        </div>
      </Command>
    </PopoverContent>
  </Popover>
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Project</DialogTitle>
        <DialogDescription>
          Fill the form and submit to create the project
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Name" v-bind="componentField"/>
            </FormControl>
            <FormDescription>
              This is your project's name.
            </FormDescription>
            <FormMessage/>
          </FormItem>
        </FormField>
        <DialogFooter>
          <Button type="submit" :disabled="isSubmitting">
            <LoaderCircleIcon v-if="isSubmitting" class="size-4 animate-spin"/>
            <template v-else>Create</template>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>