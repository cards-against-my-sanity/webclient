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
    <div class="h-full flex flex-col">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl">Game Settings</h2>
            <div class="flex justify-start gap-x-2">
                <UiButton @click="showSettingsTab" :disabled="shownTab === 'settings'">Settings</UiButton>
                <UiButton @click="showDecksTab" :disabled="shownTab === 'decks'">Decks</UiButton>
            </div>
        </div>
        <div class="h-full overflow-y-auto sm:h-auto">
            <GameActiveStateLobbySettings v-if="shownTab === 'settings'" />
            <KeepAlive v-else-if="shownTab === 'decks'">
                <GameActiveStateLobbyDecks />
            </KeepAlive>
        </div>
    </div>
</template>