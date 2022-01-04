<template>
    <svg
        t="1641280366363"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2152"
        width="32"
        height="32"
    >
        <path
            fill="currentColor"
            stroke="currentColor"
            d="M472.535913 1003.339745C181.939986 582.061852 128 538.825863 128 383.999903 128 171.921956 299.921956 0 511.999903 0s383.999903 171.921956 383.999902 383.999903c0 154.825961-53.939986 198.06195-344.535913 619.339842-19.069995 27.547993-59.859985 27.545993-78.927979 0z"
            p-id="2153"
        ></path>
    </svg>
    {{ params.areaName }}
</template>
<script lang="ts" setup>
defineProps<{
    params: Object
}>()
</script>
