<template>123</template>
<script setup lang="ts">
import * as d3 from 'd3'
const dataset = [
    {
        county: 'china',
        gdp: [
            {
                year: 2000,
                value: 11920
            },
            {
                year: 2001,
                value: 1192
            },
            {
                year: 2002,
                value: 16920
            },
            {
                year: 2003,
                value: 0
            },
            {
                year: 2004,
                value: 789
            }
        ]
    },
    {
        county: 'j',
        gdp: [
            {
                year: 2000,
                value: 1920
            },
            {
                year: 2001,
                value: 192
            },
            {
                year: 2002,
                value: 17920
            },
            {
                year: 2003,
                value: 10000
            },
            {
                year: 2004,
                value: 789
            }
        ]
    }
]
const width = 600
const height = 600
// 创建svg画布
const svg = d3.select('body').append('svg').attr('width', width).attr('height', height)
// 外边框
const padding = {
    top: 50,
    right: 50,
    left: 50,
    bottom: 50
}
// 计算gdp最大值
let gdpMax = 0
dataset.forEach(item => {
    item.gdp.forEach(({ value }) => {
        if (value > gdpMax) {
            gdpMax = value
        }
    })
})
// 定义比例尺
const xScale = d3
    .scaleLinear()
    .domain([2000, 2004])
    .range([0, width - padding.left - padding.right])
const yScale = d3
    .scaleLinear()
    .domain([0, gdpMax])
    .range([height - padding.top - padding.bottom, 0])
// 创建线段生成器
const linePath = d3
    .line()
    .x((d: any) => {
        return xScale(d.year)
    })
    .y((d: any) => {
        return yScale(d.value)
    })
    .curve(d3.curveBasis)
// 定义两个颜色
const colors: any = [d3.rgb(0, 0, 255), d3.rgb(0, 255, 0)]
svg.selectAll('path')
    .data(dataset)
    .enter()
    .append('path')
    .attr('transform', `translate(${padding.left},${padding.top})`)
    .attr('d', d => {
        return linePath(d.gdp as any)
    })
    .attr('fill', 'none')
    .attr('stroke', (_d, i) => {
        return colors[i]
    })
    .attr('stroke-width', '3px')
// 创建坐标轴
const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format('d'))
const yAxis = d3.axisLeft(yScale)
// 添加坐标轴
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding.left},${height - padding.bottom})`)
    .call(xAxis)
svg.append('g').attr('class', 'axis').attr('transform', `translate(${padding.left},${padding.top})`).call(yAxis)
// 添加矩形
svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('width', 20)
    .attr('height', 15)
    .attr('fill', (_d, i) => colors[i])
    .attr('x', (_d, i) => padding.left + 80 * i)
    .attr('y', height - padding.bottom)
    .attr('transform', 'translate(20,30)')
// 添加文字
svg.selectAll('.text')
    .data(dataset)
    .enter()
    .append('text')
    .attr('class', 'text')
    .attr('font-size', '14px')
    .attr('text-anchor', 'middle')
    .attr('fill', '#000')
    .attr('x', (_d, i) => padding.left + 80 * i)
    .attr('y', height - padding.bottom)
    .attr('dx', '40px')
    .attr('dy', '0.9em')
    .attr('transform', 'translate(20,30)')
    .text(d => {
        return d.county
    })
</script>
<style lang="scss"></style>
