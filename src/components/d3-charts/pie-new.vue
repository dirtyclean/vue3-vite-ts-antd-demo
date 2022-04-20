<template>
    <div>
        <button class="bg-dark-900 p-10px text-red-500" @click="changeData()">改变数据</button>
        <button class="bg-dark-900 p-10px text-red-500 ml-20px" @click="removeTooltips()">移除all tooltip元素</button>
        <div :ref="el => (svgBoxRef = el)" class="pie-new" v-loading="loading"></div>
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
const loading = ref(false)
let data: Array<dataObj> = []
const svgBoxRef = ref()
let svg
let width: number
let height: number
const getChartData = () => {
    loading.value = true
    return new Promise(resolve => {
        setTimeout(() => {
            data = []
            for (let i = 0; i < ~~(Math.random() * 10); i++) {
                data.push({
                    name: '一共5个字' + i,
                    value: ~~(Math.random() * 100)
                })
            }
            console.log(data, '==data==')
            loading.value = false
            resolve(true)
        }, 1000)
    })
}
const initSVG = () => {
    const svg = d3.select('.pie-new').append('svg').attr('width', '100%').attr('height', '100%')
    return svg
}
const renderChart = () => {
    const config = {
        outerRadius: 120,
        innerRadius: 100,
        textOffsetH: 80,
        animateDuration: 200
    }
    // 创建生成器
    const arcPath = d3.arc().outerRadius(config.outerRadius).innerRadius(config.innerRadius)
    const arcLarger = d3
        .arc()
        .outerRadius(config.outerRadius * 1.1)
        .innerRadius(config.innerRadius)
    // 尺度转换
    const arcAngle = d3
        .pie()
        .sort((d: any) => d.value)
        .value((d: any) => d.value)
    // 尺度转换后的数据
    const arcAngleData: any = arcAngle(data as any)
    console.log(arcAngleData)
    let currHoverArc = data.length ? data[0].name : undefined
    setTimeout(() => {
        const mouseoverEvent = new Event('mouseover')
        const node: any = d3.select(`.arc-${currHoverArc}`).node()
        node && node.dispatchEvent(mouseoverEvent)
    })
    const renderArcs = () => {
        // 定义表示颜色的序数比例尺
        const colors = d3.schemeCategory10
        let arcBox
        if (!svg.select('.arc-box').node()) {
            arcBox = svg
                .append('g')
                .attr('class', 'arc-box')
                .attr('transform', `translate(${width / 2},${height / 2})`)
        } else {
            arcBox = svg.select('.arc-box')
        }
        const arcs = arcBox.selectAll('.arc').data(arcAngleData)
        // 画弧
        const arc = arcs.enter().append('path').attr('stroke', '#fff').attr('stroke-width', '8px')

        arc.merge(arcs)
            .attr('class', d => 'arc arc' + '-' + d.data.name)
            .attr('d', d => {
                return arcPath(d)
            })
            .attr('fill', (d, i) => {
                return colors[i]
            })
            .on('mouseover', function (e, d) {
                const name = d.data.name
                const oldHoverArc = currHoverArc
                if (oldHoverArc) {
                    svg.select('.tooltip' + '-' + oldHoverArc)
                        .transition()
                        .duration(config.animateDuration)
                        .attr('opacity', 0)
                    d3.select('.arc' + '-' + oldHoverArc)
                        .attr('d', () => {
                            const old = arcAngleData.find(({ data: { name } }) => name === oldHoverArc)
                            console.log(old, '===old')
                            return arcPath(old as any)
                        })
                        .transition()
                        .duration(config.animateDuration)
                }
                currHoverArc = name
                svg.select('.tooltip' + '-' + d.data.name)
                    .transition()
                    .duration(config.animateDuration)
                    .attr('opacity', 1)
                d3.select(e.target).attr('d', arcLarger(d)).transition().duration(config.animateDuration)
            })
            .on('mouseleave', function (_e, _d) {})
        arcs
            // 得到没有任何数据关联的图形元素
            .exit()
            // 移除多余的元素
            .remove()
    }
    const renderTooltips = () => {
        const arcLineMiddle = d3
            .arc()
            .outerRadius(config.outerRadius + 50)
            .innerRadius(config.innerRadius + (config.outerRadius - config.innerRadius))
        const getLinePoints = () => {
            return arcAngleData
                .map((d: any) => {
                    const line: Array<Array<number>> = []
                    const tempPoint = arcLineMiddle.centroid(d as any) // arc.centroid({startAngle,endAngle})返回弧的中心点坐标
                    const middleAngle = (d.endAngle + d.startAngle) / 2
                    let tempDx = false
                    if (middleAngle < Math.PI) {
                        tempDx = false
                    } else {
                        tempDx = true
                    }
                    const dx = tempDx ? -config.textOffsetH : config.textOffsetH
                    line.push(arcLarger.centroid(d as any)) // 第一个点
                    line.push(tempPoint) // 第二个点
                    line.push([tempPoint[0] + dx, tempPoint[1]]) // 第三个点
                    line.push(d.data.name)
                    // line得到3个点
                    return line
                })
                .reverse()
        }
        const points = getLinePoints()
        const tooltipData = arcAngleData.map((item: any) => {
            return {
                ...item,
                points: points.find(([_a, _b, _c, name]) => name === item.data.name)
            }
        })
        svg.selectAll('.tooltip').remove()
        const tooltip = svg
            .selectAll('.tooltip')
            .data(tooltipData)
            .enter()
            .append('g')
            .attr('class', d => 'tooltip tooltip' + '-' + d.data.name)
            .attr('opacity', 0)
            .attr('transform', `translate(${width / 2},${height / 2})`)

        const renderLine = () => {
            // 画线
            const generateLine = d3
                .line()
                .x(d => {
                    return d[0]
                })
                .y(d => d[1])

            tooltip
                .append('path')
                .attr('fill', 'none')
                .attr('stroke', '#144AB9')
                .attr('stroke-width', '2')
                .attr('d', d => {
                    return generateLine(d.points)
                })
                .attr('marker-start', `url(#marker-start)`)
                .attr('marker-end', `url(#marker-end)`)
        }
        const renderLineText = () => {
            // 画线上的文字
            tooltip
                .append('text')
                .attr('font-size', '14px')
                .attr('text-anchor', d => {
                    const middleAngle = (d.endAngle + d.startAngle) / 2
                    if (middleAngle < Math.PI) {
                        return 'start'
                    } else if (middleAngle >= Math.PI) {
                        return 'end'
                    }
                })
                .attr('fill', '#000')
                .attr('x', d => arcLineMiddle.centroid(d)[0])
                .attr('y', d => arcLineMiddle.centroid(d)[1])
                .attr('dx', d => {
                    const middleAngle = (d.endAngle + d.startAngle) / 2
                    if (middleAngle < Math.PI) {
                        return 5
                    } else if (middleAngle >= Math.PI) {
                        return -5
                    }
                })
                .attr('dy', '18px')
                .text(d => {
                    return d.data.name
                })
            tooltip
                .append('text')
                .attr('font-size', '14px')
                .attr('text-anchor', d => {
                    const middleAngle = (d.endAngle + d.startAngle) / 2
                    if (middleAngle < Math.PI) {
                        return 'start'
                    } else if (middleAngle >= Math.PI) {
                        return 'end'
                    }
                })
                .attr('fill', '#000')
                .attr('x', d => arcLineMiddle.centroid(d)[0])
                .attr('y', d => arcLineMiddle.centroid(d)[1])
                .attr('dx', d => {
                    const middleAngle = (d.endAngle + d.startAngle) / 2
                    if (middleAngle < Math.PI) {
                        return 5
                    } else if (middleAngle >= Math.PI) {
                        return -5
                    }
                })
                .attr('dy', '-10px')
                .text(d => {
                    const sum = data.reduce((value, currentItem) => {
                        return value + currentItem.value
                    }, 0)
                    const procent = sum ? toFixed((d.data.value / sum) * 100, 1) : 0
                    return procent + '%'
                })
        }
        renderLine()
        renderLineText()
    }
    renderArcs()
    renderTooltips()
}
const renderDefs = () => {
    // 定义marker
    const markerDefs = svg.append('defs')
    // 起始点
    markerDefs
        .append('marker')
        .attr('id', 'marker-start')
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .attr('refX', 5)
        .attr('refY', 5)
        .append('circle')
        .attr('cx', 5)
        .attr('cy', 5)
        .attr('r', 4)
        .attr('stroke', '#144AB9')
        .attr('stroke-width', 2)
        .attr('fill', '#F8FBFF')
    // 结束点
    markerDefs
        .append('marker')
        .attr('id', 'marker-end')
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .attr('refX', 5)
        .attr('refY', 5)
        .append('circle')
        .attr('cx', 5)
        .attr('cy', 5)
        .attr('r', 4)
        .attr('stroke', 'none')
        .attr('fill', '#144AB9')
}
const changeData = async () => {
    console.log('改变数据')
    await getChartData()
    renderChart()
}
const removeTooltips = () => {
    svg.selectAll('.tooltip').remove()
}
onMounted(() => {
    width = svgBoxRef.value.offsetWidth
    height = svgBoxRef.value.offsetHeight
    svg = initSVG()
    renderDefs()
    changeData()
})
</script>
<style lang="scss">
.pie-new {
    width: 600px;
    height: 600px;
    background-color: #fff;
}
</style>
