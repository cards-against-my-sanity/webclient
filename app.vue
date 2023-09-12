<script setup>
import { useActiveGameStore } from './stores/active-game.store';
import { useModalStore } from './stores/modal.store';

const modal = useModalStore();
const activeGameStore = useActiveGameStore();

useHead({
  bodyAttrs: {
    class: 'dark:bg-zinc-900 dark:text-white'
  }
});

await useAuth().fetchCurrentUser();
</script>

<template>
  <div class="flex flex-col h-screen px-4 pb-4" v-if="activeGameStore.exists">
    <AppSmallHeader />
    <GameActive />
  </div>
  <div class="container mx-auto pb-8" v-else>
    <AppNormalHeader />
    <GameBrowser />
  </div>

  <ModalLogIn :open="modal.loginModalOpen" @close="modal.loginModalOpen = false" />
  <ModalSignUp :open="modal.signupModalOpen" @close="modal.signupModalOpen = false" />

  <client-only>
    <notifications position="top center" :pause-on-hover="true" class="mt-5" :duration="5000" width="500px" :max="3" />
  </client-only>
</template>
