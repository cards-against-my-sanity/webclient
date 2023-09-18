
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';
<script setup lang="ts">
import { useUserStore } from '~/stores/user.store';
import { useModalStore } from '~/stores/modal.store';
import { useActiveGameStore } from '~/stores/active-game.store';
import { ArrowUturnLeftIcon, PlayIcon, StopIcon } from '@heroicons/vue/24/solid';
import { GameState } from '~/shared-types/game/game-state.enum';

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);

async function leaveGame() {
    const resp = await nuxtApp.$socketOps.leaveGame();
    if (resp.status === "ok") {
        activeGameStore.resetStore();
    }
}

async function startGame() {
    const resp = await nuxtApp.$socketOps.startGame();
    if (resp.status !== "ok") {
        activeGameStore.addSystemMessageDirectly(`Game not started. ${resp.message}`);
    }
}

async function stopGame() {
    const resp = await nuxtApp.$socketOps.stopGame();
    if (resp.status !== "ok") {
        activeGameStore.addSystemMessageDirectly(`Game not stopped. ${resp.message}`);
    }
}
</script>

<template>
    <UiButton class="px-2 py-1" @click="leaveGame">
        <ArrowUturnLeftIcon class="h-4 w-4 inline mr-2"></ArrowUturnLeftIcon>
        <span>Leave</span>
    </UiButton>
    <div v-if="activeGameStore.isHost">
        <div v-if="game.state === GameState.Lobby">
            <UiButton class="px-2 py-1" @click="startGame">
                <PlayIcon class="h-4 w-4 inline mr-2"></PlayIcon>
                <span>Start</span>
            </UiButton>
        </div>
        <div v-else>
            <UiButton class="px-2 py-1" @click="stopGame">
                <StopIcon class="h-4 w-4 inline mr-2"></StopIcon>
                <span>Stop</span>
            </UiButton>
        </div>
    </div>
</template>