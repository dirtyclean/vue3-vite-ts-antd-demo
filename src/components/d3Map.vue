<!--
/*
 * @Author: dirtyclean 
 * @Date: 2021-12-23 17:13:15 
 * @Last Modified by: dirtyclean
 * @Last Modified time: 2021-12-29 22:10:22
 */
调用onDownloadBtnClick下载svg图片
marker通过d3渲染----已完成文字渲染
marker通过html渲染
infoWindow通过html渲染----已完成
-->
<template>
    <div id="map">
        <div class="svg-ct" ref="svg-ct">
            <svg id="svg" xmlns="http://www.w3.org/2000/svg"></svg>
        </div>
        <div class="infoWindow" v-if="infoWindow.show" :style="infoWindow.style" :key="generator.randomNum">
            <slot name="infoWindow" v-bind="currentMarker"></slot>
        </div>
        <div v-for="({ areaNaem, style }, index) in markerData" :key="index" class="absolute" :style="style">
            {{ areaNaem }}
        </div>
    </div>
    <div id="bar"></div>
</template>

<script>
/**
 * 考虑到需要导出SVG,请不要在SVG上使用Class,
 * */
import * as d3 from 'd3'
const generator = (function () {
    const obj = {}
    Object.defineProperty(obj, 'randomNum', {
        enumerable: false,
        configurable: false,
        get() {
            return Math.random().toString(16).substring(2)
        }
    })
    return obj
})()
const defaultInfoWindow = {
    show: false,
    style: {}
}
export default {
    _svgHeight: undefined,
    _svgWidth: undefined,
    _colors: [],
    _a1: null,
    _a2: null,
    _a3: null,
    _a4: null,
    _a5: null,
    _t1: null,
    _t2: null,
    _t3: null,
    _t4: null,
    _t5: null,
    _geoPath: null,
    _zoom: null,
    _pathGenerator: null,
    _projection: null,
    props: {
        getAreaMarkerList: Function,
        showAreaText: {
            type: Boolean,
            default: true
        },
        currentAreaCode: {
            type: String,
            required: true
        }
    },
    data() {
        this.markerData = []
        this.markersBoxG = undefined
        return {
            // 数据缓存字段名
            beforeMouseoverFillColorAttributeName: 'data-before-mouseover-fill-color',
            initFillColorAttributeName: 'data-init-fill-color',

            // 投影内边距
            padding: 20,

            // 投影颜色
            shadowFillColor: '#00B1FF',

            // 行政区样式
            areaFillColor: ['#1f377e', '#0D2258'],
            areaHoverColor: '#2A70FF',
            areaStrokeColor: '#1C78FF',

            // 行政区名字样式
            areaLabelFontSize: 12,
            areaLabelColor: '#fff',
            // 下转时父级样式
            backgroundOpacity: 0.2,
            backgroundLabelOpacity: 0.5,

            currentMarker: undefined,
            infoWindow: { ...defaultInfoWindow },
            generator
        }
    },
    watch: {
        currentAreaCode() {
            console.log('currentAreaCode改变')
            this.$nextTick(() => {
                this.renderArea()
            })
        }
    },
    mounted() {
        setTimeout(() => {
            this.initSVG()
            this.renderMarker2()
        }, 800)
    },
    methods: {
        async renderMarker() {
            console.log(this.currentAreaCode, '====this.currentAreaCode====')
            this.markerData = await this.getAreaMarkerList({ areaId: this.currentAreaCode })
            const data = this.markerData
            console.log(this.markerData, '==this.markerData==')
            // enter
            this.markersBoxG
                .selectAll('.marker')
                .data(data)
                .enter()
                .append('g')
                .attr('class', (d, i) => {
                    return `marker marker-${i}`
                })
                .attr('color', () => {
                    return 'red'
                })
                .append('text')
                .attr('font-size', this.areaLabelFontSize)
                .on('mouseover', this.onAreaMouseOver)
                .on('mouseout', this.onAreaMouseOut)
                .on('mouseleave', this.onAreaMouseLeave)
                .on('mousemove', this.onAreaMouseMove)

            // updata
            this.markersBoxG
                .selectAll('.marker')
                .data(data)
                .attr('transform', d => {
                    const position = this._projection([d.longitude, d.latitude])
                    const transform = d3.zoomTransform(this._topGroup.node())
                    // 如何将经纬度转换为translate的xy？渲染到svg上
                    // 根据投影函数，将经纬度转换为平面坐标 不同投影函数效果不同
                    return `translate(${position[0]}, ${position[1]}) scale(${1 / transform.k})`
                })
                .select('text')
                .text(function (d) {
                    return d.areaName
                })
                .attr('stroke', 'currentColor')

            // exit
            this.markersBoxG
                .selectAll('.marker')
                .data(data)
                // 得到没有任何数据关联的图形元素
                .exit()
                // 移除多余的元素
                .remove()

            d3.selectAll('.marker').on('click', (e, d) => {
                console.log('选中marker', d, e)
                this.currentMarker = d
                let position = this._projection([d.longitude, d.latitude])
                const transform = d3.zoomTransform(this._topGroup.node())
                position = transform.apply(position)
                this.infoWindow.show = true
                this.infoWindow.style = {
                    left: `${position[0]}px`,
                    top: `${position[1]}px`
                }
            })
        },
        renderMarker2(data = [10, 15, 30, 50, 80, 65, 55, 30, 20, 10, 8]) {
            // enter
            // 选中#bar, 选中类名为h bar的div, 其实刚开始页面，上是没有这些元素的，选择出图形元素的集合
            d3.select('#bar')
                .selectAll('div.h-bar')
                // data函数讲数组绑定到简要创建的图形元素上
                .data(data)
                // enter函数选择没有被可视化的数据元素，render第 -次调用的时候， 没有数据被可视化，所以选 中的是所有数据
                .enter()
                // 为每个数据创建一个div,这里d3为响应的div添加了data属性，这个属性值就是未绑定的数据值
                .append('div')
                // 设置div的类名为h-bar
                .attr('class', 'h-bar')
                // 每个div中添加一个span, 为了展示数值
                .append('span')
            // updata
            // 选中#bar,选中类名为h-bar的div,其实刚开始页面上是没有这些元素的，选择出图形元素的集合
            d3.select('#bar')
                .selectAll('div.h-bar')
                // 定义图形集合和数据集合，更新模式下，data函数返回的是数据集合和图形集合的交集
                .data(data)
                // 在和数据关联的图形改变属性，所有的d3修饰函数都可以使用这个函数去修改图形元素的属性
                .style('width', function (d) {
                    return d * 3 + 'px'
                })
                // 子元素能拿到父元素的值
                .select('span')
                .text(function (d) {
                    return d
                })
            // exit
            d3.select('#bar')
                .selectAll('div.h-bar')
                .data(data)
                // 得到没有任何数据关联的图形元素
                .exit()
                // 移除多余的元素
                .remove()
        },
        async initSVG() {
            const svg = (this._svg = d3.select('#svg'))
            const svgEl = this.$refs['svg-ct']
            console.log(svgEl, '===svgEl===', document.querySelector('.svg-ct'))
            this._svgHeight = svgEl.clientHeight
            this._svgWidth = svgEl.clientWidth
            console.log(this._svgHeight)
            this._colors = d3.scaleLinear().domain([0, 21]).range(this.areaFillColor)

            svg.attr('height', this._svgHeight)
            svg.attr('width', this._svgWidth)

            /*
             * 用于缩放图层
             * */
            const g = (this._topGroup = svg.append('g'))

            /*
             * 初始化图层
             * */
            this._a1 = g.append('g').attr('level', 'province')
            this._a2 = g.append('g').attr('level', 'city')
            this._a3 = g.append('g').attr('level', 'district')
            this._a4 = g.append('g').attr('level', 'town')
            this._a5 = g.append('g').attr('level', 'village')

            this._t1 = g.append('g').attr('level', 'province')
            this._t2 = g.append('g').attr('level', 'city')
            this._t3 = g.append('g').attr('level', 'district')
            this._t4 = g.append('g').attr('level', 'town')
            this._t5 = g.append('g').attr('level', 'village')
            this.markersBoxG = g.append('g').attr('class', 'markers-box')
            /*
             * 初始化投影,缩放事件
             * */
            this._geoPath = d3.geoPath()

            await this.initProjection(this.currentAreaCode)
            this._zoom = d3.zoom().scaleExtent([1, 100]).on('zoom', this.onZoom)
            this._topGroup.call(this._zoom) // 开启手动缩放
            this._svg.on('dblclick.zoom', null).on('click', this.onSVGClick)
            this._pathGenerator = this._geoPath.projection(this._projection)
            this.renderArea()
        },
        reset() {
            this.closeInfoWindow()
        },
        closeInfoWindow() {
            this.infoWindow = { ...defaultInfoWindow }
        },
        renderArea() {
            this.reset()
            /*
             * 加载初始化区域
             * */
            this.loadAndZoom(this.currentAreaCode)
        },
        /**
         * 加载GEOJSON,如果有缓存就走缓存
         * */
        async loadJson(code, full) {
            this._jsonCache = this._jsonCache || []

            const cache = this._jsonCache.filter(n => n.code === code && n.full === full)[0]

            if (cache) {
                return cache.data
            }

            const json = await d3.json(`mapJson/${full ? code + '_full' : code}.json`)
            const res = this.preProcess(json)

            this._jsonCache.push({
                code: code,
                full: full ?? false,
                data: res
            })
            return res
        },
        /**
         * 加载行政区的边界数据并缩放到该层级
         * */
        async loadAndZoom(code) {
            const shadowData = await this.loadJson(code)

            let areaData
            const level = this.getLevel(code)
            console.log(level, '==level==')
            if (level >= 3) {
                areaData = shadowData
            } else {
                areaData = await this.loadJson(code, true)
            }

            this['_a' + level].selectAll('g').transition().style('opacity', 0).remove()
            this['_t' + level].selectAll('g').transition().style('opacity', 0).remove()

            const shadow = this['_a' + level].append('g')
            shadow
                .attr('shadow', code)
                .style('opacity', 0)
                .selectAll('path')
                .data(shadowData.features)
                .join('path')
                .style('fill', this.shadowFillColor)
                .attr('d', this.buildWall)

            const areaGroup = this['_a' + level].append('g')
            areaGroup
                .attr('boundary', code)
                .style('opacity', 0)
                .selectAll('path')
                .data(areaData.features)
                .join('path')
                .style('stroke', this.areaStrokeColor)
                .style('fill', (d, i) => {
                    return this._colors(i)
                })
                .attr(this.initFillColorAttributeName, (d, i) => {
                    return this._colors(i)
                })
                .attr('boundary', d => d.properties.adcode)
                .attr('d', this._pathGenerator)
            let labelGroup
            if (this.showAreaText) {
                labelGroup = this['_t' + level].append('g')
                labelGroup
                    .attr('label', code)
                    .style('opacity', 0)
                    .selectAll('text')
                    .data(areaData.features)
                    .join('text')
                    .attr('code', d => d.properties.adcode)
                    .attr('font-size', this.areaLabelFontSize)
                    .attr('text-anchor', 'middle')
                    .style('fill', this.areaLabelColor)
                    .attr('x', d => {
                        return this._geoPath.centroid(d)[0]
                    })
                    .attr('y', d => this._geoPath.centroid(d)[1])
                    .attr('dy', d => {
                        let dy = 0
                        if (d.properties.name === '泸州市') dy += 35
                        return dy
                    })
                    .text(d => d.properties.name)
            }

            this.renderMarker()
            const animate = [shadow, areaGroup, labelGroup].filter(item => item)
            animate.forEach(n => n.transition().style('opacity', 1))
            /**
             *小于当前层级的设置透明度,大于当前层级的消失
             */
            for (let i = 1; i <= 5; i++) {
                const cuAreaLayer = this['_a' + i]
                const cuLabelLayer = this['_t' + i]

                if (i < level) {
                    cuAreaLayer.selectAll('g[shadow]').transition().style('opacity', 0)
                    cuAreaLayer.selectAll('g[boundary]').transition().style('opacity', this.backgroundOpacity)
                    cuLabelLayer.selectAll('g[label]').transition().style('opacity', this.backgroundLabelOpacity)
                    console.log(123)
                } else if (i > level) {
                    console.log(456)
                    ;[cuAreaLayer, cuLabelLayer].forEach(n => {
                        n.selectAll('g').transition().style('opacity', 0).remove()
                    })
                }
            }
            this._svg.selectAll(`g[label] text`).style('opacity', null)
            const codePath = this.getCodePath(code)
            console.log(codePath, '==codePath==', code)
            codePath.forEach(n => {
                if (~~n !== code || level < 3) {
                    console.log('zj')
                    this._svg.selectAll(`g[label] text[code='${n}']`).style('opacity', 0)
                }
            })

            /**
             * 缩放到目标
             * */
            this._topGroup
                .transition()
                .call(
                    this._zoom.transform,
                    d3.zoomIdentity
                        .translate(this._svgWidth / 2, this._svgHeight / 2)
                        .scale(this.getScale(shadowData))
                        .translate(...this.getCenterTranslate(shadowData))
                )
                .on('end', () => {
                    /**
                     *动画完毕以后再添加鼠标响应事件,避免动画时触发鼠标相应
                     **/
                    areaGroup
                        .selectAll('path')
                        .on('mouseover', this.onAreaMouseOver)
                        .on('mouseout', this.onAreaMouseOut)
                        .on('mouseleave', this.onAreaMouseLeave)
                        .on('mousemove', this.onAreaMouseMove)
                        .on('click', this.onAreaClick)
                    this.showAreaText &&
                        labelGroup
                            .selectAll('text')
                            .on('mouseover', this.onAreaMouseOver)
                            .on('mouseout', this.onAreaMouseOut)
                            .on('mouseleave', this.onAreaMouseLeave)
                            .on('mousemove', this.onAreaMouseMove)
                            .on('click', this.onAreaClick)
                })
        },
        /**
         *返回行政区代码层级,
         *1: 省、市级;
         *2: 市、州级;
         *3: 区、县级;
         *4: 乡镇、街道级;
         *5: 村、社区级
         **/
        getLevel(code) {
            let codeStr = code
            if (typeof codeStr === 'number') {
                codeStr = codeStr.toString()
            }
            switch (codeStr.length) {
                case 2:
                    return 1
                case 4:
                    return 2
                case 6:
                    if (codeStr.endsWith('0000')) return 1
                    else if (codeStr.endsWith('00')) return 2
                    else return 3
                case 12:
                    if (codeStr.endsWith('0000000000')) return 1
                    else if (codeStr.endsWith('00000000')) return 2
                    else if (codeStr.endsWith('000000')) return 3
                    else if (codeStr.endsWith('000')) return 4
                    else return 5
                default:
                    throw new Error('错误的行政区代码,请使用6位数字或者12位数字')
            }
        },
        /**
         * 鼠标mouseover事件响应
         * */
        onAreaMouseOver(e, data) {
            console.log('onAreaMouseOver')
            e?.stopPropagation()
            const cuNode = this._svg
                .selectAll('path[boundary]')
                .filter(n => n === data || n.properties.adcode === ~~data.areaCode)
            const position = [e.pageX, e.pageY - 40] // d3.pointer(e)
            console.log(position, e)
            cuNode
                .attr(this.beforeMouseoverFillColorAttributeName, cuNode.style('fill'))
                .style('fill', this.areaHoverColor)
            this._svg
                .append('text')
                .classed('tooltip', true)
                .attr('fill', this.areaLabelColor)
                .attr('x', position[0])
                .attr('y', position[1])
                .text(() => {
                    console.log(data, data.properties?.name || data.areaName)
                    return data.properties?.name || data.areaName
                })
        },
        onAreaMouseLeave() {
            console.log('onAreaMouseLeave')
            d3.selectAll('.tooltip').remove()
        },
        onAreaMouseMove(e) {
            const position = [e.pageX, e.pageY - 40] // d3.pointer(e)
            d3.select('.tooltip').attr('x', position[0]).attr('y', position[1])
        },
        /**
         * 鼠标mouseout事件响应
         * */
        onAreaMouseOut(e, data) {
            console.log('onAreaMouseOut')
            e?.stopPropagation()
            const self = this
            this._svg
                .selectAll('path[boundary]')
                .filter(n => n === data || n.properties.adcode === ~~data.areaCode)
                .style('fill', function () {
                    const node = d3.select(this)
                    const color =
                        node.attr(self.beforeMouseoverFillColorAttributeName) ||
                        node.attr(self.initFillColorAttributeName)
                    node.attr(self.beforeMouseoverFillColorAttributeName, null)
                    return color
                })
        },
        /**
         * geojson预处理,主要是颠倒顺序
         * */
        preProcess(data) {
            data.features.forEach(n => {
                n.geometry.coordinates.forEach(m => m.forEach(l => l.reverse()))
            })
            return data
        },
        /**
         * 构建伪投影
         * */
        buildWall(geoData) {
            const source = this._pathGenerator(geoData)
            const circles = source.match(/M.*?Z/gi).map(n => {
                return n.match(/[MLZ](\d*.\d*,\d*.\d*)?/gi).map(n => {
                    if (n[0] === 'Z')
                        return {
                            command: n[0]
                        }
                    return {
                        command: n[0],
                        x: parseFloat(n.substr(1).split(',')[0]),
                        y: parseFloat(n.substr(1).split(',')[1])
                    }
                })
            })
            const distance = this.getShadowDeep(geoData)
            return circles
                .map(circle => {
                    return circle
                        .map((n, i) => {
                            if (n.command === 'Z') {
                                return ''
                            }
                            let next = circle[i + 1]
                            if (!next) {
                                return ''
                            }
                            if (next.command === 'Z') {
                                next = circle[0]
                            }

                            if (n.x === next.x) {
                                return ''
                            }

                            if (n.x < next.x) {
                                return `M${n.x},${n.y}L${next.x},${next.y}L${next.x},${next.y + distance}L${n.x},${
                                    n.y + distance
                                }Z`
                            }

                            return `M${n.x},${n.y}L${n.x},${n.y + distance}L${next.x},${next.y + distance}L${next.x},${
                                next.y
                            }Z`
                        })
                        .join('')
                })
                .join('')
        },
        /**
         * 区域点击事件
         * */
        async onAreaClick(e, data) {
            e?.stopPropagation()
            this.$emit('updateAreaCodes', data.properties?.adcode || ~~data.areaCode)
            console.log('区域点击事件')
        },
        /**
         *  按照数据计算缩放
         * */
        getScale(data) {
            const [[x0, y0], [x1, y1]] = this._geoPath.bounds(data)
            const scale = Math.min(100, 1 / Math.max((x1 - x0) / this._svgWidth, (y1 - y0) / this._svgHeight))
            console.log('scale大小:', scale)
            return scale
        },
        /**
         * 计算居中坐标
         * */
        getCenterTranslate(data) {
            const [[x0, y0], [x1, y1]] = this._geoPath.bounds(data)
            return [-(x0 + x1) / 2, -(y0 + y1) / 2]
        },
        /**
         *  计算伪投影高度
         * */
        getShadowDeep(data) {
            return 10 / this.getScale(data)
        },
        /**
         * 响应缩放拖动事件
         * */
        onZoom(e) {
            // this._topGroup.attr('transform', `translate(${e.transform.x},${e.transform.y}) scale(${e.transform.k})`)
            this._topGroup.attr('transform', e.transform)
            this._svg.selectAll('g[boundary] path').style('stroke-width', 1 / e.transform.k)
            // this._topGroup.selectAll('text').style('font-size', (1 / e.transform.k) * this.areaLabelFontSize)
            // this.markersBoxG.selectAll('text').style('font-size', this.areaLabelFontSize)
            // this.markersBoxG.selectAll('.marker').attr('transform', (d, i) => {
            //     const transform = d3
            //         .select('.map-icon-' + i)
            //         .attr('transform')
            //         .match(/translate\([0-9.,]*\)/)[0]
            //     return `${transform} scale(${1 / k})`
            // })
            this.markersBoxG.selectAll('.marker').attr('transform', (d, i) => {
                console.log(d, i)
                const transform =
                    d3
                        .select('.marker-' + i)
                        .attr('transform')
                        .split(')')[0] + ')'
                return `${transform} scale(${1 / e.transform.k})`
            })
            if (this.currentMarker && this.infoWindow.show) {
                const { longitude, latitude } = this.currentMarker
                let position = this._projection([longitude, latitude])
                const transform = e.transform
                position = transform.apply(position)
                this.infoWindow.style = {
                    left: `${position[0]}px`,
                    top: `${position[1]}px`
                }
            }
        },
        /**
         * SVG全局点击捕获
         * */
        onSVGClick() {},
        /**
         * 按照行政区进行投射初始化
         * */
        async initProjection(code) {
            if (this._projection) {
                console.warn('一个实例只能有一个Projection')
                return this._projection
            }
            const data = await this.loadJson(code)
            // geoMercator球面墨卡托投影
            // fitExtent以 [[x₀, y₀], [x₁, y₁]] 的形式指定, 其中 x₀ 为包裹框的左边界, y₀ 为上边界, x₁ 为右边界, y₁ 为下边界. 返回投影
            // 将 GeoJSON 对象 data 位于 (this._svgWidth - this.padding)×(this._svgHeight - this.padding) 的包裹框内, 并设置边距为 padding
            this._projection = d3.geoMercator().fitExtent(
                [
                    [this.padding, this.padding],
                    [this._svgWidth - this.padding * 2, this._svgHeight - this.padding * 2]
                ],
                data
            )

            return this._projection
        },
        /**
         * 下载SVG图片
         * */
        onDownloadBtnClick() {
            const svgXml = document.getElementById('svg').outerHTML
            const image = new Image()

            image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml)))
            image.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = this._svgWidth
                canvas.height = this._svgHeight
                const ctx = canvas.getContext('2d')
                ctx.fillStyle = '#FFF'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                const a = document.createElement('a')
                a.href = canvas.toDataURL('image/png')
                a.download = 'MapPathExport'
                a.click()
            }
        },
        /**
         * 获取行政区划路径
         * */
        getCodePath(code, length) {
            let codeStr = code
            if (typeof codeStr === 'number') {
                codeStr = codeStr.toString()
            }

            let lengthTmp = length
            if (!lengthTmp) {
                lengthTmp = 6
            }

            const res = []
            const buildPathFn = (n, interval) => {
                if (codeStr.length >= n && codeStr.slice(n - interval, n) !== ''.padEnd(interval, '0'))
                    res.push(codeStr.slice(0, n))
            }
            ;[2, 4, 6].forEach(n => {
                buildPathFn(n, 2)
            })
            ;[9, 12].forEach(n => {
                buildPathFn(n, 3)
            })
            return res.map(n => n.padEnd(lengthTmp, '0'))
        }
    }
}
</script>

<style lang="scss">
.infoWindow {
    position: absolute;
}
.tooltip {
    font-size: 14px;
}
.h-bar {
    min-width: 10px;
    min-height: 22px;
    margin-bottom: 2px;
    background-color: blue;
    font-size: 12px;
    color: #ccc;
    text-align: right;
    padding-right: 20px;
}
#map {
    height: 100%;
    width: 100%;
    // background: url('../assets/images/bg.png') center;
    background-size: cover;
    position: relative;
}

.svg-ct {
    height: 100%;
    width: 100%;
}

text,
path[boundary] {
    cursor: pointer;
}
</style>
