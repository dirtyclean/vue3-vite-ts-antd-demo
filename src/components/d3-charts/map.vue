<template>
    <div class="w-full h-full flex m-20px">
        <div class="mr-20px ml-10px">
            <vue-slider
                v-if="areaData.length"
                :railStyle="{ background: 'red' }"
                :tooltip-placement="['right']"
                v-model="sliderValue"
                :process="false"
                direction="ttb"
                :style="`display: inline-block; height: ${sliderLineHeight}px`"
                :v-data="areaData"
                :data-value="'areaCode'"
                :data-label="'areaName'"
                @change="sliderChange"
            >
                <template #label="{ active }">
                    <div :class="['vue-slider-mark-label', 'custom-label', { active }]"></div>
                </template>
                <template #step="{ active }">
                    <div :class="['custom-step', { active }]"></div>
                </template>
                <template #tooltip="{ value, focus }">
                    <div :class="['custom-tooltip', { focus }]">
                        {{ (areaData.find(({ areaCode }) => areaCode === value) || {}).areaName }}
                    </div>
                </template>
            </vue-slider>
        </div>
        <div :ref="el => (svgRef = el)" class="map" v-loading="loading"></div>
    </div>
</template>
<script setup lang="ts">
import * as d3 from 'd3'
import { ref, onMounted } from 'vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
console.log(VueSlider, '==VueSlider==')
type dataObj = {
    areaName: string
    areaCode: any
    value: number
}
// interface Test {
//     arr: string[]
// }

// const arr= reactive<Test>({arr:[]})
let width: number
let height: number
let svg
let data: any
const loading = ref(false)
const svgRef = ref()
const sliderValue = ref('510000')
const sliderLineHeight = ref(0)
const areaData = ref<Array<dataObj>>([])
const getAreaData = () => {
    loading.value = true
    return new Promise(resolve => {
        setTimeout(() => {
            const tmpData = [
                {
                    areaName: '四川省',
                    areaCode: '510000',
                    value: ~~(Math.random() * 100)
                }
            ]
            for (let i = 0; i < ~~(Math.random() * 10); i++) {
                tmpData.push({
                    areaName: '市' + i,
                    areaCode: 'code-' + i,
                    value: ~~(Math.random() * 100)
                })
            }
            areaData.value = tmpData
            console.log(areaData.value, '===dataset')
            loading.value = false
            resolve(true)
        }, 200)
    })
}
const initSvg = () => {
    // 创建svg画布
    return d3.select('.map').append('svg').attr('width', '100%').attr('height', '100%')
}
const getMapData = (code = 510000) => {
    return d3.json(`/mapJson/${code}.json`).then((data: any) => {
        /**
         * geojson预处理,主要是颠倒顺序
         * */
        data.features.forEach(n => {
            n.geometry.coordinates.forEach(m => m.forEach(l => l.reverse()))
        })
        return data
    })
}
const renderMap = () => {
    console.log(data)
    const geoPath = d3.geoPath()
    const getScale = () => {
        const [[x0, y0], [x1, y1]] = geoPath.bounds(data)
        const scale = Math.min(100, 1 / Math.max((x1 - x0) / width, (y1 - y0) / height))
        console.log('scale大小:', scale)
        return scale
    }
    const handleData = data.features
    // 定义投影坐标系
    const projection = d3.geoMercator().fitExtent(
        [
            [0, 0],
            [width, height]
        ],
        data
    )
    // 得到path
    const path = geoPath.projection(projection)
    getScale()
    let box
    if (!svg.select('.map-box').node()) {
        box = svg.append('g').attr('class', 'map-box')
    } else {
        box = svg.select('.map-box')
    }
    const map = box.selectAll('path').data(handleData)

    map.enter()
        .append('path')
        .attr('class', d => d.properties.name)
        .merge(map)
        .attr('d', path)
        .attr('fill', '#00B1FF')

    map.exit().remove()
}
const dataChange = async () => {
    data = await getMapData()
    renderMap()
}
const sliderChange = e => {
    console.log(e)
}
onMounted(() => {
    document.title = 'd3-demo'
    width = svgRef.value.offsetWidth
    height = svgRef.value.offsetHeight
    sliderLineHeight.value = height
    svg = initSvg()
    dataChange()
    getAreaData()
})
</script>
<style lang="scss">
.custom-label {
    position: absolute;
    bottom: 100%;
    left: 0;
    transform: translate(-50%, -12px);
    margin-left: 3px;
}
.custom-label::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 5px;
    height: 1px;
    background-color: #000;
}

.custom-label.active {
    color: #2980b9;
    font-weight: bold;
}
.custom-label.active::after {
    background-color: #2980b9;
    width: 2px;
}
.custom-tooltip {
    min-width: 42px;
    width: max-content;
    opacity: 0.8;
    background: #daeaff;
    border-radius: 8px;
    min-width: 42px;
    text-align: center;
    padding: 5px 10px;
}
.map {
    width: 400px;
    height: 500px;
    background-color: white;
}
</style>
