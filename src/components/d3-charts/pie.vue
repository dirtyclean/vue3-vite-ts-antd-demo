<template>
    <div>
        <button @click="dataChange" class="absolute left-420px right-0">改变数据</button>
        <div :ref="el => (svgRef = el)" class="pie" v-loading="loading"></div>
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
    return d3.select('.pie').append('svg').attr('width', '100%').attr('height', '100%')
}
const renderChart = () => {
    const config = {
        outerRadius: 120,
        innerRadius: 0,
        padAngle: 0,
        animateDuration: 200
    }
    // 创建生成器
    const arcPath: any = d3
        .arc()
        .outerRadius(config.outerRadius)
        .padAngle(config.padAngle)
        .innerRadius(config.innerRadius)
    const arcPathBig: any = d3
        .arc()
        .outerRadius(config.outerRadius + 10)
        .padAngle(config.padAngle)
        .innerRadius(config.innerRadius)
    // 定义表示颜色的序数比例尺
    const colors = d3.schemeCategory10
    // 尺度转换
    const arcAngle = d3
        .pie()
        .sort((d: any) => d.value)
        .value((d: any) => d.value)
    const arcAngleData = arcAngle(data as any)
    let arcBox
    if (!svg.select('.arc-pie-box').node()) {
        arcBox = svg
            .append('g')
            .attr('class', 'arc-pie-box')
            .attr('transform', `translate(${width / 2},${height / 2})`)
    } else {
        arcBox = svg.select('.arc-pie-box')
    }
    const arcs = arcBox.selectAll('.arc-pie').data(arcAngleData)
    const arc = arcs
        .enter()
        .append('path')
        .attr('class', d => `arc-pie arc-pie-${d.data.name}`)
        .on('mouseover', (e, d) => {
            console.log('移入', d)
            d3.select(e.target)
                .attr('d', arcPathBig(d))
                .attr('stroke', '#fff')
                .attr('stroke-width', 6)
                .transition()
                .duration(config.animateDuration)
        })
        .on('mouseleave', (e, d) => {
            d3.select(e.target)
                .attr('d', arcPath(d))
                .attr('stroke', null)
                .attr('stroke-width', null)
                .transition()
                .duration(config.animateDuration)
        })
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
.pie {
    width: 500px;
    height: 500px;
    background-color: white;
}
</style>
