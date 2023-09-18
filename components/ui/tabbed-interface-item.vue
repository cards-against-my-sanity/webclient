<script setup lang="ts">
const props = withDefaults(defineProps<{
    active: boolean,
    disabled: boolean,
    text: string
}>(), {
    active: false,
    disabled: false
});

defineEmits<{ (e: 'click'): void }>();

const extraClasses = computed(() => {
    if (props.disabled) {
        return ['text-gray-400', 'cursor-not-allowed', 'dark:text-gray-500'];
    } else if (props.active) {
        return ['text-green-600', 'bg-gray-200', 'dark:bg-gray-800', 'dark:text-green-400']
    } else {
        return ['hover:text-gray-600', 'hover:bg-gray-100', 'dark:hover:bg-gray-800', 'dark:hover:text-gray-300']
    }
});
</script>

<template>
    <li class="mr-2">
        <a href="#" @click.prevent="$emit('click')" :aria-current="props.active" class="inline-block p-4 rounded-t-md" :class="extraClasses">{{ props.text }}</a>
    </li>
</template>