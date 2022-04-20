<template>
    <div id="ac-home-doughnut"></div>
</template>

<script>
import Chart from './chart.js'
import * as d3 from 'd3'
export default {
    data() {
        return {
            id: 'ac-home-doughnut',
            oldIndex: null,
            data: [
                // { label: '高处作业', value: 12 },
                { label: '动火作业', value: 20 },
                { label: '盲板抽堵', value: 20 },
                { label: '吊装作业', value: 20 }
                // { label: '断路作业', value: 20 },
                // { label: '装卸车作业', value: 20 },
                // { label: '用电作业', value: 20 },
                // { label: '动土作业', value: 20 },
                // { label: '检测维修', value: 20 },
                // { label: '受限空间', value: 20 }
            ],
            totalCount: '',
            cycleName: ''
        }
    },
    created() {},
    mounted() {
        setTimeout(() => {
            this.initMap(this.data)
        }, 1000)
    },
    methods: {
        initMap(data) {
            const self = this
            const me = self
            /* ----------------------------配置参数------------------------  */
            const chart = new Chart()
            const box = d3.select('#' + this.id)
            const { offsetWidth, offsetHeight } = box.node()
            const config = {
                margins: { top: 30, left: 0, bottom: 20, right: 0 },
                textColor: '#296FFF',
                textColorBlack: '#243144',
                hoverColor: '#296FFF',
                doughnutColor: '#A7C4FF',
                title: me.cycleName,
                innerRadius: 100,
                outerRadius: 120,
                textOffsetH: 80,
                lineColor: 'black',
                animateDuration: 1000,
                totalCount: me.totalCount
            }

            chart.box(box)
            chart.margins(config.margins)

            chart.setId(this.id)
            chart.width(offsetWidth)
            chart.height(offsetHeight)

            /* ----------------------------尺度转换------------------------  */
            chart.arcAngle = d3
                .pie()
                .sort((d, i) => i)
                .value(d => d.value)

            /* ----------------------------渲染扇形------------------------  */
            chart.renderSlices = function () {
                const slices = chart
                    .body()
                    .append('g')
                    .classed('pie', true)
                    .attr('transform', 'translate(' + chart.getBodyWidth() / 2 + ',' + chart.getBodyHeight() / 2 + ')')
                    .selectAll('.arc')
                    .data(chart.arcAngle(data))

                slices
                    .enter()
                    .append('path')
                    .attr('class', (d, i) => 'arc arc-' + i)
                    .merge(slices)
                    .attr('stroke', 'none')
                    .attr('fill', config.doughnutColor)
                    .transition()
                    .duration(config.animateDuration)
                    .attrTween('d', arcTween)

                slices.exit().remove()

                const arc = d3.arc().outerRadius(config.outerRadius).innerRadius(config.innerRadius)

                function arcTween(d) {
                    d.startAngle = d.startAngle + 0.05
                    d.endAngle = d.endAngle - 0.05
                    let currentArc = this._current

                    if (!currentArc) {
                        currentArc = { startAngle: 0, endAngle: 0 }
                    }

                    const interpolate = d3.interpolate(currentArc, d)
                    this._current = interpolate(1) // 当饼图更新时，从当前角度过渡到新角度

                    return function (t) {
                        return arc(interpolate(t))
                    }
                }
            }

            /* ----------------------------渲染文本标签和线条------------------------  */
            chart.renderText = function () {
                // ----渲染文本标签-------
                const arc = d3
                    .arc()
                    .outerRadius(config.outerRadius + 50)
                    .innerRadius(config.innerRadius + (config.outerRadius - config.innerRadius))

                // const scaleTextDx = d3
                //   .scaleLinear()
                //   .domain([0, Math.PI / 2])
                //   .range([0, config.textOffsetH])

                const labels = d3
                    .select('.pie')
                    .append('g')
                    .attr('class', 'label-group')
                    .selectAll('.label')
                    .data(chart.arcAngle(data))

                const labelBox = labels.enter().append('g').classed('label', true).attr('opacity', 0)

                labelBox
                    .append('text')
                    .merge(labels)
                    .attr('style', 'font-size:24px')
                    .attr('stroke', config.textColor)
                    .attr('fill', config.textColor)
                    .attr('text-anchor', d => {
                        return (d.endAngle + d.startAngle) / 2 > Math.PI ? 'end' : 'start'
                    })
                    .attr('dy', -10)
                    .attr('dx', d => {
                        const middleAngle = (d.endAngle + d.startAngle) / 2
                        if (middleAngle < (3 * Math.PI) / 5) {
                            return 20
                        } else if (middleAngle > (3 * Math.PI) / 5 && middleAngle < Math.PI) {
                            return 30
                        } else if (middleAngle > Math.PI) {
                            return -20
                        }
                    })
                    .transition()
                    .duration(0)
                    .delay(config.animateDuration)
                    .attr('transform', d => {
                        return 'translate(' + arc.centroid(d) + ')'
                    })
                    .text(d => d.data.taskPercent)

                // 类别
                labelBox
                    .append('text')
                    .merge(labels)
                    .attr('style', 'font-size:12px')
                    .attr('stroke', config.textColorBlack)
                    .attr('fill', config.textColor)
                    .attr('text-anchor', d => {
                        return (d.endAngle + d.startAngle) / 2 > Math.PI ? 'end' : 'start'
                    })
                    .attr('dy', 20)
                    .attr('dx', d => {
                        const middleAngle = (d.endAngle + d.startAngle) / 2
                        if (middleAngle < (3 * Math.PI) / 5) {
                            return 20
                        } else if (middleAngle > (3 * Math.PI) / 5 && middleAngle < Math.PI) {
                            return 30
                        } else if (middleAngle > Math.PI) {
                            return -20
                        }
                    })
                    .transition()
                    .duration(0)
                    .delay(config.animateDuration)
                    .attr('transform', d => {
                        return 'translate(' + arc.centroid(d) + ')'
                    })
                    .text(d => d.data.label)

                labels.exit().remove()

                // ----渲染标签连线------

                // 定义marker
                const markerDefs = chart.getSvg().append('defs')

                // 起始点
                markerDefs
                    .append('marker')
                    .attr('id', me.id + 'marker-start')
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
                    .attr('id', me.id + 'marker-end')
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

                const arc1 = d3.arc().outerRadius(config.outerRadius).innerRadius(config.innerRadius)

                const points = getLinePoints()

                const generateLine = d3
                    .line()
                    .x(d => d[0])
                    .y(d => d[1])

                const lines = d3.select('.pie').append('g').attr('class', 'line-group').selectAll('.line').data(points)

                lines
                    .enter()
                    .insert('path', ':first-child')
                    .classed('line', true)
                    .merge(lines)
                    .attr('opacity', 0)
                    .transition()
                    .duration(0)
                    .delay(config.animateDuration)
                    .attr('fill', 'none')
                    .attr('stroke', '#144AB9')
                    .attr('stroke-width', '2')
                    .attr('d', generateLine)
                    .attr('marker-start', `url(#${me.id}marker-start)`)
                    .attr('marker-end', `url(#${me.id}marker-end)`)

                lines.exit().remove()

                function getLinePoints() {
                    console.log(chart.arcAngle(data), '===arcAngle(data)===')
                    return chart
                        .arcAngle(data)
                        .map(d => {
                            const line = []
                            const tempPoint = arc.centroid(d)
                            const middleAngle = (d.endAngle + d.startAngle) / 2
                            let tempDx = ''
                            if (middleAngle < Math.PI) {
                                tempDx = false
                            } else {
                                tempDx = true
                            }
                            const dx = tempDx > 0 ? -config.textOffsetH : config.textOffsetH
                            line.push(arc1.centroid(d))
                            line.push(tempPoint)
                            line.push([tempPoint[0] + dx, tempPoint[1]])
                            console.log(tempPoint, line)
                            return line
                        })
                        .reverse()
                }
            }

            /* ----------------------------渲染图标题------------------------  */
            chart.renderTitle = function () {
                chart
                    .svg()
                    .append('text')
                    .classed('title', true)
                    .attr('x', chart.width() / 2)
                    .attr('y', chart.height() / 2)
                    .attr('dy', 40)
                    .text(config.title)
                    .attr('fill', config.textColorBlack)
                    .attr('text-anchor', 'middle')
                    .attr('stroke', config.textColorBlack)

                chart
                    .svg()
                    .append('text')
                    .classed('title', true)
                    .attr('x', chart.width() / 2)
                    .attr('y', chart.height() / 2)
                    .attr('dy', 0)
                    .attr('style', 'font-size:44')
                    .text(config.totalCount)
                    .attr('fill', config.textColorBlack)
                    .attr('text-anchor', 'middle')
                    .attr('stroke', config.textColorBlack)
            }

            /* ----------------------------绑定鼠标交互事件------------------------  */
            chart.addMouseOn = function () {
                setTimeout(() => {
                    const mouseoverEvent = new Event('mouseover')
                    let node = d3.select(`.arc-${me.data.length - 2}`).node()
                    node.dispatchEvent(mouseoverEvent)
                    node = null
                    me.oldIndex = me.data.length - 1
                }, 1000)

                const arcLarger = d3
                    .arc()
                    .outerRadius(config.outerRadius * 1.02)
                    .innerRadius(config.innerRadius * 0.98)

                const arcNormal = d3.arc().outerRadius(config.outerRadius).innerRadius(config.innerRadius)

                d3.selectAll('.arc').on('mouseover', function (d, i) {
                    console.log(i)
                    i = i.index
                    console.log(me.oldIndex && d3.select(`.arc-${me.oldIndex - 1}`), me.oldIndex)
                    if (me.oldIndex) {
                        console.log('me.oldIndex')
                        const tempD = chart.arcAngle(data)[me.oldIndex - 1]
                        tempD.startAngle += 0.05
                        tempD.endAngle -= 0.05
                        d3.select(`.arc-${me.oldIndex - 1}`)
                            .attr('d', arcNormal(tempD))
                            .transition()
                            .duration(config.animateDuration / 2)
                            .attr('fill', config.doughnutColor)

                        d3.select(`.label-group .label:nth-child(${me.oldIndex})`)
                            .transition()
                            .duration(config.animateDuration / 4)
                            .attr('opacity', 0)

                        d3.select(`.line-group path:nth-child(${me.oldIndex})`)
                            .transition()
                            .duration(config.animateDuration / 4)
                            .attr('opacity', 0)
                    }
                    me.oldIndex = i + 1

                    setTimeout(() => {
                        d3.select(`.arc-${i}`)
                            .attr('d', arcLarger(d))
                            .transition()
                            .duration(config.animateDuration / 2)
                            .attr('fill', config.hoverColor)

                        d3.select(`.label-group .label:nth-child(${i + 1})`)
                            .transition()
                            .duration(config.animateDuration / 2)
                            .attr('opacity', 1)
                        d3.select(`.line-group path:nth-child(${i + 1})`)
                            .transition()
                            .duration(config.animateDuration / 2)
                            .attr('opacity', 1)
                    }, 100)
                })
            }

            chart.render = function () {
                chart.renderTitle()

                chart.renderSlices()

                chart.renderText()

                chart.addMouseOn()
            }

            chart.renderChart()
        }
    }
}
</script>

<style lang="scss" scoped>
.svg-box {
    width: 100%;
    height: 350px;
}
.time {
    justify-content: flex-end;
}
#ac-home-doughnut {
    width: 600px;
    height: 600px;
}
</style>
