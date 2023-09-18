<script setup lang="ts">
interface Props {
    card: {
        content: string,
        pick: number
    }
}

const { card } = defineProps<Props>();
</script>

<template>
    <div class="relative w-32 h-48 bg-slate-900 text-white border-2 border-blue-500 shadow-sm shadow-black rounded-md p-4 text-xs">
        <div v-html="card.content"></div>
        <div class="absolute bottom-2 left-2">
            <p>Pick {{ card.pick }}</p>
        </div>
    </div>
</template>