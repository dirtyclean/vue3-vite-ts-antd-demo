<template>123</template>
<script lang="ts" setup>
import * as d3 from 'd3'
const width = 400
const height = 400
const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'border: 1px solid pink;margin: 100px')
// 画布周边的留白
const padding = {
    left: 30,
    right: 30,
    top: 20,
    bottom: 20
}
const dataset = [1, 2, 56, 609, 66, 33, 24, 12]
// x轴的比例尺
const xScale = d3
    .scaleBand() // 创建一个序数分段比例尺
    .domain(d3.range(dataset.length)) // d3.range 返回一个等差数列数组
    .rangeRound([0, width - padding.left - padding.right]) // 设置输出范围并启用四舍五入
// y轴的比例尺
const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([height - padding.top - padding.bottom, 0])
// 定义坐标轴
const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisLeft(yScale)
// 添加坐标元素
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding.left},${height - padding.bottom})`)
    .call(xAxis)
svg.append('g').attr('class', 'axis').attr('transform', `translate(${padding.left},${padding.top})`).call(yAxis)
// 添加矩形和文字元素
const rectPadding = 4 // 矩形之间的空白
// rects
svg.selectAll('.myRect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'myRect')
    .attr('transform', `translate(${padding.left}, ${padding.top})`)
    .attr('x', (d, i) => {
        return xScale(i) + rectPadding / 2
    })
    .attr('y', d => {
        return yScale(d)
    })
    .attr('width', xScale.bandwidth() - rectPadding)
    .attr('height', d => {
        return height - padding.top - padding.bottom - yScale(d)
    })
    .attr('fill', 'red')
// texts
svg.selectAll('.myText')
    .data(dataset)
    .enter()
    .append('text')
    .attr('class', 'myText')
    .attr('transform', `translate(${padding.left}, ${padding.top})`)
    .attr('x', (d, i) => {
        return xScale(i) + rectPadding / 2
    })
    .attr('y', d => {
        return yScale(d)
    })
    .attr('dx', (xScale.bandwidth() - rectPadding) / 2)
    .attr('dy', -10)
    .attr('text-anchor', 'middle')
    .text(d => d)
    .attr('fill', 'blue')
</script>
