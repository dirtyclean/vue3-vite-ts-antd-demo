<template>
    <div>
        <div :ref="el => (svgRef = el)" class="pie-custom" v-loading="loading"></div>
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
            data = [
                {
                    name: '反馈',
                    value: 1
                },
                {
                    name: '监测',
                    value: 1
                },
                {
                    name: '研判',
                    value: 1
                },
                {
                    name: '调度',
                    value: 1
                },
                {
                    name: '执法',
                    value: 1
                },
                {
                    name: '监管',
                    value: 1
                }
            ]
            loading.value = false
            resolve(true)
        })
    })
}
const initSvg = () => {
    // 创建svg画布
    return d3.select('.pie-custom').append('svg').attr('width', '100%').attr('height', '100%')
}
const renderChart = () => {
    // 定义表示颜色的序数比例尺
    const colors = {
        normal: '#296fff',
        disabled: '#FF9900',
        hover: 'red'
    }
    const renderOutArc = () => {
        const config = {
            outerRadius: 200,
            innerRadius: 140,
            padAngle: 0.1
        }

        // 创建生成器
        const arcPath: any = d3
            .arc()
            .outerRadius(config.outerRadius)
            .innerRadius(config.innerRadius)
            .padAngle(config.padAngle)

        // 尺度转换
        const arcAngle = d3
            .pie()
            .sort((d: any) => d.value)
            .value((d: any) => d.value)
        const arcAngleData = arcAngle(data as any)
        // 创建一个环形图
        const outArc = svg
            .append('g')
            .attr('class', 'arc-ring')
            .attr('transform', `translate(${width / 2},${height / 2})`)
        outArc
            .selectAll('path')
            .data(arcAngleData)
            .enter()
            .append('path')
            .attr('d', d => arcPath(d))
            .attr('fill', colors.normal)
        // 添加文字
        outArc
            .selectAll('text')
            .data(arcAngleData)
            .enter()
            .append('text')
            .attr('font-size', '22px')
            .attr('font-weight', '400')
            .attr('fill', '#fff')
            .attr('text-anchor', 'middle')
            .attr('transform', d => {
                const position = arcPath.centroid(d)
                return `translate(${position[0]},${position[1]})`
            })
            .attr('dy', 10)
            .text(d => d.data.name)
    }
    const renderLineArc = () => {
        const configLine = {
            outerRadius: 115,
            innerRadius: 110
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
            .attr('fill', colors.normal)
        // 创建线弧上的三角形
        const circleData = [
            {
                startAngle: 0,
                endAngle: 0
            },
            {
                startAngle: (Math.PI * 2) / 6,
                endAngle: (Math.PI * 2) / 6
            },
            {
                startAngle: (Math.PI * 2) / 3,
                endAngle: (Math.PI * 2) / 3
            },
            {
                startAngle: (Math.PI * 2) / 2,
                endAngle: (Math.PI * 2) / 2
            },
            {
                startAngle: (2 * (Math.PI * 2)) / 3,
                endAngle: (2 * (Math.PI * 2)) / 3
            },
            {
                startAngle: (5 * (Math.PI * 2)) / 6,
                endAngle: (5 * (Math.PI * 2)) / 6
            }
        ]
        // 法二
        // const circleData = [
        //     {
        //         startAngle: 0,
        //         endAngle: (Math.PI * 2) / 6
        //     },
        //     {
        //         startAngle: (Math.PI * 2) / 6,
        //         endAngle: (Math.PI * 2) / 3
        //     },
        //     {
        //         startAngle: (Math.PI * 2) / 3,
        //         endAngle: (Math.PI * 2) / 2
        //     },
        //     {
        //         startAngle: (Math.PI * 2) / 2,
        //         endAngle: (2 * (Math.PI * 2)) / 3
        //     },
        //     {
        //         startAngle: (2 * (Math.PI * 2)) / 3,
        //         endAngle: (5 * (Math.PI * 2)) / 6
        //     },
        //     {
        //         startAngle: (5 * (Math.PI * 2)) / 6,
        //         endAngle: Math.PI * 2
        //     }
        // ]
        // 符号生成器
        // symbolCircle 圆形
        // symbolCross 十字架
        // symbolDiamond 菱形
        // symbolSquare 正方形
        // symbolStar 五角星
        // symbolTriangle 三角形
        // symbolWye Y形
        const symbolPath = d3.symbol().type(d3.symbolTriangle).size(150)
        // 画小点
        lineArc
            .selectAll('.line-triangle')
            .data(circleData)
            .enter()
            .append('path')
            .attr('class', 'line-triangle')
            .attr('d', symbolPath)
            .attr('fill', '#fff')
            .attr('transform', (d, i) => {
                const position = arcLine.centroid(d)
                return `translate(${position[0]},${position[1]}) rotate(${i * 60 - 30})`
                // 法二
                // return `translate(${position[0]},${position[1]}) rotate(${i % 2 !== 0 ? '60' : 0})`
            })
    }
    const renderInArc = () => {
        // 创建内圆
        const configLine = {
            outerRadius: 85,
            innerRadius: 0
        }
        const arcPath: any = d3.arc().outerRadius(configLine.outerRadius).innerRadius(configLine.innerRadius)
        const inArc = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)
        inArc
            .append('path')
            .attr(
                'd',
                arcPath({
                    startAngle: 0,
                    endAngle: Math.PI * 2
                })
            )
            .attr('fill', colors.normal)
        // 创建中心文字
        inArc
            .append('text')
            .attr('font-size', '22px')
            .attr('font-weight', '400')
            .attr('fill', '#000')
            .attr('text-anchor', 'middle')
            .attr('dy', 10)
            .text('闭环监控')
    }
    renderOutArc()
    renderLineArc()
    renderInArc()
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
.pie-custom {
    width: 500px;
    height: 500px;
    background-color: aquamarine;
}
</style>
