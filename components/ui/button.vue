<script setup lang="ts">
const props = withDefaults(defineProps<{
    disabled?: boolean
}>(), {
    disabled: false
});

const emit = defineEmits<{(e: 'click'): void}>();

const classes = computed(() => props.disabled ? ['text-gray-400'] : 
    ['hover:bg-green-500', 'active:bg-green-500', 'dark:hover:bg-green-600', 'dark:active:bg-green-600', 'hover:cursor-pointer', 'active:cursor-grabbing']);

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
        class="text-black bg-green-400 border-2 border-blue-700 rounded-md text-center p-2 
            text-xs sm:text-sm md:text-lg
            dark:text-white dark:bg-green-700 dark:border-blue-400"
        :class="classes"
    >
        <slot></slot>
    </div>
</template>