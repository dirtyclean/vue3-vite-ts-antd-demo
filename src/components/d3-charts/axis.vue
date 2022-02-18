<template>123</template>
<script setup lang="ts">
import * as d3 from 'd3'
const width = 600
const height = 600
// 创建svg画布
const svg = d3.select('body').append('svg').attr('width', width).attr('height', height)
// 定义用于坐标轴的线性比例尺
const xScale = d3.scaleLinear().domain([0, 10]).range([0, 300])
// 定义坐标轴 刻度方向朝下
const axis = d3.axisBottom(xScale)
// 在svg中添加一个包含坐标轴各元素的g元素
const gAxis = svg.append('g').attr('transform', 'translate(80,80)').attr('class', 'axis')
// 在gAxis中绘制坐标轴
gAxis.call(axis)
</script>
