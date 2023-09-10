<script setup lang="ts">
import { useGameStore } from '~/stores/game.store';
import { GameState } from '~/types/game-state.enum';
import { ArrowLeftOnRectangleIcon } from '@heroicons/vue/24/solid';
import { GameSettings } from '~/types/game-settings.interface';

const nuxtApp = useNuxtApp();
const gameStore = useGameStore();
const availableDecks = await useDecks().fetchDecks();

function leaveGame() {
    nuxtApp.$socket.emit("leaveGame", { gameId: gameStore.activeGame!.id });
}

const maxPlayers = ref(gameStore.activeGame!.settings.maxPlayers);
const maxSpectators = ref(gameStore.activeGame!.settings.maxSpectators);
const maxScore = ref(gameStore.activeGame!.settings.maxScore);
const debounceUpdateSettingsTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const queuedUpdateSettingsPayload = ref<Partial<GameSettings>>({});
const waitingForSettingsAck = ref<boolean>(false);

function debounceUpdateSettings(setting: string) {
    if (debounceUpdateSettingsTimeout.value) {
        clearTimeout(debounceUpdateSettingsTimeout.value);
    }

    switch (setting) {
        case 'maxPlayers':
            queuedUpdateSettingsPayload.value.maxPlayers = maxPlayers.value;
            break;
        case 'maxSpectators':
            queuedUpdateSettingsPayload.value.maxSpectators = maxSpectators.value;
            break;
        case 'maxScore':
            queuedUpdateSettingsPayload.value.maxScore = maxScore.value;
            break;
    }

    debounceUpdateSettingsTimeout.value = setTimeout(async () => {
        waitingForSettingsAck.value = true;
        await nuxtApp.$socket.emitWithAck('changeGameSettings', {
            settings: queuedUpdateSettingsPayload.value
        });
        waitingForSettingsAck.value = false;
        queuedUpdateSettingsPayload.value = {};
    }, 1000);
}

const waitingForDeckAck = ref<boolean>(false);
async function updateDeckStatus(deckId: string, event: InputEvent) {
    waitingForDeckAck.value = true;

    if ((event.target as HTMLInputElement).checked) {
        await nuxtApp.$socket.emitWithAck('addDeckToGame', {
            deck_id: deckId
        });
    } else {
        await nuxtApp.$socket.emitWithAck('removeDeckFromGame', {
            deck_id: deckId
        });
    }

    waitingForDeckAck.value = false;
}
</script>

<template>
    <div class="flex flex-col">
        <div class="text-center mb-10">
            <h1 class="text-5xl"><span class="font-bold">{{ gameStore.activeGame!.host.nickname }}</span>'s game</h1>
        </div>
        <div class="grid grid-cols-12 grid-rows-1 gap-4">
            <div class="col-span-2 flex flex-col space-y-4 border-2 border-black dark:border-white p-4 rounded-md">
                <BasicButton @click="leaveGame" class="flex justify-center items-center gap-x-2">
                    <ArrowLeftOnRectangleIcon class="h-6 w-6 inline"></ArrowLeftOnRectangleIcon>
                    Leave Game
                </BasicButton>
                <div>
                    <h2 class="text-2xl">Players ({{ gameStore.activeGame!.players.length }} / {{
                        gameStore.activeGame!.settings.maxPlayers }})
                    </h2>
                </div>
                <ol class="mt-2 mb-2 indent-2 list-decimal list-inside">
                    <li v-for="(player, idx) in gameStore.activeGame!.players" :key="'player-' + idx" class="text-lg">
                        {{ player.nickname }}
                    </li>
                </ol>
                <template v-if="gameStore.activeGame!.spectators.length">
                    <div>
                        <h2 class="text-2xl">Spectators ({{ gameStore.activeGame!.spectators.length }} / {{
                            gameStore.activeGame!.settings.maxSpectators }})</h2>
                    </div>
                    <ol class="mt-2 indent-2 list-decimal list-inside">
                        <li v-for="(spectator, idx) in gameStore.activeGame!.spectators" :key="'spectator-' + idx"
                            class="text-lg">
                            {{ spectator.nickname }}
                        </li>
                    </ol>
                </template>
            </div>
            <div class="col-span-10 border-2 border-black dark:border-white p-4 rounded-md">
                <div v-if="gameStore.activeGame!.state === GameState.Lobby">
                    <h2 class="text-2xl">Game Settings</h2>
                    <div class="grid grid-cols-3 p-4">
                        <div class="col-span-3 flex justify-between mb-4">
                            <SimpleFormInput v-model="maxPlayers" @input="debounceUpdateSettings('maxPlayers')"
                                :disabled="waitingForSettingsAck" type="number" title="Max Players" title-classes="text-xl"
                                caption="More than 10 can be cramped." />
                            <SimpleFormInput v-model="maxSpectators" @input="debounceUpdateSettings('maxSpectators')"
                                :disabled="waitingForSettingsAck" type="number" title="Max Spectators"
                                title-classes="text-xl" caption="The more the merrier?" />
                            <SimpleFormInput v-model="maxScore" @input="debounceUpdateSettings('maxScore')"
                                :disabled="waitingForSettingsAck" type="number" title="Max Score" title-classes="text-xl"
                                caption="The more...the longer..." />
                        </div>
                        <div class="col-span-3 mb-2">
                            <SimpleTitle title="Decks" title-classes="text-xl"
                                caption="Choose which decks to have in the game." />
                        </div>
                        <div v-for="deck in availableDecks" :key="'deck-' + deck.id" class="flex items-center gap-x-2">
                            <label :for="'deck-' + deck.id">{{ deck.name }}</label>
                            <input :id="'deck-' + deck.id" :disabled="waitingForDeckAck" @input="updateDeckStatus(deck.id, $event as InputEvent)"
                                type="checkbox" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>