<script setup lang="ts">
const { disabled } = withDefaults(defineProps<{
    disabled: boolean
}>(), {
    disabled: false
});

defineEmits<{(e: 'click'): void}>();

const classes = disabled ? ['text-gray-400'] : 
    ['text-black', 'hover:bg-gray-400', 'hover:border-gray-600', 'hover:cursor-pointer', 'active:cursor-grabbing'];
</script>

<template>
    <div 
        @click="$emit('click')"
        class="bg-gray-200 rounded-md text-center p-2"
        :class="classes"
    >
        <slot></slot>
    </div>
</template>