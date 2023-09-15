<script setup lang="ts">
const props = withDefaults(defineProps<{
    to: string
}>(), {
    to: '#'
});

defineEmits<{ (e: 'click'): void }>();
</script>

<template>
    <nuxt-link :to="props.to" @click.prevent="$emit('click')" class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-600 active:text-green-800 dark:active:text-green-600 hover:cursor-pointer active:cursor-grabbing"><slot></slot></nuxt-link>
</template>