<template>
    <div class="text-white rounded-3xl border-1 border-green-400 p-2">
        <close-circle-outlined class="absolute top-0 right-0 cursor-pointer" @click="closeInfoWindow" />
        我是信息窗体
    </div>
</template>
<script lang="ts" setup>
import { CloseCircleOutlined } from '@ant-design/icons-vue'
defineProps<{
    params: Object
}>()
const emit = defineEmits(['closeInfoWindow'])
const closeInfoWindow = () => {
    emit('closeInfoWindow')
}
</script>
