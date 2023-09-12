<script setup lang="ts">
const props = withDefaults(defineProps<{
    disabled?: boolean
}>(), {
    disabled: false
});

const emit = defineEmits<{(e: 'click'): void}>();

const classes = props.disabled ? ['text-gray-400'] : 
    ['hover:bg-green-500', 'dark:hover:bg-green-600', 'hover:cursor-pointer', 'active:cursor-grabbing'];

function handleClick() {
    if (props.disabled) {
        return;
    }
    
    emit('click');
}
</script>

<template>
    <div 
        @click="handleClick"
        class="text-black bg-green-400 border-blue-700 dark:text-white dark:bg-green-700 dark:border-blue-400 border-2 rounded-md text-center p-2"
        :class="classes"
    >
        <slot></slot>
    </div>
</template>