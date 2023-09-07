<script setup lang="ts">
import { useAuth } from '~/composables/use-auth';
const auth = useAuth();
await auth.getCurrentUser();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
