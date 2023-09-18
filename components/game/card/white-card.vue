<script setup lang="ts">
interface Props {
    content?: string,
    isSelected: boolean
}

const props = withDefaults(defineProps<Props>(), {
    content: "&nbsp;",
    isSelected: false
});

const extraClasses = computed(() => ({
    'border-black': !props.isSelected,
    'border-green-400': props.isSelected
}));
</script>

<template>
    <div class="grow-0 shrink-0 basis-32 w-32 h-48 bg-zinc-100 text-black border-2 shadow-sm shadow-black text-sm rounded-md p-4 hover:opacity-40 hover:cursor-pointer active:cursor-grab" :class="extraClasses">
        <div v-html="props.content"></div>
    </div>
</template>