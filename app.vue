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

<style scoped>
#game-container {
  /*
    Header is 5rem tall (h-20). 
    Leave 1rem at the bottom.
  */
  height: calc(100% - 6rem);
}
</style>

<template>
  <div class="h-screen mx-4">
    <AppHeader class="h-20" />
    <div id="game-container" class="w-full overflow-y-auto">
      <GameActive v-if="activeGameStore.exists" />
      <GameBrowser v-else />
    </div>
  </div>

  <ModalSignUp :open="modal.signupModalOpen" @close="modal.signupModalOpen = false" />
  <ModalLogIn :open="modal.loginModalOpen" @close="modal.loginModalOpen = false" />

  <client-only>
    <notifications position="top center" :pause-on-hover="true" class="mt-5 w-[200px]" :duration="5000" :max="3" />
  </client-only>
</template>
