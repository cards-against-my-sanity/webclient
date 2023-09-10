<script setup lang="ts">
const props = withDefaults(defineProps<{
    title: string,
    titleClasses?: string,
    caption?: string
}>(), {
    titleClasses: "",
    caption: undefined,
    placeholder: undefined
});
</script>

<template>
    <span class="text-gray-700 dark:text-gray-100" :class="props.titleClasses">{{ props.title }}</span>
    <span v-if="props.caption" class="text-xs text-gray-500 dark:text-gray-600 block">
        {{ props.caption }}
    </span>
</template>