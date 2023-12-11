<script setup>
defineProps<{ someData: number }>();
</script>

<template>
	{{ someData }}
	{{ missingVar }}
</template>
