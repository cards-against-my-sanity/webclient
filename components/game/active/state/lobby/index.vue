<script setup lang="ts">
const shownTab = ref<"settings" | "decks">("settings");

function showSettingsTab() {
    shownTab.value = "settings";
}

function showDecksTab() {
    shownTab.value = "decks";
}
</script>

<template>
    <div class="flex justify-between items-center">
        <h2 class="text-2xl">Game Settings</h2>
        <div class="flex justify-start gap-x-2">
            <UiButton @click="showSettingsTab" :disabled="shownTab === 'settings'">Settings</UiButton>
            <UiButton @click="showDecksTab" :disabled="shownTab === 'decks'">Decks</UiButton>
        </div>
    </div>
    <GameActiveStateLobbySettings v-if="shownTab === 'settings'" />
    <KeepAlive v-else-if="shownTab === 'decks'">
        <GameActiveStateLobbyDecks />
    </KeepAlive>
</template>