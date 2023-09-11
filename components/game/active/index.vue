<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';
import { GameState } from '~/types/game-state.enum';

const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);
</script>

<template>
    <div class="flex flex-col">
        <div class="text-center mb-10">
            <h1 class="text-5xl"><span class="font-bold">{{ game.host.nickname }}</span>'s game</h1>
        </div>
        <div class="grid grid-cols-12 grid-rows-1 gap-4">
            <GameActiveLeftMenu class="col-span-2" />
            <div class="col-span-10 border-2 border-black dark:border-white p-4 rounded-md">
                <GameActiveStateLobby v-if="game.state === GameState.Lobby" />
                <GameActiveStatePlaying v-else-if="game.state === GameState.Playing" />
                <GameActiveStateJudging v-else-if="game.state === GameState.Judging" />
            </div>
        </div>
    </div>
</template>