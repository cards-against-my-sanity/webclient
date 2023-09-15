<script setup lang="ts">
import { GameState } from '~/shared-types/game/game-state.enum';
import { useActiveGameStore } from '~/stores/active-game.store';

const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);

const openTab = ref<"game" | "scoreboard" | "chat">("game");
</script>

<template>
    <div class="h-140 mdht:h-172 lght:h-201 flex flex-col items-center">
        <UiTabbedInterface>
            <UiTabbedInterfaceItem text="Game" @click="openTab = 'game'" :active="openTab === 'game'" />
            <UiTabbedInterfaceItem text="Scoreboard" @click="openTab = 'scoreboard'" :active="openTab === 'scoreboard'" />
            <UiTabbedInterfaceItem text="Chat" @click="openTab = 'chat'" :active="openTab === 'chat'" />
        </UiTabbedInterface>
        <div class="h-full w-full flex flex-col overflow-y-auto p-4 border-2 border-black dark:border-white rounded-md">
            <div v-if="openTab === 'game'">
                <GameActiveStateLobby v-if="game.state === GameState.Lobby" />
                <GameActiveStatePlaying v-else-if="game.state === GameState.Playing" />
                <GameActiveStateJudging v-else-if="game.state === GameState.Judging" />
            </div>
            <GameActiveScoreboard v-else-if="openTab === 'scoreboard'" />
            <GameActiveChatbox v-else-if="openTab === 'chat'" />
        </div>
    </div>
</template>