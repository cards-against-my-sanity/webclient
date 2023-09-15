<script setup lang="ts">
import { useActiveGameStore } from './stores/active-game.store';
import { useModalStore } from './stores/modal.store';

const auth = useAuth();
const modal = useModalStore();
const activeGameStore = useActiveGameStore();

useHead({
  bodyAttrs: {
    class: 'dark:bg-zinc-900 dark:text-white'
  }
});

await auth.fetchCurrentUser();
</script>

<template>
  <div class="h-screen mx-4" v-if="activeGameStore.exists">
    <AppSmallHeader />
    <GameActive />
  </div>
  <div class="max-w-[90vw] sm:container mx-auto pb-8" v-else>
    <AppNormalHeader />
    <GameBrowser />
  </div>

  <ModalSignUp :open="modal.signupModalOpen" @close="modal.signupModalOpen = false" />
  <ModalLogIn :open="modal.loginModalOpen" @close="modal.loginModalOpen = false" />

  <client-only>
    <notifications position="top center" :pause-on-hover="true" class="mt-5 w-[200px]" :duration="5000" :max="3" />
  </client-only>
</template>
