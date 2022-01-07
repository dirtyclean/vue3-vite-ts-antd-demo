<template>
    <div>
        <a-cascader
            :options="state.areaData"
            placeholder="筛选区域"
            :showSearch="{ matchInputWidth: false }"
            :fieldNames="{ label: 'areaName', value: 'areaCode', children: 'children' }"
            :allowClear="false"
            v-model:value="areaCodes"
            :display-render="({ labels }) => labels[labels.length - 1]"
            style="width: 200px"
            change-on-select
            class="mr20"
            expand-trigger="hover"
        />
        <div class="w-300 h-200">
            <d3Map
                :getAreaMarkerList="getAreaMarkerList"
                :showAreaText="false"
                :currentAreaCode="areaCodes.slice(-1)[0]"
                @update-area-codes="updateAreaCodes"
                ref="d3MapRef"
                :markerOffset="[0, 0]"
            >
                <template #infoWindow="params">
                    <infoWindow :params="params" @close-info-window="closeInfoWindow" />
                </template>
                <template #marker="params">
                    <Marker :params="params" />
                </template>
            </d3Map>
        </div>
    </div>
</template>
<script lang="ts" setup>
import d3Map from '@/components/d3Map-js.vue'
import infoWindow from './infoWindow.vue'
import Marker from './marker.vue'
import { getAreaMarkerList, getAreaList } from '@/api/map'
import { ref, reactive, Ref } from 'vue'
import { getSelectedIds } from '@/utils/methods'
const areaCodes: Ref<Array<any>> = ref([])
const state = reactive({
    areaData: new Array<any>([])
})
state.areaData = await getAreaList()
areaCodes.value = state.areaData.length ? [state.areaData[0].areaCode] : []
const updateAreaCodes = currentAreaCode => {
    areaCodes.value = getSelectedIds(state.areaData, currentAreaCode, 'parentAreaCode', 'areaCode')
}
const d3MapRef = ref<InstanceType<typeof d3Map>>()
const closeInfoWindow = () => {
    d3MapRef.value && d3MapRef.value.closeInfoWindow()
}
</script>
<style scoped></style>
