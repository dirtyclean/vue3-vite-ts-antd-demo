<template>123</template>
<script lang="ts" setup>
import * as d3 from 'd3'
const height = 500
const width = 500
const margin = 100
const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'border:1px solid red')
    .attr('class', 'axis')
function renderXAxis() {
    const axisLength = width - 2 * margin
    const xScale = d3.scaleLinear().domain([0, 400]).range([0, axisLength])
    const xAxis = d3.axisBottom(xScale)
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', () => {
            return `translate(${margin},${height - margin})`
        })
        .call(xAxis)
    // 绘制网格线
    d3.selectAll('g.x-axis g.tick')
        .append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', -(height - 2 * margin))
}
function renderYAxis() {
    const axisLength = width - 2 * margin
    const yScale = d3.scaleLinear().domain([400, 0]).range([0, axisLength])
    const yAxis = d3.axisLeft(yScale)
    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', () => {
            return `translate(${margin},${margin})`
        })
        .call(yAxis)
    // 绘制网格线
    d3.selectAll('g.y-axis g.tick')
        .append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', axisLength)
        .attr('y2', 0)
}
renderXAxis()
renderYAxis()
</script>
<style lang="scss">
.grid-line {
    stroke: green;
}
</style>
