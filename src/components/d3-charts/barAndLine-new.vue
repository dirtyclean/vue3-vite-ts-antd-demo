<template>
    <div class="relative w-400px">
        <button @click="changeData" class="absolute left-420px right-0">改变数据</button>
        <div :ref="el => (reactAxisRef = el)" class="bar-line" v-loading="loading"></div>
        <div class="slider-box">
            <vue-slider
                direction="ltr"
                :style="`display: inline-block; width:100%`"
                :railStyle="{ background: '#DAEAFF' }"
                :process="false"
                :tooltip="'none'"
                :dotSize="20"
                v-model="sliderValue"
                @change="sliderChange"
            >
                <template #dot="{ focus }">
                    <div :class="['custom-dot', { focus }]"></div>
                </template>
            </vue-slider>
        </div>
        <div class="p-20px">
            <swiper
                :slidesPerView="3"
                :spaceBetween="30"
                :centeredSlides="true"
                :pagination="{
                    clickable: true
                }"
                :modules="[Pagination]"
                :loop="false"
                @swiper="onSwiper"
                @slide-change="onSlideChange"
                :ref="el => (swiperRef = el)"
            >
                <SwiperSlide
                    class="!h-200px bg-green-200 overflow-hidden"
                    :class="'swiper-item-' + index"
                    v-for="(item, index) in dataset"
                    :key="index"
                >
                    <div :style="{ color: swipeIndex === index ? 'red' : '#fff' }" class="w-max">
                        {{ item.areaName }}
                    </div>
                </SwiperSlide>
            </swiper>
        </div>
    </div>
</template>
<script lang="ts" setup>
import * as d3 from 'd3'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/pagination'

// import required modules
import { Pagination } from 'swiper'
import { ref, onMounted, getCurrentInstance } from 'vue'
type dataObj = {
    areaName: string
    areaCode: string
    value: number
}
const loading = ref(false)
const reactAxisRef = ref()
const swiperRef = ref()
const dataset = ref<Array<dataObj>>([])
const instance: any = getCurrentInstance()
let svg
let width: number
let height: number
const sliderValue = ref(0)
const swipeIndex = ref(0)
const initSVG = () => {
    if (svg) svg.remove()
    return d3.select('.bar-line').append('svg').attr('width', width).attr('height', '100%')
}
const checkDivScroolTop = () => {
    // 获取节点
    const el: any = document.getElementsByClassName('bar-line')[0]
    // 绑定事件
    el.addEventListener('scroll', function () {
        console.log(el.scrollLeft, el.scrollWidth, el.offsetWidth)
        const value = (el.scrollLeft * 100) / (el.scrollWidth - el.offsetWidth)
        if (value > 100) {
            sliderValue.value = 100
        } else {
            sliderValue.value = value
        }
    })
}
const sliderChange = value => {
    const el: any = document.getElementsByClassName('bar-line')[0]
    console.log(el)
    console.log(value, el.scrollLeft, el.scrollWidth, el.offsetWidth)
    if (value === 1) value = 0 // slider插件bug-划不到0
    el.scrollLeft = (value * (el.scrollWidth - el.offsetWidth)) / 100
}
const onSlideChange = e => {
    console.log(e, 'onSlideChange')
    swipeIndex.value = e.activeIndex
}
const onSwiper = e => {
    console.log(e, 'onSwiper')
}
const getChartData = () => {
    loading.value = true
    return new Promise(resolve => {
        setTimeout(() => {
            const data: any = []
            for (let i = 0; i < ~~(Math.random() * 10) + 20; i++) {
                data.push({
                    areaName: '市' + i,
                    areaCode: 'code-' + i,
                    value: ~~(Math.random() * 100)
                })
            }
            dataset.value = data
            loading.value = false
            resolve(true)
        }, 2000)
    })
}
const renderChart = () => {
    // 画布周边的留白
    const padding = {
        left: 30,
        right: 30,
        top: 20,
        bottom: 20,
        rectPadding: 4 // 矩形之间的空白
    }
    const animateDuration = 600
    // x轴的比例尺
    const xScale: any = d3
        .scaleBand() // 创建一个序数分段比例尺
        .domain(dataset.value.map(({ areaName }) => areaName))
        .rangeRound([0, width - padding.left - padding.right]) // 设置输出范围并启用四舍五入
    // y轴的比例尺
    const yScale: any = d3
        .scaleLinear()
        .domain([0, d3.max(dataset.value, (d: any) => d.value)])
        .range([height - padding.top - padding.bottom, 0])
    const bandwidth = xScale.bandwidth()
    // 添加矩形和文字元素
    const rectPadding = padding.rectPadding // 矩形之间的空白
    let currSelectedItem = dataset.value.length ? dataset.value[0].areaName : undefined
    setTimeout(() => {
        const mouseoverEvent = new Event('click')
        const node: any = d3.select(`.myRect-${currSelectedItem}`).node()
        node && node.dispatchEvent(mouseoverEvent)
    })
    const renderRect = () => {
        // ===========rects=============
        const rects = svg.selectAll('.myRect').data(dataset.value)
        // enter
        const rect = rects
            .enter()
            .append('rect')
            .attr('class', d => `myRect myRect-${d.areaName}`)
            .attr('transform', `translate(${padding.left}, ${padding.top})`)
            .attr('fill', '#fff')
            .attr('rx', 10) // 圆角
            .attr('opacity', 0.5)
            .attr('cursor', 'pointer')
            .on('click', (e, d) => {
                console.log(e, d)
                const name = d.areaName
                const oldSelectedItem = currSelectedItem
                if (oldSelectedItem) {
                    svg.select('.myPoint' + '-' + oldSelectedItem).attr('opacity', 0)
                    svg.select('.myText' + '-' + oldSelectedItem).attr('opacity', 0)
                    svg.select('.myXText' + '-' + oldSelectedItem).attr('opacity', 0.5)
                    d3.select('.myRect' + '-' + oldSelectedItem).attr('opacity', 0.5)
                }
                currSelectedItem = name
                svg.select('.myPoint' + '-' + currSelectedItem).attr('opacity', 1)
                svg.select('.myText' + '-' + currSelectedItem).attr('opacity', 1)
                svg.select('.myXText' + '-' + currSelectedItem).attr('opacity', 1)
                d3.select('.myRect' + '-' + currSelectedItem).attr('opacity', 0.8)
                const findIndex = dataset.value.findIndex(({ areaName }) => areaName === currSelectedItem)
                console.log(
                    findIndex,
                    swiperRef.value.$el.swiper.activeIndex,
                    instance.ctx,
                    useSwiper(),
                    useSwiperSlide()
                )
                swiperRef.value.$el.swiper.activeIndex = findIndex
                swipeIndex.value = findIndex
                swiperRef.value.$el.swiper.update()
                instance.ctx.$forceUpdate()

                // const center: any = document.getElementsByClassName('swiper-item-' + findIndex)[0]
                // center.style.scale = 1.2
                // const last: any = document.getElementsByClassName('swiper-item-' + (findIndex - 1))[0]
                // if (last) last.style.scale = 0.8
                // const next: any = document.getElementsByClassName('swiper-item-' + (findIndex + 1))[0]
                // if (next) next.style.scale = 0.8
            })
        // update
        rect.merge(rects)
            .attr('x', (d: any) => {
                return xScale(d.areaName) + rectPadding / 2
            })
            .attr('width', bandwidth - rectPadding)
            .attr('y', yScale(0))
            .attr('height', 0)
            .transition()
            .duration(animateDuration)
            .attr('y', () => {
                return yScale(d3.max(dataset.value, (d: any) => d.value))
            })
            .attr('height', () => {
                return height - padding.top - padding.bottom
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
        const texts = svg.selectAll('.myText').data(dataset.value)
        // enter
        const text = texts
            .enter()
            .append('text')
            .attr('class', d => `myText myText-${d.areaName}`)
            .attr('transform', `translate(${padding.left}, ${padding.top})`)
            .attr('dy', 20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#296fff')
            .attr('style', 'font-weight: 600;')
            .attr('opacity', 0)
        // update
        text.merge(texts)
            .attr('x', d => {
                return xScale(d.areaName) + rectPadding / 2
            })
            .attr('y', d => {
                return yScale(d.value)
            })
            .attr('dx', (bandwidth - rectPadding) / 2)
            .text(d => d.value)
        // exit
        texts
            // 得到没有任何数据关联的图形元素
            .exit()
            // 移除多余的元素
            .remove()
    }
    const renderXAxisText = () => {
        // =========texts==============
        const texts = svg.selectAll('.myXText').data(dataset.value)
        // enter
        const text = texts
            .enter()
            .append('text')
            .attr('class', d => `myXText myXText-${d.areaName}`)
            .attr('transform', `translate(${padding.left}, ${padding.top})`)
            .attr('dy', 20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#000')
            .attr('opacity', 0.5)
        // update
        text.merge(texts)
            .attr('x', d => {
                return xScale(d.areaName) + rectPadding / 2
            })
            .attr('y', () => {
                return yScale(0)
            })
            .attr('dx', (bandwidth - rectPadding) / 2)
            .attr('dy', -20)
            .text(d => d.areaName)
        // exit
        texts
            // 得到没有任何数据关联的图形元素
            .exit()
            // 移除多余的元素
            .remove()
    }
    const renderLine = () => {
        // 创建线段生成器
        const linePath = d3
            .line()
            .x((d: any) => {
                return xScale(d.areaName)
            })
            .y((d: any) => {
                return yScale(d.value)
            })
            .curve(d3.curveCardinal)
        let lineBox
        if (!svg.select('.line-box').node()) {
            lineBox = svg.append('g').attr('class', 'line-box')
        } else {
            lineBox = svg.select('.line-box')
        }
        lineBox = lineBox.attr('transform', `translate(${padding.left + bandwidth / 2}, ${padding.top})`)
        const lines = lineBox.selectAll('.myLine').data([dataset.value])
        // enter
        const line = lines
            .enter()
            .append('path')
            .attr('class', 'myLine')
            .attr('fill', 'none')
            .attr('stroke', '#296FFF')
            .attr('stroke-width', '3px')
        // update
        line.merge(lines).attr('d', d => {
            return linePath(d as any)
        })
        // exit
        lines
            // 得到没有任何数据关联的图形元素
            .exit()
            // 移除多余的元素
            .remove()
    }
    const renderPoints = () => {
        let pointBox
        if (!svg.select('.point-box').node()) {
            pointBox = svg.append('g').attr('class', 'point-box')
        } else {
            pointBox = svg.select('.point-box')
        }
        pointBox = pointBox.attr('transform', `translate(${padding.left + bandwidth / 2}, ${padding.top})`)
        const points = pointBox.selectAll('.myPoint').data(dataset.value)
        // enter
        const point = points
            .enter()
            .append('circle')
            .attr('class', d => `myPoint myPoint-${d.areaName}`)
            .attr('fill', '#fff')
            .attr('stroke', '#296FFF')
            .attr('stroke-width', '3px')
            .attr('opacity', 0)
        // update
        point
            .merge(points)
            .attr('cx', d => xScale(d.areaName))
            .attr('cy', d => yScale(d.value))
            .attr('r', 6)
        // exit
        points
            // 得到没有任何数据关联的图形元素
            .exit()
            // 移除多余的元素
            .remove()
    }
    renderRect()
    renderXAxisText()
    renderText()
    renderLine()
    renderPoints()
}
const changeData = async () => {
    await getChartData()
    width = dataset.value.length * 50
    svg = initSVG()
    renderChart()
}
onMounted(() => {
    height = reactAxisRef.value.offsetHeight

    changeData()
    checkDivScroolTop()
})
</script>
<style lang="scss">
.swiper-slide-prev {
    transform: scale(0.9);
    width: 20px !important;
}
.swiper-slide-active {
    transform: scale(1);
    width: 260px !important;
}
.swiper-slide-next {
    transform: scale(0.9);
    width: 20px !important;
}
.slider-box {
    width: 100%;
    height: 32px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0px 0px 8px 0px rgba(194, 206, 223, 0.5);
    display: flex;
    padding: 10px 20px;
    align-items: center;
}
.custom-dot {
    width: 24px;
    height: 14px;
    background: #a7c4ff;
    border: 3px solid #296fff;
    border-radius: 10px;
    box-shadow: 0px 0px 4px 0px #296fff;
    transform: translate(0, 3px);
}
.tooltip {
    padding: 10px;
    min-width: 200px;
    background-color: #00b1ff;
    border-radius: 8px;
    position: absolute;
    z-index: 10;
}
.bar-line {
    width: 400px;
    height: 400px;
    background-color: aquamarine;
    overflow: auto;
}
.bar-line::-webkit-scrollbar {
    height: 0px;
}
.grid-line {
    stroke: green;
}
</style>
