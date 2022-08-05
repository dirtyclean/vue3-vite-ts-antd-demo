<template>
    <div>
        <div :ref="el => (svgRef = el)" class="pie-new1" v-loading="loading"></div>
        <svg width="16px" height="16px" viewBox="0 0 16 16">
            <defs>
                <g id="marker-icon-red">
                    <path
                        d="M22.1628914,16.5 L15.4960882,28.8812059 C15.5438791,29.6080861 15.1498558,30.2552489 14.5284271,30.7213203 C13.8813462,31.206631 12.9857964,31.5 12,31.5 C11.0142036,31.5 10.1186538,31.206631 9.47157288,30.7213203 C8.85014424,30.2552489 8.45612085,29.6080861 8.50391175,28.8812059 L8.50391175,28.8812059 L1.83710858,16.5 L22.1628914,16.5 Z"
                        fill="red"
                        stroke="red"
                        stroke-width="1"
                    />
                    <circle stroke="red" stroke-width="1" fill="red" cx="12" cy="12" r="11.5" />
                </g>
                <g id="marker-icon-orange">
                    <path
                        d="M22.1628914,16.5 L15.4960882,28.8812059 C15.5438791,29.6080861 15.1498558,30.2552489 14.5284271,30.7213203 C13.8813462,31.206631 12.9857964,31.5 12,31.5 C11.0142036,31.5 10.1186538,31.206631 9.47157288,30.7213203 C8.85014424,30.2552489 8.45612085,29.6080861 8.50391175,28.8812059 L8.50391175,28.8812059 L1.83710858,16.5 L22.1628914,16.5 Z"
                        fill="orange"
                        stroke="orange"
                        stroke-width="1"
                    />
                    <circle stroke="orange" stroke-width="1" fill="orange" cx="12" cy="12" r="11.5" />
                </g>
                <g id="marker-icon-yellow">
                    <path
                        d="M22.1628914,16.5 L15.4960882,28.8812059 C15.5438791,29.6080861 15.1498558,30.2552489 14.5284271,30.7213203 C13.8813462,31.206631 12.9857964,31.5 12,31.5 C11.0142036,31.5 10.1186538,31.206631 9.47157288,30.7213203 C8.85014424,30.2552489 8.45612085,29.6080861 8.50391175,28.8812059 L8.50391175,28.8812059 L1.83710858,16.5 L22.1628914,16.5 Z"
                        fill="yellow"
                        stroke="yellow"
                        stroke-width="1"
                    />
                    <circle stroke="yellow" stroke-width="1" fill="yellow" cx="12" cy="12" r="11.5" />
                </g>
                <g id="marker-icon-blue">
                    <path
                        d="M22.1628914,16.5 L15.4960882,28.8812059 C15.5438791,29.6080861 15.1498558,30.2552489 14.5284271,30.7213203 C13.8813462,31.206631 12.9857964,31.5 12,31.5 C11.0142036,31.5 10.1186538,31.206631 9.47157288,30.7213203 C8.85014424,30.2552489 8.45612085,29.6080861 8.50391175,28.8812059 L8.50391175,28.8812059 L1.83710858,16.5 L22.1628914,16.5 Z"
                        fill="blue"
                        stroke="blue"
                        stroke-width="1"
                    />
                    <circle stroke="blue" stroke-width="1" fill="blue" cx="12" cy="12" r="11.5" />
                </g>
            </defs>
        </svg>
    </div>
</template>
<script setup lang="ts">
import * as d3 from 'd3'
import { ref, onMounted } from 'vue'
type dataObj = {
    name: string
    value: number
    fraction?
    formatValue?
}
let width: number
let height: number
let svg
let data: Array<dataObj> = []
let formatData: Array<dataObj> = []
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
            data = [
                { name: 'red', value: ~~(Math.random() * 100) },
                { name: 'orange', value: ~~(Math.random() * 100) },
                { name: 'yellow', value: ~~(Math.random() * 100) },
                { name: 'blue', value: ~~(Math.random() * 100) }
            ]
            const sum = data.reduce((sum, { value }) => {
                return sum + value
            }, 0)
            // 从小到大排列 四舍五入, 多一个就多一个
            data = data
                .map(({ name, value }) => {
                    return {
                        name,
                        value,
                        fraction: (40 * value) / sum,
                        formatValue: ((40 * value) / sum).toFixed(0)
                    }
                })
                .sort((a: any, b: any) => a.format - b.format)
            formatData = []
            data.forEach(({ name, formatValue }) => {
                for (let i = 0; i < formatValue; i++) {
                    formatData.push({
                        name,
                        value: 1
                    })
                }
            })
            console.log(formatData, '===formatData====')
            loading.value = false
            resolve(true)
        })
    })
}
const initSvg = () => {
    // 创建svg画布
    return d3.select('.pie-new1').append('svg').attr('width', '100%').attr('height', '100%')
}
const renderChart = () => {
    // 定义表示颜色的序数比例尺
    const colors = d3.schemeCategory10
    console.log(d3.schemeCategory10, '===d3.schemeCategory10===')
    const renderLineArc = () => {
        const configLine = {
            outerRadius: 220,
            innerRadius: 210
        }
        const arcLine: any = d3.arc().outerRadius(configLine.outerRadius).innerRadius(configLine.innerRadius)
        // 创建线弧
        const lineArc = svg
            .append('g')
            .attr('class', 'arc-line')
            .attr('transform', `translate(${width / 2},${height / 2})`)
        lineArc
            .append('path')

            .attr(
                'd',
                arcLine({
                    startAngle: 0,
                    endAngle: Math.PI * 2
                })
            )
            .attr('fill', colors[0])
        // 创建线弧上的三角形
        const circleData: any = []

        formatData.forEach((item, index) => {
            circleData.push({
                startAngle: ((Math.PI * 2) / formatData.length) * index,
                endAngle: ((Math.PI * 2) / formatData.length) * (index + 1),
                color: item.name
            })
        })
        // 符号生成器
        // symbolCircle 圆形
        // symbolCross 十字架
        // symbolDiamond 菱形
        // symbolSquare 正方形
        // symbolStar 五角星
        // symbolTriangle 三角形
        // symbolWye Y形
        const symbolPath = d3.symbol().type(d3.symbolTriangle).size(100)
        console.log(symbolPath, '===symbolPath====')
        // 画小点
        // lineArc
        //     .selectAll('.line-triangle')
        //     .data(circleData)
        //     .enter()
        //     .append('path')
        //     .attr('class', 'line-triangle')
        //     .attr('d', symbolPath)
        //     .attr('fill', d => d.color)
        //     .attr('transform', (d, i) => {
        //         const position = arcLine.centroid(d)
        //         return `translate(${position[0]},${position[1]}) rotate(${i % 2 !== 0 ? 360 / 40 : 0})`
        //     })

        lineArc
            .selectAll('.line-triangle')
            .data(circleData)
            .enter()
            .append('g')
            .attr('class', 'line-triangle')
            .attr('transform', (d, i) => {
                const position = arcLine.centroid(d)
                return `translate(${position[0]},${position[1]}) rotate(${(360 / 40) * i})`
            })
            .append('use')
            .attr('xlink:href', d => '#marker-icon-' + d.color)
    }
    renderLineArc()
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
.pie-new1 {
    width: 500px;
    height: 500px;
    background-color: aquamarine;
}
</style>
