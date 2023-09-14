<script setup lang="ts">
import { useUserStore } from '~/stores/user.store';
import { useActiveGameStore } from '~/stores/active-game.store';
import { MoonIcon, SunIcon, EllipsisHorizontalCircleIcon, ArrowLeftOnRectangleIcon, PlayIcon, StopIcon } from '@heroicons/vue/24/solid';
import { GameState } from '~/shared-types/game/game-state.enum';

const nuxtApp = useNuxtApp();
const user = useUserStore();
const colorMode = useColorMode();
const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);

const colorModeIcon = computed(() => {
    if (colorMode.preference === 'system') {
        if (colorMode.value === 'dark') {
            return SunIcon;
        } else {
            return MoonIcon;
        }
    } else if (colorMode.preference === 'dark') {
        return SunIcon;
    } else {
        return MoonIcon;
    }
});

function toggleColorPreference() {
    if (colorMode.preference === 'system') {
        if (colorMode.value === 'dark') {
            colorMode.preference = 'light';
        } else {
            colorMode.preference = 'dark';
        }
    } else if (colorMode.preference === 'dark') {
        colorMode.preference = 'light';
    } else {
        colorMode.preference = 'dark';
    }
}

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
    <div class="grow-0 flex justify-between items-center">
        <div class="flex justify-evenly items-center gap-x-4">
            <img src="/logo.svg" class="w-20 h-20" alt="Cards Against My Sanity Logo" />
            <client-only>
                <component @click="toggleColorPreference" class="h-6 w-6 cursor-pointer" :is="colorModeIcon" />
                <template #fallback>
                    <EllipsisHorizontalCircleIcon class="h-6 w-6 cursor-pointer" />
                </template>
            </client-only>
        </div>
        <nav class="flex justify-evenly items-center list-none gap-x-4 text-lg">
            <UiButton class="px-2 py-1" @click="leaveGame">
                <ArrowLeftOnRectangleIcon class="h-4 w-4 inline mr-2"></ArrowLeftOnRectangleIcon>
                <span class="text-sm">Leave Game</span>
            </UiButton>
            <div v-if="activeGameStore.iAmTheHost">
                <div v-if="game.state === GameState.Lobby">
                    <UiButton class="px-2 py-1" @click="startGame">
                        <PlayIcon class="h-4 w-4 inline mr-2"></PlayIcon>
                        <span class="text-sm">Start Game</span>
                    </UiButton>
                </div>
                <div v-else>
                    <UiButton class="px-2 py-1" @click="stopGame">
                        <StopIcon class="h-4 w-4 inline mr-2"></StopIcon>
                        <span class="text-sm">Stop Game Game</span>
                    </UiButton>
                </div>
            </div>
        </nav>
    </div>
</template>