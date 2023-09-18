<script setup lang="ts">
import { useActiveGameStore } from '~/stores/active-game.store';

const activeGameStore = useActiveGameStore();
const cardsBeingJudged = computed(() => activeGameStore.cardsBeingJudged);
const blackCard = computed(() => activeGameStore.blackCard!);
</script>

<template>
    <div class="flex flex-col items-center mb-1">
        <GameCardBlackCard :card="blackCard" />
        <p v-if="activeGameStore.currentJudge!.needToPlay" class="mt-4 text-xs">Please wait for the judge to decide the winner.</p>
    </div>
    <div class="flex overflow-x-auto p-2 py-4 gap-x-4">
        <div v-for="(cards, setIdx) in cardsBeingJudged" :key="'white-cards-' + setIdx" class="p-2 border-2 border-gray-200 border-dotted flex gap-x-2">
            <GameCardWhiteCard v-for="(card, cardIdx) in cards" :key="'white-cards-' + setIdx + '-card-' + cardIdx"
                :content="card.content" :is-selected="activeGameStore.winningCards.map(c => c.id).includes(card.id)" />
        </div>
    </div>
</template>