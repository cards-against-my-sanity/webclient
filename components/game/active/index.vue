<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';
import { GameState } from '~/types/game-state.enum';

const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);
</script>

<template>
    <div class="grow flex flex-col gap-y-4">
        <div class="grow-0 border-2 border-black dark:border-white p-4 rounded-md">
            <GameActiveStateLobby v-if="game.state === GameState.Lobby" />
            <GameActiveStatePlaying v-else-if="game.state === GameState.Playing" />
            <GameActiveStateJudging v-else-if="game.state === GameState.Judging" />
        </div>
        <GameActiveChatbox />
    </div>
</template>