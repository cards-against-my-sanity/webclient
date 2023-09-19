<script setup lang="ts">
import GameActiveStateLobbySettings from '~/components/game/active/state/lobby/settings.vue';
import GameActiveStateLobbyDecks from '~/components/game/active/state/lobby/decks.vue';

const shownTab = ref<"settings" | "decks">("settings");
const shownTabComponent = computed(() => {
    switch (shownTab.value) {
        case 'settings':
            return GameActiveStateLobbySettings;
        case 'decks':
            return GameActiveStateLobbyDecks;
    }
});

function showSettingsTab() {
    shownTab.value = "settings";
}

function showDecksTab() {
    shownTab.value = "decks";
}
</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl">Game Settings</h2>
            <div class="flex justify-start gap-x-2">
                <UiButton @click="showSettingsTab" :disabled="shownTab === 'settings'">Settings</UiButton>
                <UiButton @click="showDecksTab" :disabled="shownTab === 'decks'">Decks</UiButton>
            </div>
        </div>
        <div class="h-full overflow-y-auto sm:h-auto">
            <KeepAlive>
                <component :is="shownTabComponent" />
            </KeepAlive>
        </div>
    </div>
</template>