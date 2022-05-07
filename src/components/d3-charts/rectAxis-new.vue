<template>
    <div class="relative">
        <button @click="changeData" class="absolute left-420px right-0">改变数据</button>
        <div :ref="el => (reactAxisRef = el)" class="rectAxis-new" v-loading="loading"></div>
        <div
            class="tooltip"
            :style="{
                left: currHoverItem.left + 'px',
                top: currHoverItem.top + 'px',
                opacity: currHoverItem.opacity
            }"
        >
            <span>{{ currHoverItem.areaName }}</span>
            <br />
            <span>{{ currHoverItem.value }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import * as d3 from 'd3'
import { ref, onMounted } from 'vue'
type dataObj = {
    areaName: string
    areaCode: string
    value: number
}
const defaultHoverItem = {
    areaName: undefined,
    value: undefined,
    left: 0,
    top: 0,
    opacity: 0
}
// reactive 适用于 {a: {a1:'1'}} 大于1层嵌套字段的情况
const currHoverItem = ref({ ...defaultHoverItem })
const loading = ref(false)
const reactAxisRef = ref()
let dataset: Array<dataObj> = []
let svg
let width: number
let height: number
const initSVG = () => {
    return d3.select('.rectAxis-new').append('svg').attr('width', '100%').attr('height', '100%')
}
const getChartData = () => {
    loading.value = true
    return new Promise(resolve => {
        setTimeout(() => {
            dataset = []
            for (let i = 0; i < ~~(Math.random() * 10); i++) {
                dataset.push({
                    areaName: '市' + i,
                    areaCode: 'code-' + i,
                    value: ~~(Math.random() * 100)
                })
            }
            console.log(dataset, '===dataset')
            loading.value = false
            resolve(true)
        }, 2000)
    })
}
const renderChart = () => {
    let xScale, yScale
    // 画布周边的留白
    const padding = {
        left: 30,
        right: 30,
        top: 20,
        bottom: 20,
        rectPadding: 4 // 矩形之间的空白
    }
    const animateDuration = 600
    const renderXAxis = () => {
        // x轴的比例尺
        xScale = d3
            .scaleBand() // 创建一个序数分段比例尺
            .domain(dataset.map(({ areaName }) => areaName))
            .rangeRound([0, width - padding.left - padding.right]) // 设置输出范围并启用四舍五入
        // 定义坐标轴
        const xAxis = d3.axisBottom(xScale)
        console.log(svg.selectAll('g.x-axis').node(), '===')
        if (svg.selectAll('g.x-axis').node()) {
            svg.selectAll('g.x-axis').transition().duration(animateDuration).call(xAxis)
        } else {
            // 添加坐标元素
            svg.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(${padding.left},${height - padding.bottom})`)
                .transition()
                .duration(animateDuration)
                .call(xAxis)
        }
    }
    const renderYAxis = () => {
        // y轴的比例尺
        yScale = d3
            .scaleLinear()
            .domain([0, d3.max(dataset, (d: any) => d.value)])
            .range([height - padding.top - padding.bottom, 0])
        const yAxis = d3.axisLeft(yScale)
        if (svg.selectAll('g.y-axis').node()) {
            svg.selectAll('g.y-axis').transition().duration(animateDuration).call(yAxis)
        } else {
            // 添加坐标元素
            svg.append('g')
                .attr('class', 'y-axis')
                .attr('transform', `translate(${padding.left},${padding.top})`)
                .transition()
                .duration(animateDuration)
                .call(yAxis)
        }
    }
    const renderXGridlines = () => {
        let lines = svg.selectAll('g.x-axis g.tick').select('line.grid-line').remove()
        lines = svg.selectAll('g.x-axis g.tick').append('line').classed('grid-line', true)
        lines
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', -(height - padding.top - padding.bottom))
    }

    const renderYGridlines = () => {
        let lines = svg.selectAll('g.y-axis g.tick').select('line.grid-line').remove()
        lines = svg.selectAll('g.y-axis g.tick').append('line').classed('grid-line', true)
        lines
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', xScale.bandwidth() * dataset.length)
            .attr('y2', 0)
    }
    // 添加矩形和文字元素
    const rectPadding = padding.rectPadding // 矩形之间的空白
    let timer
    const renderRect = () => {
        // ===========rects=============
        const rects = svg.selectAll('.myRect').data(dataset)
        // enter
        const rect = rects
            .enter()
            .append('rect')
            .attr('class', 'myRect')
            .attr('transform', `translate(${padding.left}, ${padding.top})`)
            .attr('fill', 'red')
            .attr('cursor', 'pointer')
            .on('mouseleave', function () {
                currHoverItem.value = { ...defaultHoverItem }
            })
            .on('mousemove', e => {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    const position = d3.pointer(e, svg.node())
                    currHoverItem.value.left = position[0] + 15
                    currHoverItem.value.top = position[1] - 15
                }, 6)
            })
        // update
        rect.merge(rects)
            .on('mouseover', (e, d) => {
                const position = d3.pointer(e, svg.node())
                currHoverItem.value = {
                    ...d,
                    left: position[0],
                    top: position[1],
                    opacity: 0.8
                }
            })
            .attr('x', d => {
                return xScale(d.areaName) + rectPadding / 2
            })
            .attr('width', xScale.bandwidth() - rectPadding)
            .attr('y', yScale(0))
            .attr('height', 0)
            .transition()
            .duration(animateDuration)
            .attr('y', d => {
                return yScale(d.value)
            })
            .attr('height', d => {
                return height - padding.top - padding.bottom - yScale(d.value)
            })

        // exit
        rects
            // 得到没有任何数据关联的图形元素
            .exit()
            // 移除多余的元素
            .remove()
    }

    const renderText = () => {
        // =========texts==============
        const texts = svg.selectAll('.myText').data(dataset)
        // enter
        const text = texts
            .enter()
            .append('text')
            .attr('class', 'myText')
            .attr('transform', `translate(${padding.left}, ${padding.top})`)
            .attr('dy', -10)
            .attr('text-anchor', 'middle')
            .attr('fill', 'blue')
        // update
        text.merge(texts)
            .attr('x', d => {
                return xScale(d.areaName) + rectPadding / 2
            })
            .attr('y', d => {
                return yScale(d.value)
            })
            .attr('dx', (xScale.bandwidth() - rectPadding) / 2)
            .text(d => d.value)
        // exit
        texts
            // 得到没有任何数据关联的图形元素
            .exit()
            // 移除多余的元素
            .remove()
    }
    renderXAxis()
    renderYAxis()
    renderXGridlines()
    renderYGridlines()
    renderRect()
    renderText()
}
const changeData = async () => {
    await getChartData()
    renderChart()
}
onMounted(() => {
    width = reactAxisRef.value.offsetWidth
    height = reactAxisRef.value.offsetHeight
    svg = initSVG()
    changeData()
})
</script>
<style lang="scss">
.tooltip {
    padding: 10px;
    min-width: 200px;
    background-color: #00b1ff;
    border-radius: 8px;
    position: absolute;
    z-index: 10;
}
.rectAxis-new {
    width: 400px;
    height: 400px;
    background-color: aquamarine;
}
.grid-line {
    stroke: green;
}
</style>
