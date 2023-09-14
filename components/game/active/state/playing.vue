<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const hand = computed(() => activeGameStore.hand);
const blackCard = computed(() => activeGameStore.blackCard!);

const cardsToggled = ref<string[]>([]);
function toggleCard(card: string) {
    if (cardsToggled.value.includes(card)) {
        if (blackCard.value.pick > 1) {
            const idx = cardsToggled.value.findIndex(c => c === card);
            cardsToggled.value.splice(idx, 1);
        } else {
            cardsToggled.value.length = 0;
        }
    } else {
        if (cardsToggled.value.length == blackCard.value.pick) {
            return;
        }

        cardsToggled.value.push(card);
    }
}

const readyToConfirm = computed(() => cardsToggled.value.length === blackCard.value.pick);
async function confirmPlay() {
    if (!activeGameStore.iNeedToPlay || !readyToConfirm.value) {
        return;
    }

    const resp = await nuxtApp.$socketOps.playCards(cardsToggled.value);
    if (resp.status !== "ok") {
        activeGameStore.addSystemMessageDirectly(`Cards not played. ${resp.message}`);
    } else {
        activeGameStore.iNeedToPlay = false;
    }
}
</script>

<template>
    <div class="grid grid-cols-10 gap-x-4">
        <template v-if="activeGameStore.iAmTheJudge">
            <div class="col-span-10 flex justify-center items-center mb-10">
                <p>You are the Czar. Please wait for players to play their cards.</p>
            </div>
        </template>
        <template v-else>
            <div class="col-span-10 flex justify-center items-center mb-10">
                    <p>Please play {{ blackCard.pick }} cards in the order you wish them to be judged.</p>
                </div>
        </template>
        <div class="col-span-2 flex flex-col items-center gap-y-2">
            <p>This round's black card:</p>
            <GameCardBlackCard :card="blackCard" />
        </div>
        <template v-if="activeGameStore.iAmTheJudge">
            <div class="col-span-8 flex justify-center items-center mb-5">
                <p>White cards played this round:</p>
                <p>// TODO</p>
            </div>
        </template>
        <template v-else>
            <template v-if="activeGameStore.iNeedToPlay">
                <div class="col-span-8 grid grid-cols-6 gap-4 mb-6">
                    <GameCardWhiteCard v-for="(card, idx) in hand" :key="'white-card-' + idx" :card="card"
                        @click="toggleCard(card.id)" :is-selected="cardsToggled.includes(card.id)" />
                    <div v-if="readyToConfirm" class="col-span-10 flex justify-center items-center">
                        <UiButton @click="confirmPlay">Confirm Play</UiButton>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="col-span-8 flex justify-center items-center mb-5">
                    <p>Thank you! You have played your cards. Please wait for the other players to finish playing.</p>
                </div>
            </template>
        </template>
    </div>
</template>