<script setup lang="ts">
interface Props {
    card: {
        content: string
    },
    isSelected: boolean
}

const props = defineProps<Props>();

const extraClasses = computed(() => ({
    'border-black': !props.isSelected,
    'border-green-400': props.isSelected
}));
</script>

<template>
    <div class="bg-zinc-100 text-black border-2 shadow-md shadow-black w-40 h-40 rounded-md p-4 hover:opacity-40 hover:scale-105 hover:cursor-pointer active:cursor-grab" :class="extraClasses">
        <div v-html="props.card.content"></div>
    </div>
</template>