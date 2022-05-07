<template>
    <div class="relative">
        <button @click="changeData" class="absolute left-420px right-0">改变数据</button>
        <button @click="downloadPre" class="absolute left-500px right-0">无视缩放，下载整个svg</button>
        <button @click="downloadCurr" class="absolute left-680px right-0">根据缩放，下载当前svg</button>
        <ul class="absolute left-900px right-0">
            <li
                v-for="item in dataset"
                @click="activeTooltip(item)"
                :key="item.name"
                class="cursor-pointer text-pink-700"
            >
                {{ item.name }}
            </li>
        </ul>
        <div :ref="el => (reactAxisRef = el)" class="rect-custom" v-loading="loading"></div>
        <div
            class="tooltip"
            :style="{
                left: currHoverItem.left + 'px',
                top: currHoverItem.top + 'px',
                opacity: currHoverItem.opacity
            }"
        >
            <span>{{ currHoverItem.name }}</span>
            <br />
            <span>{{ currHoverItem.value }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import * as d3 from 'd3'
import { ref, onMounted, Ref } from 'vue'
type dataObj = {
    name: string
    value: number
}
const defaultHoverItem = {
    name: undefined,
    value: undefined,
    left: 0,
    top: 0,
    opacity: 0
}
// reactive 适用于 {a: {a1:'1'}} 大于1层嵌套字段的情况
const currHoverItem = ref({ ...defaultHoverItem })
const loading = ref(false)
const reactAxisRef = ref()
const dataset: Ref<Array<dataObj>> = ref([])
let svg
let width: number
let height: number
const chart: any = {}
const initSVG = () => {
    return d3.select('.rect-custom').append('svg').attr('width', '100%').attr('height', '100%')
}
const getChartData = () => {
    loading.value = true
    return new Promise(resolve => {
        setTimeout(() => {
            dataset.value = [
                {
                    name: '事故次数',
                    value: ~~(Math.random() * 100)
                },
                {
                    name: '道路运输',
                    value: ~~(Math.random() * 100)
                },
                {
                    name: '服务行业物业管理',
                    value: ~~(Math.random() * 100)
                },
                {
                    name: '工业企业',
                    value: ~~(Math.random() * 100)
                },
                {
                    name: '烟花爆竹',
                    value: ~~(Math.random() * 100)
                },
                {
                    name: '医疗机构',
                    value: ~~(Math.random() * 100)
                },
                {
                    name: '养老机构',
                    value: ~~(Math.random() * 100)
                },
                {
                    name: '公共设施',
                    value: ~~(Math.random() * 100)
                }
            ]
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
        bottom: 70,
        rectPadding: 10 // 矩形之间的空白
    }
    chart.padding = padding
    const animateDuration = 600
    const renderXAxis = () => {
        // x轴的比例尺
        xScale = d3
            .scaleBand() // 创建一个序数分段比例尺
            .domain(dataset.value.map(({ name }) => name))
            .rangeRound([0, width - padding.left - padding.right]) // 设置输出范围并启用四舍五入
        chart.xScale = xScale
        // 定义坐标轴
        const xAxis = d3.axisBottom(xScale).tickSizeInner(0).tickPadding(10)

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
                .selectAll('text')
                .attr('transform', 'translate(-10,2)rotate(-45)')
                .style('text-anchor', 'end')
                .style('font-size', 20)
                .style('fill', '#fff')
        }
    }
    const renderYAxis = () => {
        // y轴的比例尺
        yScale = d3
            .scaleLinear()
            .domain([0, d3.max(dataset.value, (d: any) => d.value) + 10])
            .range([height - padding.top - padding.bottom, 0])
        const yAxis = d3.axisLeft(yScale).tickSizeInner(0).tickPadding(10)
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
            .attr('x2', xScale.bandwidth() * dataset.value.length)
            .attr('y2', 0)
    }
    // 添加矩形和文字元素
    const rectPadding = padding.rectPadding // 矩形之间的空白
    let timer
    const renderRect = () => {
        // ===========rects=============
        let rectBlock = svg.selectAll('.rect-block').remove()
        rectBlock = svg
            .append('g')
            .attr('transform', `translate(${padding.left}, ${padding.top})`)
            .attr('class', 'rect-block')
        const rects = rectBlock.selectAll('.myRect').data(dataset.value)
        const bottomRectWidth = xScale.bandwidth() - rectPadding
        chart.bottomRectWidth = bottomRectWidth
        const rectInPadding = 2
        const bottomRectHeight = 20
        const rect = rects
            .enter()
            .append('g')
            .attr('class', d => {
                return `myRect myRect-${d.name}`
            })
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
            .on('mouseover', (e, d) => {
                const position = d3.pointer(e, svg.node())
                currHoverItem.value = {
                    ...d,
                    left: position[0],
                    top: position[1],
                    opacity: 0.8
                }
            })
        // 左线
        const leftLine = rect
            .append('line')
            .attr('y1', yScale(0))
            .attr('y2', 0)
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
        // 底部固定矩形
        const bottomRect = rect
            .append('rect')
            .attr('y', yScale(0) - bottomRectHeight)
            .attr('width', bottomRectWidth)
            .attr('height', bottomRectHeight)
            .attr('fill', 'blue')
        // 右线
        const rightLine = rect
            .append('line')
            .attr('y1', yScale(0))
            .attr('y2', 0)
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
        // 活动矩形
        const rectActive = rect
            .append('rect')
            .attr('width', bottomRectWidth - 2 * rectInPadding)
            .attr('fill', 'green')
            .attr('transform', `translate(0, ${-bottomRectHeight - rectInPadding})`)
        // update
        leftLine
            .attr('x1', d => {
                return xScale(d.name) + rectPadding / 2
            })
            .attr('x2', d => {
                return xScale(d.name) + rectPadding / 2
            })
        rightLine
            .attr('x1', d => {
                return xScale(d.name) + rectPadding / 2 + bottomRectWidth
            })
            .attr('x2', d => {
                return xScale(d.name) + rectPadding / 2 + bottomRectWidth
            })
        bottomRect.attr('x', d => {
            return xScale(d.name) + rectPadding / 2
        })
        rectActive
            .attr('x', d => {
                return xScale(d.name) + rectPadding / 2 + rectInPadding
            })
            .attr('y', d => {
                return yScale(d.value) + bottomRectHeight + rectInPadding
            })
            .attr('height', d => {
                return height - padding.top - padding.bottom - yScale(d.value) - bottomRectHeight - rectInPadding
            })
    }

    const renderText = () => {
        // =========texts==============
        const texts = svg.selectAll('.myText').data(dataset.value)
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
                return xScale(d.name) + rectPadding / 2
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
const zoom = () => {
    const zoom = d3
        .zoom()
        .scaleExtent([1, 40])
        .on('zoom', e => {
            svg.attr('transform', e.transform)
        })
    svg.call(zoom)
}
const activeTooltip = item => {
    const x = chart.xScale(item.name) + chart.padding.rectPadding / 2 + chart.bottomRectWidth / 2 + chart.padding.left
    const y = height / 2
    currHoverItem.value = {
        ...item,
        left: x,
        top: y,
        opacity: 0.8
    }
}
function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {
        type: mime
    })
}

function downloadFile(fileName, blob) {
    // 创建文件内容
    const aLink = document.createElement('a')
    const evt = document.createEvent('MouseEvents')
    evt.initEvent('click', false, false)
    aLink.download = fileName // 下载文件名
    aLink.href = URL.createObjectURL(blob) // 根据二进制文件生成对象
    aLink.dispatchEvent(evt) // 触发点击
}

const downloadSvgFn = function (svg) {
    const serializer = new XMLSerializer()
    const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg)

    const image = new Image()
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)

    image.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context: any = canvas.getContext('2d')
        context.rect(0, 0, width, height)
        context.fillStyle = '#fff'
        context.fill()
        context.drawImage(image, 0, 0)

        const imgSrc = canvas.toDataURL('image/jpg', 1)
        const blob = dataURLtoBlob(imgSrc)
        downloadFile('svg.jpg', blob)
    }
}
const downloadPre = () => {
    // 克隆svg
    const node = svg.node().cloneNode(true)
    /* -------------清除缩放元素的缩放------------- */
    node.setAttribute('transform', 'translate(0,0) scale(1)')
    downloadSvgFn(node)
}
const downloadCurr = () => {
    const node = svg.node().cloneNode(true)
    downloadSvgFn(node)
}
const changeData = async () => {
    // const rectBlock = svg.append('g')
    // const config = {
    //     padding: 2,
    //     rectHeight: 20,
    //     rectWidth: 20,
    //     value: 200
    // }
    // // 左线
    // rectBlock
    //     .append('line')
    //     .attr('x1', 5)
    //     .attr('y1', 0)
    //     .attr('x2', 5)
    //     .attr('y2', config.value)
    //     .attr('stroke', 'blue')
    //     .attr('stroke-width', 2)
    // // 底部固定矩形
    // rectBlock
    //     .append('rect')
    //     .attr('x', 5)
    //     .attr('y', config.value - config.rectHeight)
    //     .attr('width', config.rectWidth)
    //     .attr('height', config.rectHeight)
    //     .attr('fill', 'blue')
    // // 右线
    // rectBlock
    //     .append('line')
    //     .attr('x1', 25)
    //     .attr('y1', 0)
    //     .attr('x2', 25)
    //     .attr('y2', config.value)
    //     .attr('stroke', 'blue')
    //     .attr('stroke-width', 2)
    // // 活动矩形
    // rectBlock
    //     .append('rect')
    //     .attr('x', 7)
    //     .attr('y', config.value - 100)
    //     .attr('width', 16)
    //     .attr('height', 100)
    //     .attr('fill', 'green')
    //     .attr('transform', `translate(0, ${-config.rectHeight - config.padding})`)
    await getChartData()
    renderChart()
    zoom()
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
.rect-custom {
    width: 400px;
    height: 400px;
    background-color: aquamarine;
}
.grid-line {
    stroke: green;
}
</style>
