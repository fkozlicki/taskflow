<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Button} from "@/components/ui/button";
import {CalendarIcon, LoaderCircleIcon} from "lucide-vue-next";
import {toTypedSchema} from "@vee-validate/zod";
import {useForm} from "vee-validate";
import {z} from "zod";
import {useTask} from "@/store/task.ts";
import {storeToRefs} from "pinia";
import {CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today, CalendarDateTime, parseDateTime} from '@internationalized/date'
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import {taskStatuses} from "@/utils/constants.ts";
import {useRoute} from "vue-router";
import {Calendar} from '@/components/ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {toDate} from 'radix-vue/date'
import {computed, ref} from "vue";
import {cn} from '@/lib/utils.ts'

const taskStore = useTask()
const {tasks} = storeToRefs(taskStore)
const {modalOpen} = storeToRefs(taskStore)
const route = useRoute()

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
  timeStyle: "short"
})

const value = computed({
  get: () => values.dueDate ? parseDateTime(values.dueDate) : undefined,
  set: val => val,
})

const placeholder = ref()

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(250),
  status: z.string().min(1),
  dueDate: z.string().min(1).refine(v => v, {message: 'A due date is required'}),
}))

const {isSubmitting, handleSubmit, values, setFieldValue} = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  console.log(values)
  // await taskStore.createTask({
  //   ...values,
  //   position: tasks.value[values.status].length,
  //   projectId: route.params.id
  // })
})
</script>

<template>
  <Dialog :open="modalOpen">
    <DialogContent class="sm:max-w-[450px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Name" v-bind="componentField"/>
            </FormControl>
            <FormDescription>
              This is your task's name.
            </FormDescription>
            <FormMessage/>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Name" v-bind="componentField"/>
            </FormControl>
            <FormDescription>
              This is your task's description.
            </FormDescription>
            <FormMessage/>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="status">
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select task status"/>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="status in taskStatuses" :value="status.key" :style="{color: status.color}">
                    {{ status.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription>
              You can manage email addresses in your
              <a href="/examples/forms">email settings</a>.
            </FormDescription>
            <FormMessage/>
          </FormItem>
        </FormField>
        <FormField name="dueDate">
          <FormItem class="flex flex-col">
            <FormLabel>Date of birth</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <FormControl>
                  <Button
                      variant="outline" :class="cn(
                  'ps-3 text-start font-normal',
                  !value && 'text-muted-foreground',
                )"
                  >
                    <span>{{ value ? df.format(toDate(value)) : "Pick a date" }}</span>
                    <CalendarIcon class="ms-auto h-4 w-4 opacity-50"/>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar
                    v-model:placeholder="placeholder"
                    v-model="value"
                    calendar-label="Due date"
                    initial-focus
                    :min-value="today(getLocalTimeZone())"
                    @update:model-value="(v) => {
                if (v) {
                  const date = new CalendarDateTime(v.year, v.month, v.day)
                  setFieldValue('dueDate', date.toString())
                }
                else {
                  setFieldValue('dueDate', undefined)
                }

              }"
                />
              <div class="flex gap-4 px-3 pb-3">
                <Input type="number" default-value="12" min="1" max="12" class="w-16" />
                <Input type="number" default-value="0" min="0" max="59" class="w-16" />
              </div>
              </PopoverContent>
            </Popover>
            <FormDescription>
              Your date of birth is used to calculate your age.
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