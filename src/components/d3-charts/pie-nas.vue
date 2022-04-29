<template>
    <div>
        <button @click="dataChange" class="absolute left-420px right-0">改变数据</button>
        <div :ref="el => (svgRef = el)" class="pie-nas" v-loading="loading"></div>
    </div>
</template>
<script setup lang="ts">
import * as d3 from 'd3'
import { ref, onMounted } from 'vue'
type dataObj = {
    name: string
    value: number
}
let width: number
let height: number
let svg
let data: Array<dataObj> = []
const loading = ref(false)
const svgRef = ref()
const dataChange = async () => {
    await getChartData()
    renderChart()
}
const getChartData = () => {
    return new Promise(resolve => {
        loading.value = true
        setTimeout(() => {
            data = []
            for (let i = 0; i < ~~(Math.random() * 10); i++) {
                data.push({
                    name: '第' + i + '块',
                    value: ~~(Math.random() * 100)
                })
            }
            console.log(data, '==data==')
            loading.value = false
            resolve(true)
        })
    })
}
const initSvg = () => {
    // 创建svg画布
    return d3.select('.pie-nas').append('svg').attr('width', '100%').attr('height', '100%')
}
const renderChart = () => {
    const config = {
        outerRadius: 120,
        innerRadius: 0
    }
    // 创建生成器
    const arcPath: any = d3.arc().outerRadius(config.outerRadius).innerRadius(config.innerRadius)
    // 定义表示颜色的序数比例尺
    const colors = d3.schemeCategory10
    // 尺度转换
    const arcAngle = d3
        .pie()
        .sort((d: any) => d.value)
        .value((d: any) => d.value)
    const arcAngleData = arcAngle(data as any)
    let arcBox
    if (!svg.select('.arc-nas-box').node()) {
        arcBox = svg
            .append('g')
            .attr('class', 'arc-nas-box')
            .attr('transform', `translate(${width / 2},${height / 2})`)
    } else {
        arcBox = svg.select('.arc-nas-box')
    }
    const arcs = arcBox.selectAll('.arc-nas').data(arcAngleData)
    const arc = arcs.enter().append('path').attr('class', 'arc-nas').attr('stroke', '#fff').attr('stroke-width', 6)
    arc.merge(arcs)
        .attr('d', d => arcPath(d))
        .attr('fill', (d, i) => colors[i])
    arcs.exit().remove()
}

onMounted(() => {
    width = svgRef.value.offsetWidth
    height = svgRef.value.offsetHeight
    svg = initSvg()
    dataChange()
})
</script>
<style lang="scss">
.pie-nas {
    width: 500px;
    height: 500px;
    background-color: white;
}
</style>
