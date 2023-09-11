<script setup>
import { useModalStore } from './stores/modal.store';

const modal = useModalStore();

await useAuth().fetchCurrentUser();


</script>

<template>
  <NuxtLayout>
    <div class="dark:bg-zinc-900 dark:text-white">
      <div class="container h-screen mx-auto">
        <AppHeader />
        <NuxtPage />
      </div>

      <ModalLogIn :open="modal.loginModalOpen" @close="modal.loginModalOpen = false" />
      <ModalSignUp :open="modal.signupModalOpen" @close="modal.signupModalOpen = false" />

      <client-only>
        <notifications position="top center" :pause-on-hover="true" class="mt-5" :duration="5000" width="500px" :max="3" />
      </client-only>
    </div>
  </NuxtLayout>
</template>
