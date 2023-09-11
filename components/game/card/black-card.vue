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
    <div class="relative bg-slate-900 text-white border-2 border-blue-500 shadow-md shadow-black w-50 h-72 rounded-md p-6">
        <div v-html="card.content"></div>
        <div class="text-xs absolute bottom-2 left-2">
            <p>Pick {{ card.pick }}</p>
        </div>
    </div>
</template>