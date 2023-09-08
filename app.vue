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
        <notifications position="bottom right" :pause-on-hover="true" class="mb-5 mr-5" :max="2" />
      </client-only>
    </div>
  </NuxtLayout>
</template>
