<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const availableDecks = await useDecks().fetchDecks();
const checkedDecks = computed(() => game.value.decks.map(d => d.id));

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);
const allDisabled = computed(() => !activeGameStore.iAmTheHost);

const debounceUpdateSettingsTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const waitingForSettingsAck = ref<boolean>(false)
function debounceUpdateSettings() {
    if (debounceUpdateSettingsTimeout.value) {
        clearTimeout(debounceUpdateSettingsTimeout.value);
        debounceUpdateSettingsTimeout.value = null;
    }

    if (game.value.settings.maxPlayers < 3) {
        game.value.settings.maxPlayers = 3;
    }

    if (game.value.settings.maxSpectators < 0) {
        game.value.settings.maxSpectators = 0;
    }

    if (game.value.settings.maxScore < 1) {
        game.value.settings.maxScore = 1;
    }

    debounceUpdateSettingsTimeout.value = setTimeout(async () => {
        waitingForSettingsAck.value = true;
        await nuxtApp.$socket.emitWithAck('changeGameSettings', {
            settings: game.value.settings
        });
        waitingForSettingsAck.value = false;
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
    <h2 class="text-2xl">Game Settings</h2>
    <div class="grid grid-cols-3 p-4">
        <div class="col-span-3 flex justify-between mb-4">
            <div>
                <UiCaptionedTitle title="Max Players" title-classes="text-xl" caption="Too many players can make a round take a long time." />
                <FormNumberInput v-model="game.settings.maxPlayers" @input="debounceUpdateSettings"
                    :disabled="allDisabled || waitingForSettingsAck" :min="3" />
            </div>
            <div>
                <UiCaptionedTitle title="Max Spectators" title-classes="text-xl" caption="They can watch and chat. Like a bunch of creeps." />
                <FormNumberInput v-model="game.settings.maxSpectators" @input="debounceUpdateSettings"
                    :disabled="allDisabled || waitingForSettingsAck" :min="0" />
            </div>
            <div>
                <UiCaptionedTitle title="Max Score" title-classes="text-xl" caption="A high score can make a game take a very long time." />
                <FormNumberInput v-model="game.settings.maxScore" @input="debounceUpdateSettings"
                    :disabled="allDisabled || waitingForSettingsAck" :min="1" />
            </div>
        </div>
        <div class="col-span-3 mb-2">
            <UiCaptionedTitle title="Decks" title-classes="text-xl" caption="Choose which decks to have in the game." />
        </div>
        <div v-for="deck in availableDecks" :key="'deck-' + deck.id" class="grid grid-cols-3">
            <label class="col-span-2" :for="'deck-' + deck.id">{{ deck.name }}</label>
            <input :id="'deck-' + deck.id" :disabled="allDisabled || waitingForDeckAck"
                @input="updateDeckStatus(deck.id, $event as InputEvent)" type="checkbox" :checked="checkedDecks.includes(deck.id)"/>
        </div>
        <div class="col-span-3 flex justify-center mt-12">
            <div v-if="activeGameStore.iAmTheHost">
                <UiButton @click="nuxtApp.$socket.emit('startGame')">Start Game</UiButton>
            </div>
            <div v-else>
                <p>waiting for game host to configure and start the game...</p>
            </div>
        </div>
    </div>
</template>