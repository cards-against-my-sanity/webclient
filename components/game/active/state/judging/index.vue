<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const cardsBeingJudged = computed(() => activeGameStore.cardsBeingJudged);
const blackCard = computed(() => activeGameStore.blackCard!);


</script>

<template>
    <div class="grid grid-cols-10 gap-x-4">
        <GameActiveStateJudgingJudgeView v-if="activeGameStore.isJudge" />
        <GameActiveStateJudgingPlayerView v-else />
    </div>
</template>