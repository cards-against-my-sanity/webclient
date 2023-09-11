<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const activeGameStore = useActiveGameStore();
</script>

<template>
    <GameActive v-if="activeGameStore.exists" />
    <GameBrowser v-else />
</template> 