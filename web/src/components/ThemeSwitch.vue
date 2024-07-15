<script setup lang="ts">

import {Button} from '@/components/ui/button'
import {MoonIcon, SunIcon} from 'lucide-vue-next'
import {useDark, useToggle} from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

</script>

<template>
  <Button @click="toggleDark()" size="icon" variant="ghost">
    <component :is="isDark ? SunIcon : MoonIcon" class="size-5"/>
  </Button>
</template>

<style scoped>

</style>