<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);
const allDisabled = computed(() => !activeGameStore.iAmTheHost);

const availableDecks = await useDecks().fetchDecks();
const checkedDecks = computed(() => game.value.decks.map(d => d.id));

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
    <div>
        <UiCaptionedTitle title="Decks" title-classes="font-bold text-sm"
            caption="Choose which decks to have in the game." />
        <div class="grid grid-cols-7 gap-2">
            <div v-for="deck in availableDecks" :key="'deck-' + deck.id" class="flex gap-x-2">
                <FormCheckboxInput class="w-4 h-4" @input="updateDeckStatus(deck.id, $event as InputEvent)"
                    :checked="checkedDecks.includes(deck.id)" :disabled="allDisabled || waitingForDeckAck" />
                <UiCaptionedTitle title-classes="text-xs" :title="deck.name" />

            </div>
        </div>
    </div>
</template>