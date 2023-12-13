<template>
	{{ someData }}
	{{ missingVar }}
</template>

<script setup lang="ts">
const someData = 1


defineProps<{ someData: number }>()

</script>
