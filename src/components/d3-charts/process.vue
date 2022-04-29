<template>
    <div>
        <button @click="dataChange" class="absolute left-420px right-0">改变数据</button>
        <div :ref="el => (svgRef = el)" class="process" v-loading="loading"></div>
        <!-- 添加阴影 -->
        <svg width="0" height="0" viewBox="0 0 0 0">
            <defs>
                <filter id="drop-shadow" height="130%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur"></feGaussianBlur>
                    <feOffset in="blur" dx="0" dy="0" result="offsetBlur"></feOffset>
                    <feMerge>
                        <feMergeNode in="offsetBlur"></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                    </feMerge>
                </filter>
            </defs>
        </svg>
    </div>
</template>
<script setup lang="ts">
import * as d3 from 'd3'
import { toFixed } from '@/utils/methods'
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
            const value = ~~(Math.random() * 100)
            data = [
                {
                    name: '衣服',
                    value
                },
                {
                    name: '其他',
                    value: 100 - value
                }
            ]
            loading.value = false
            resolve(true)
        })
    })
}
const initSvg = () => {
    // 创建svg画布
    return d3.select('.process').append('svg').attr('width', '100%').attr('height', '100%')
}
const renderChart = () => {
    svg.selectAll('path').remove()
    svg.selectAll('text').remove()
    const config = {
        outerRadius: 120,
        innerRadius: 100
    }
    // 创建生成器 cornerRadius圆弧圆角
    const arcPath: any = d3.arc().outerRadius(config.outerRadius).innerRadius(config.innerRadius).cornerRadius(15)
    // 定义表示颜色的序数比例尺
    const colors = {
        wholeArc: '#FFE5BE',
        valueArc: '#FF9900'
    }
    // 创建一个满圆弧
    svg.append('path')
        .attr('class', 'wholeArc')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .attr(
            'd',
            arcPath({
                startAngle: 0,
                endAngle: 2 * Math.PI
            })
        )
        .attr('fill', colors.wholeArc)
    // 尺度转换
    const arcAngle = d3
        .pie()
        .sort((d: any) => d.value)
        .value((d: any) => d.value)
    const arcAngleData = arcAngle(data as any)
    // 创建有值的圆弧
    svg.append('path')
        .attr('class', 'valueArc')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .attr(
            'd',
            arcPath({
                startAngle: arcAngleData[0].startAngle,
                endAngle: arcAngleData[1].startAngle
            })
        )
        .attr('fill', colors.valueArc)
        .style('filter', 'url(#drop-shadow)')
    // 创建有值圆弧上的小点
    const circleData = [
        {
            startAngle: arcAngleData[0].startAngle,
            endAngle: arcAngleData[0].startAngle + 0.2
        },
        {
            startAngle: arcAngleData[0].endAngle,
            endAngle: arcAngleData[0].endAngle - 0.2
        }
    ]
    // 符号生成器
    const symbolPath = d3.symbol().type(d3.symbolCircle).size(150)
    // 画小点
    svg.selectAll('.valueArc-circle')
        .data(circleData)
        .enter()
        .append('path')
        .attr('class', 'valueArc-circle')
        .attr('d', symbolPath)
        .attr('fill', '#fff')
        .attr('transform', d => {
            const position = arcPath.centroid(d)
            return `translate(${width / 2 + position[0]},${height / 2 + position[1]})`
        })
    // 创建中心文字
    const valueText = svg
        .append('text')
        .attr('font-size', '36px')
        .attr('font-weight', '700')
        .attr('fill', colors.valueArc)
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .attr('dy', 10)
        .text(toFixed((data[0].value / (data[0].value + data[1].value)) * 100, 1))
    svg.append('text')
        .attr('font-size', '30px')
        .attr('fill', colors.valueArc)
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .attr('dx', () => {
            console.log(valueText.node())
            console.log(valueText, '===valueText====', valueText.node().getBoundingClientRect().width)
            return valueText.node().getBoundingClientRect().width / 2 + 12
        })
        .attr('dy', 10)
        .text('%')
    // 通过手动添加阴影
    // const defs = svg.append('defs')
    // const filter = defs.append('filter').attr('id', 'drop-shadow').attr('height', '130%')
    // filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', 5).attr('result', 'blur')
    // filter.append('feOffset').attr('in', 'blur').attr('dx', 0).attr('dy', 0).attr('result', 'offsetBlur')
    // // 阴影颜色
    // // filter
    // //     .append('feColorMatrix')
    // //     .attr('values', '0 0 0 0 0.905391036   0 0 0 0 0.922492197   0 0 0 0 0.949671649  0 0 0 1 0')
    // //     .attr('type', 'matrix')
    // //     .attr('in', 'blur')
    // //     .attr('result', 'offsetBlur')
    // const feMerge = filter.append('feMerge')
    // feMerge.append('feMergeNode').attr('in', 'offsetBlur')
    // feMerge.append('feMergeNode').attr('in', 'SourceGraphic')
}

onMounted(() => {
    width = svgRef.value.offsetWidth
    height = svgRef.value.offsetHeight
    console.log(svgRef)
    svg = initSvg()
    dataChange()
})
</script>
<style lang="scss">
.process {
    width: 500px;
    height: 500px;
    background-color: aquamarine;
}
</style>
