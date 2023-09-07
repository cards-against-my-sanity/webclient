<script setup>
import { useModalStore } from './stores/modal.store';
const modal = useModalStore();
await useAuth().fetchCurrentUser();
</script>

<template>
  <NuxtLayout>
    <div class="container h-screen mx-auto">
      <AppHeader />
      <NuxtPage />
    </div>
    
    <ModalLogInModal :open="modal.loginModalOpen" @close="modal.loginModalOpen = false" />
    <ModalSignUpModal :open="modal.signupModalOpen" @close="modal.signupModalOpen = false" />
  </NuxtLayout>
</template>
