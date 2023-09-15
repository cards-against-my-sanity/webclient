<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const game = computed(() => activeGameStore.game!);
const allDisabled = computed(() => !activeGameStore.isHost);

const availableDecks = await useDecks().fetchDecks();
const checkedDecks = computed(() => game.value.decks.map(d => d.id));

const waitingForDeckAck = ref<boolean>(false);
async function updateDeckStatus(deckId: string, event: InputEvent) {
    waitingForDeckAck.value = true;

    if ((event.target as HTMLInputElement).checked) {
        const resp = await nuxtApp.$socketOps.addDeckToGame(deckId);
        if (resp.status !== "ok") {
            activeGameStore.addSystemMessageDirectly(`Deck not added. ${resp.message}`);
        }
    } else {
        const resp = await nuxtApp.$socketOps.removeDeckFromGame(deckId);
        if (resp.status !== "ok") {
            activeGameStore.addSystemMessageDirectly(`Deck not removed. ${resp.message}`);
        }
    }

    waitingForDeckAck.value = false;
}
</script>

<template>
    <div>
        <UiCaptionedTitle title="Decks" title-classes="font-bold text-sm"
            caption="Choose which decks to have in the game." />
        <div class="grid grid-cols-2 gap-x-2 gap-y-4 mt-4 text-xs">
            <div v-for="deck in availableDecks" :key="'deck-' + deck.id" class="grid grid-cols-7 grid-rows-1 gap-x-2 items-center">
                <UiCaptionedTitle class="col-span-5" title-classes="text-xs" :title="deck.name" />
                <FormCheckboxInput class="col-span-2 ml-2 w-4 h-4" @input="updateDeckStatus(deck.id, $event as InputEvent)"
                    :checked="checkedDecks.includes(deck.id)" :disabled="allDisabled || waitingForDeckAck" />
            </div>
        </div>
    </div>
</template>