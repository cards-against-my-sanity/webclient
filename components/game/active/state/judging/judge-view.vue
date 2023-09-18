<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const nuxtApp = useNuxtApp();
const activeGameStore = useActiveGameStore();
const cardsBeingJudged = computed(() => activeGameStore.cardsBeingJudged);
const blackCard = computed(() => activeGameStore.blackCard!);

const cardsToggled = ref<string[]>([]);
function toggleCards(cards: string[]) {
    if (alreadyJudged.value) {
        return;
    }
    
    cardsToggled.value.length = 0;
    cardsToggled.value.push(...cards);
}

const alreadyJudged = ref<boolean>(false);
const readyToConfirm = computed(() => cardsToggled.value.length !== 0);
async function confirmJudgement() {
    if (!readyToConfirm.value || alreadyJudged.value) {
        return;
    }

    const resp = await nuxtApp.$socketOps.judgeCards(cardsToggled.value);
    if (resp.status !== "ok") {
        activeGameStore.addSystemMessageDirectly(`Cards not judged. ${resp.message}`);
    } else {
        cardsToggled.value.length = 0;
        alreadyJudged.value = true;
    }
}

const pluralizedCardWord = computed(() => blackCard.value.pick > 1 ? 'cards' : 'card');
</script>

<template>
    <div class="flex flex-col items-center mb-1">
        <GameCardBlackCard :card="blackCard" />
        <p class="mt-4 text-xs">Please choose the {{ blackCard.pick }} winning {{ pluralizedCardWord }}.</p>
    </div>
    <div class="flex overflow-x-auto p-2 py-4 gap-x-4">
        <div v-for="(cards, setIdx) in cardsBeingJudged" :key="'white-cards-' + setIdx" class="p-2 border-2 border-gray-200 border-dotted flex gap-x-2">
            <GameCardWhiteCard v-for="(card, cardIdx) in cards" :key="'white-cards-' + setIdx + '-card-' + cardIdx"
                :content="card.content" @click="toggleCards(cards.map(c => c.id))" :is-selected="cardsToggled.includes(card.id)" />
        </div>
    </div>
    <div v-if="readyToConfirm" class="col-span-10 flex justify-center items-center">
        <UiButton @click="confirmJudgement">Confirm Judgement</UiButton>
    </div>
</template>