<template>
  <div id="app">
    <div class="svg-ct">
      <svg id="svg" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
    <div class="nav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.code">
          <template v-if="index < breadcrumbs.length - 1 || breadcrumbs.length == 1">
            <span @click="onNavClick(item)" class="nav-link">{{ item.name }}</span>
          </template>
          <template v-else>
            {{ item.name }}
          </template>
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="btn" @click="onDownloadBtnClick">下载</div>
    </div>
  </div>
</template>

<script>
  /**
   * 考虑到需要下载SVG,请不要在SVG上使用Class,
   * */
  import * as d3 from 'd3'

  export default {
    _svgHeight: 600,
    _svgWidth: 800,
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
    data() {
      return {
        //数据缓存字段名
        beforeMouseoverFillColorAttributeName: 'data-before-mouseover-fill-color',
        initFillColorAttributeName: 'data-init-fill-color',

        //投影内边距
        padding: 20,

        //初始化行政区
        initAreaCode: 510000,
        //当前行政区,设置参数的时候最好与initAreaCode一致
        currentAreaCode: 510000,

        //投影颜色
        shadowFillColor: '#00B1FF',

        //行政区样式
        areaFillColor: ['#1f377e', '#0D2258'],
        areaHoverColor: '#2A70FF',
        areaStrokeColor: '#1C78FF',

        //行政区名字样式
        areaLabelFontSize: 12,
        areaLabelColor: '#00B1FF',
        //下转时父级样式
        backgroundOpacity: 0.2,
        backgroundLabelOpacity: 0.5,

        //导航栏
        breadcrumbs: [],
      }
    },
    watch: {
      currentAreaCode(value) {
        this.loadAndZoom(value)
      },
    },
    async mounted() {
      const self = this
      const svg = (self._svg = d3.select('#svg'))

      let svgEl = document.querySelector('.svg-ct')
      self._svgHeight = svgEl.clientHeight
      self._svgWidth = svgEl.clientWidth
      self._colors = d3.scaleLinear().domain([0, 21]).range(self.areaFillColor)

      svg.attr('height', self._svgHeight)
      svg.attr('width', self._svgWidth)

      /*
       * 用于缩放图层
       * */
      const g = (self._topGroup = svg.append('g'))

      /*
       * 初始化图层
       * */
      self._a1 = g.append('g').attr('level', 'province')
      self._a2 = g.append('g').attr('level', 'city')
      self._a3 = g.append('g').attr('level', 'district')
      self._a4 = g.append('g').attr('level', 'town')
      self._a5 = g.append('g').attr('level', 'village')

      self._t1 = g.append('g').attr('level', 'province')
      self._t2 = g.append('g').attr('level', 'city')
      self._t3 = g.append('g').attr('level', 'district')
      self._t4 = g.append('g').attr('level', 'town')
      self._t5 = g.append('g').attr('level', 'village')

      /*
       * 初始化投影,缩放事件
       * */
      self._geoPath = d3.geoPath()
      await self.initProjection(self.initAreaCode)
      self._zoom = d3.zoom().scaleExtent([1, 100]).on('zoom', self.onZoom)
      this._topGroup.call(self._zoom)
      svg.on('dblclick.zoom', null).on('click', self.onSVGClick)
      self._pathGenerator = self._geoPath.projection(self._projection)

      /*
       * 加载初始化区域
       * */
      await self.loadAndZoom(self.initAreaCode)
    },
    methods: {
      /**
       * 导航栏点击事件
       * */
      onNavClick(item) {
        this.loadAndZoom(item.code)
      },
      /**
       * 加载GEOJSON,如果有缓存就走缓存
       * */
      async loadJson(code, full) {
        this._jsonCache = this._jsonCache || []

        const cache = this._jsonCache.filter((n) => n.code == code && n.full == full)[0]

        if (cache) {
          return cache.data
        }

        const json = await d3.json(`mapJson/${full ? code + '_full' : code}.json`)
        const res = this.preProcess(json)

        this._jsonCache.push({
          code: code,
          full: full ?? false,
          data: res,
        })
        return res
      },
      /**
       * 加载行政区的边界数据并缩放到该层级
       * */
      async loadAndZoom(code) {
        const self = this

        if (!self._projection) {
          await self.initProjection(code)
        }
        const shadowData = await self.loadJson(code)

        let areaData
        const level = self.getLevel(code)
        console.log(level, '==level==')
        if (level >= 3) {
          areaData = shadowData
        } else {
          areaData = await self.loadJson(code, true)
        }

        this.breadcrumbs = this.breadcrumbs.slice(0, level - self.getLevel(self.initAreaCode))
        this.breadcrumbs.push({
          code: code,
          name: shadowData.features[0].properties.name,
        })

        this['_a' + level].selectAll('g').transition().style('opacity', 0).remove()
        this['_t' + level].selectAll('g').transition().style('opacity', 0).remove()

        const shadow = this['_a' + level].append('g')
        shadow
          .attr('shadow', code)
          .style('opacity', 0)
          .selectAll('path')
          .data(shadowData.features)
          .join('path')
          .style('fill', self.shadowFillColor)
          .attr('d', self.buildWall)

        const areaGroup = this['_a' + level].append('g')
        areaGroup
          .attr('boundary', code)
          .style('opacity', 0)
          .selectAll('path')
          .data(areaData.features)
          .join('path')
          .style('stroke', self.areaStrokeColor)
          .style('fill', (d, i) => {
            return self._colors(i)
          })
          .attr(this.initFillColorAttributeName, (d, i) => {
            return self._colors(i)
          })
          .attr('boundary', (d) => d.properties.adcode)
          .attr('d', this._pathGenerator)

        const labelGroup = this['_t' + level].append('g')
        labelGroup
          .attr('label', code)
          .style('opacity', 0)
          .selectAll('text')
          .data(areaData.features)
          .join('text')
          .attr('code', (d) => d.properties.adcode)
          .attr('font-size', self.areaLabelFontSize)
          .attr('text-anchor', 'middle')
          .style('fill', self.areaLabelColor)
          .attr('x', (d) => this._geoPath.centroid(d)[0])
          .attr('y', (d) => this._geoPath.centroid(d)[1])
          .attr('dy', (d) => {
            let dy = 0
            if (d.properties.name == '泸州市') dy += 35
            return dy
          })
          .text((d) => d.properties.name)

        const animate = [shadow, areaGroup, labelGroup]
        animate.forEach((n) => n.transition().style('opacity', 1))
        /**
         *小于当前层级的设置透明度,大于当前层级的消失
         */
        for (let i = 1; i <= 5; i++) {
          const cuAreaLayer = this['_a' + i]
          const cuLabelLayer = this['_t' + i]

          if (i < level) {
            cuAreaLayer.selectAll('g[shadow]').transition().style('opacity', 0)
            cuAreaLayer
              .selectAll('g[boundary]')
              .transition()
              .style('opacity', self.backgroundOpacity)
            cuLabelLayer
              .selectAll('g[label]')
              .transition()
              .style('opacity', self.backgroundLabelOpacity)
            console.log(123)
          } else if (i > level) {
            console.log(456)
            ;[cuAreaLayer, cuLabelLayer].forEach((n) => {
              n.selectAll('g').transition().style('opacity', 0).remove()
            })
          }
        }
        this._svg.selectAll(`g[label] text`).style('opacity', null)
        const codePath = this.getCodePath(code)
        console.log(codePath, '==codePath==', code)
        codePath.forEach((n) => {
          if (n != code || level < 3) {
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
              .scale(self.getScale(shadowData))
              .translate(...self.getCenterTranslate(shadowData)),
          )
          .on('end', () => {
            /**
             *动画完毕以后再添加鼠标响应事件,避免动画时触发鼠标相应
             **/
            areaGroup
              .selectAll('path')
              .on('mouseover', self.onAreaMouseOver)
              .on('mouseout', self.onAreaMouseOut)
              .on('click', self.onAreaClick)
            labelGroup
              .selectAll('text')
              .on('mouseover', self.onAreaMouseOver)
              .on('mouseout', self.onAreaMouseOut)
              .on('click', self.onAreaClick)
          })
      },
      /**
       *返回行政区代码层级,
       *1：省、市级;
       *2：市、州级;
       *3：区、县级;
       *4：乡镇、街道级;
       *5：村、社区级
       **/
      getLevel(code) {
        let codeStr = code
        if (typeof codeStr == 'number') {
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
            throw '错误的行政区代码,请使用6位数字或者12位数字'
        }
      },
      /**
       * 鼠标mouseover事件响应
       * */
      onAreaMouseOver(e, data) {
        const self = this
        e?.stopPropagation()
        const cuNode = this._svg.selectAll('path[boundary]').filter((n) => n === data)
        cuNode
          .attr(self.beforeMouseoverFillColorAttributeName, cuNode.style('fill'))
          .style('fill', self.areaHoverColor)
      },
      /**
       * 鼠标mouseout事件响应
       * */
      onAreaMouseOut(e, data) {
        const self = this
        e?.stopPropagation()
        this._svg
          .selectAll('path[boundary]')
          .filter((n) => n === data)
          .style('fill', function () {
            const node = d3.select(this),
              color =
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
        data.features.forEach((n) => {
          n.geometry.coordinates.forEach((m) => m.forEach((l) => l.reverse()))
        })
        return data
      },
      /**
       * 构建伪投影
       * */
      buildWall(geoData) {
        const source = this._pathGenerator(geoData)
        const circles = source.match(/M.*?Z/gi).map((n) => {
          return n.match(/[MLZ](\d*.\d*,\d*.\d*)?/gi).map((n) => {
            if (n[0] === 'Z')
              return {
                command: n[0],
              }
            return {
              command: n[0],
              x: parseFloat(n.substr(1).split(',')[0]),
              y: parseFloat(n.substr(1).split(',')[1]),
            }
          })
        })
        const distance = this.getShadowDeep(geoData)
        return circles
          .map((circle) => {
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
                  return `M${n.x},${n.y}L${next.x},${next.y}L${next.x},${next.y + distance}L${
                    n.x
                  },${n.y + distance}Z`
                }

                return `M${n.x},${n.y}L${n.x},${n.y + distance}L${next.x},${next.y + distance}L${
                  next.x
                },${next.y}Z`
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
        this.currentAreaCode = data.properties.adcode
      },
      /**
       *  按照数据计算缩放
       * */
      getScale(data) {
        const [[x0, y0], [x1, y1]] = this._geoPath.bounds(data)
        console.log(
          Math.min(100, 1 / Math.max((x1 - x0) / this._svgWidth, (y1 - y0) / this._svgHeight)),
          '===getScale===',
        )
        return Math.min(100, 1 / Math.max((x1 - x0) / this._svgWidth, (y1 - y0) / this._svgHeight))
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
        console.log('onZoom', e.transform)

        this._topGroup.attr(
          'transform',
          `translate(${e.transform.x},${e.transform.y}) scale(${e.transform.k})`,
        )
        this._svg.selectAll('g[boundary] path').style('stroke-width', 1 / e.transform.k)
        this._svg.selectAll('text').style('font-size', (1 / e.transform.k) * this.areaLabelFontSize)
      },
      /**
       * SVG全局点击捕获
       * */
      onSVGClick() {
        this.currentAreaCode = this.initAreaCode
      },
      /**
       * 按照行政区进行投射初始化
       * */
      async initProjection(code) {
        if (this._projection) {
          console.warn('一个实例只能有一个Projection')
          return this._projection
        }

        const data = await this.loadJson(code)

        this._projection = d3.geoMercator().fitExtent(
          [
            [this.padding, this.padding],
            [this._svgWidth - this.padding * 2, this._svgHeight - this.padding * 2],
          ],
          data,
        )

        return this._projection
      },
      /**
       * 下载SVG图片
       * */ onDownloadBtnClick() {
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
        if (typeof codeStr == 'number') {
          codeStr = codeStr.toString()
        }

        let lengthTmp = length
        if (!lengthTmp) {
          lengthTmp = 6
        }

        const res = [],
          buildPathFn = (n, interval) => {
            if (codeStr.length >= n && codeStr.slice(n - interval, n) != ''.padEnd(interval, '0'))
              res.push(codeStr.slice(0, n))
          }
        ;[2, 4, 6].forEach((n) => {
          buildPathFn(n, 2)
        })
        ;[9, 12].forEach((n) => {
          buildPathFn(n, 3)
        })
        return res.map((n) => n.padEnd(lengthTmp, '0'))
      },
    },
  }
</script>

<style lang="scss">
  html,
  body,
  #app {
    height: 100vh;
    width: 100%;

    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #app {
    background: url('assets/bg.png') center;
    background-size: cover;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .nav {
    background-color: white;
    padding: 0 10px;
    height: 50px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;

    .nav-link {
      font-weight: bold;
      cursor: pointer;
    }
  }

  .svg-ct {
    height: calc(100vh - 50px);
    width: 100%;
  }

  .btn {
    background-color: white;
    font-size: 12px;
  }
  text,
  path[boundary] {
    cursor: pointer;
  }
</style>
