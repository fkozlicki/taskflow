<script setup lang="ts">

import {onMounted} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

const route = useRoute();

const verify = async () => {
  const res = await axios.get("http://localhost:8080/api/users/verify", {
    params: {
      code: route.query.code
    }
  })

  console.log(res.data)
}

onMounted(() => {
  verify()
})

</script>

<template>

<div>Verifying your account...</div>
</template>

<style scoped>

</style>