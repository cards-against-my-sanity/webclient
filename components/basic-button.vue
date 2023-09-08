<script setup lang="ts">
const { disabled } = withDefaults(defineProps<{
    disabled?: boolean
}>(), {
    disabled: false
});

defineEmits<{(e: 'click'): void}>();

const classes = disabled ? ['text-gray-400'] : 
    ['hover:bg-green-500', 'dark:hover:bg-green-600', 'hover:cursor-pointer', 'active:cursor-grabbing'];
</script>

<template>
    <div 
        @click="$emit('click')"
        class="text-black bg-green-400 border-blue-700 dark:text-white dark:bg-green-700 dark:border-blue-400 border-2 rounded-md text-center p-2"
        :class="classes"
    >
        <slot></slot>
    </div>
</template>