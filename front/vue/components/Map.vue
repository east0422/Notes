<template>
  <div class="container" v-loading="loading">
    <div :id="id" style="width: 100%; height: 100%"></div>
    <div class="mapStyleChoose">
      <div :class="imgClass" @click="changeMapStyle('img')">影像图</div>
      <div :class="streetClass" @click="changeMapStyle('street')">街道图</div>
    </div>
  </div>
</template>

<script>
  import styles from '../../utils/mapDrawStyle'
  import maplibregl from 'maplibre-gl'
  import '../../../node_modules/maplibre-gl/dist/maplibre-gl.css'
  import MapboxDraw from '@mapbox/mapbox-gl-draw'
  import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
  import StaticMode from '@mapbox/mapbox-gl-draw-static-mode'
  import axios from 'axios'
  import { gisServerUrl } from '@/config'
  import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'
  import DrawCircle from 'mapbox-gl-draw-circle-mode'
  import { ElMessage } from 'element-plus'
  export default {
    props: {
      id: {
        type: String,
        default: 'map'
      },
      showMainBoundary: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        tenantId: JSON.parse(sessionStorage.user || '{}').userInfo?.tenantId,
        imgClass: 'choosed system-theme-background-color',
        streetClass: 'unchoosed',
        mapConfig: sessionStorage.mapConfig ? JSON.parse(sessionStorage.mapConfig) : null,
        distCode: sessionStorage.distCode,
        tenantName: sessionStorage.tenantName,
        loading: false
      }
    },
    methods: {
      mapLoad() {
        this.initDraw()
        if (this.boundary) {
          this.initBoundary()
        }
        if (this.showMainBoundary) {
          this.initMainBoundary()
        }
        if (this.hasImage == 'on') {
          this.addHighImageLayer()
        }
        //先加载高清影像，防止过多地图瓦片加载导致高清影像加载慢
        setTimeout(() => {
          this.initBaseLayer()
          this.$emit('mapLoaded')
        }, 100)
      },
      customParamsSerializer(params) {
        const parts = []
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            const value = params[key]
            if (typeof value === 'object' && value !== null) {
              // 如果值是对象，将其转换为 JSON 字符串
              parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`)
            } else {
              // 普通值直接编码添加
              parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            }
          }
        }
        return parts.join('&')
      },
      async getGeoAddress(coord) {
        // const loading = this.$loading({
        //   // lock: true,
        //   text: '解析地理地址中...',
        //   // spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // })
        this.loading = true
        const poststr = JSON.stringify({
          lon: coord[0],
          lat: coord[1],
          ver: `1`
        })
        const { status, data } = await axios
          .get('https://api.tianditu.gov.cn/geocoder?', {
            timeout: 5000,
            params: {
              postStr: poststr,
              type: 'geocode',
              tk: this.mapSourceToken
            },
            paramsSerializer: this.customParamsSerializer
          })
          .catch((err) => err)
        // loading.close()
        this.loading = false
        if (status == 200) {
          if (data.result && data.result.formatted_address) {
            return data
          }
          ElMessage.info('地址解析失败，请手动填写地址或稍后再试')
          return {
            result: {
              formatted_address: this.tenantName
            }
          }
        }
        ElMessage.info('地址解析失败，请手动填写地址或稍后再试')
        return {
          result: {
            formatted_address: this.tenantName
          }
        }
      },
      changeMapStyle(type) {
        if (this.map.getLayer('tdt')) {
          this.map.removeLayer('tdt')
        }
        if (this.map.getLayer('tdt_label')) {
          this.map.removeLayer('tdt_label')
        }
        if (this.map.getLayer('high-raster-tiles')) {
          this.map.removeLayer('high-raster-tiles')
        }
        switch (type) {
          case 'img':
            this.imgClass = 'choosed system-theme-background-color'
            this.streetClass = 'unchoosed'
            this.map.addLayer(
              {
                id: 'tdt',
                type: 'raster',
                source: 'tdt_img',
                minzoom: 0,
                maxzoom: 24
              },
              '0'
            )
            this.map.addLayer(
              {
                id: 'tdt_label',
                type: 'raster',
                source: 'tdt_img_label',
                minzoom: 0,
                maxzoom: 24
              },
              '0'
            )
            if (this.map.getSource('high-raster-tiles')) {
              this.map.addLayer(
                {
                  id: 'high-raster-tiles',
                  type: 'raster',
                  source: 'high-raster-tiles',
                  minzoom: this.hasImageMinZoom
                },
                '1'
              )
            }
            break
          case 'street':
            this.streetClass = 'choosed system-theme-background-color'
            this.imgClass = 'unchoosed'
            this.map.addLayer(
              {
                id: 'tdt',
                type: 'raster',
                source: 'tdt_vec',
                minzoom: 0,
                maxzoom: 24
              },
              '0'
            )
            this.map.addLayer(
              {
                id: 'tdt_label',
                type: 'raster',
                source: 'tdt_vec_label',
                minzoom: 0,
                maxzoom: 24
              },
              '0'
            )
            break
          default:
            break
        }
      },
      async initMapConfig() {
        const { code, data } = await $api.topeakPlatformServer
          .tenantDetailId({ id: this.tenantId })
          .catch((err) => err)
        if (code !== 200) {
          this.useDefaultMapConfig()
          this.$message.closeAll()
          this.$message({
            message: '获取地图配置信息出错！请联系系统管理员',
            type: 'error',
            customClass: 'mzindex'
          })
        } else {
          this.distCode = data.distCode
          this.mapConfig = data.bcTenantMapConfigAO
          sessionStorage.distCode = this.distCode
          sessionStorage.mapConfig = JSON.stringify(this.mapConfig)
          this.useSessionMapConfig()
        }
      },
      initMap() {
        const map = new maplibregl.Map({
          container: this.id, // container ID
          style: {
            version: 8,
            glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
            sources: {},
            layers: [
              {
                id: '0',
                type: 'background',
                layout: {
                  visibility: 'none'
                }
              },
              {
                id: '1',
                type: 'background',
                layout: {
                  visibility: 'none'
                }
              },
              {
                id: '2',
                type: 'background',
                layout: {
                  visibility: 'none'
                }
              },
              {
                id: '3',
                type: 'background',
                layout: {
                  visibility: 'none'
                }
              },
              {
                id: '4',
                type: 'background',
                layout: {
                  visibility: 'none'
                }
              }
            ]
          },
          center: this.initCenter,
          zoom: this.initZoom, // starting zoom
          minZoom: 5,
          attributionControl: false
        })
        return map
      },
      async initMainBoundary() {
        const { code, data } = await $api.topeakPlatformServer
          .bcBoundaryDetail({
            distCode: sessionStorage.distCode,
            whetherMainCenter: true
          })
          .catch((err) => err)
        if (code !== 200 || !data) {
          return this.$message.error('获取数据失败')
        }
        if (data.boundary) {
          const geometry = JSON.parse(data.boundary)
          const boundarySource = {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: geometry
            }
          }
          this.map.addSource('main-boundary', boundarySource)
          this.map.addLayer(
            {
              id: 'main-boundary',
              type: 'line',
              source: 'main-boundary', // reference the data source
              layout: {},
              paint: {
                'line-width': 3,
                'line-color': '#0080ff'
              }
            },
            '2'
          )
        }
      },
      initBoundary() {
        const boundarySource = {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: this.boundary
          }
        }
        this.map.addSource('boundary', boundarySource)
        this.map.addLayer(
          {
            id: 'boundary',
            type: 'line',
            source: 'boundary', // reference the data source
            layout: {},
            paint: {
              'line-width': 3,
              'line-color': '#0080ff'
            }
          },
          '2'
        )
      },
      initBaseLayer() {
        this.map.addSource('tdt_img', {
          type: 'raster',
          tiles: [
            `${gisServerUrl}/DataServer/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${this.mapSourceToken}`
          ],
          maxzoom: 18
        })
        this.map.addSource('tdt_img_label', {
          type: 'raster',
          tiles: [
            `${gisServerUrl}/DataServer/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${this.mapSourceToken}`
          ],
          maxzoom: 18
        })
        this.map.addSource('tdt_vec', {
          type: 'raster',
          tiles: [
            `https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${this.mapSourceToken}`
          ],
          maxzoom: 18
        })
        this.map.addSource('tdt_vec_label', {
          type: 'raster',
          tiles: [
            `https://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${this.mapSourceToken}`
          ],
          maxzoom: 18
        })
        this.map.addLayer(
          {
            id: 'tdt',
            type: 'raster',
            source: 'tdt_img',
            minzoom: 0,
            maxzoom: 24
          },
          '0'
        )
        this.map.addLayer(
          {
            id: 'tdt_label',
            type: 'raster',
            source: 'tdt_img_label',
            minzoom: 0,
            maxzoom: 24
          },
          '0'
        )
      },
      addHighImageLayer() {
        axios
          .get(`${gisServerUrl}/topeakgis_data/Tiles/${this.distCode}/Image/meta.json`)
          .then((response) => {
            let bounds = response.data.bounds
            bounds = [bounds.west, bounds.south, bounds.east, bounds.north]
            if (this.map.getLayer('high-raster-tiles')) {
              this.map.removeLayer('high-raster-tiles')
            }
            if (this.map.getSource('high-raster-tiles')) {
              this.map.removeSource('high-raster-tiles')
            }
            const highSource = {
              type: 'raster',
              tiles: [
                `${gisServerUrl}/topeakgis_data/Tiles/${this.distCode}/Image/{z}/{x}/{y}.png`
              ],
              tileSize: 256,
              bounds: bounds
            }
            this.map.addSource('high-raster-tiles', highSource)
            this.map.addLayer(
              {
                id: 'high-raster-tiles',
                type: 'raster',
                source: 'high-raster-tiles',
                minzoom: this.hasImageMinZoom
              },
              '1'
            )
          })
      },
      initDraw() {
        const modes = MapboxDraw.modes
        modes.draw_rectangle = DrawRectangle
        modes.staticMode = StaticMode
        modes.draw_circle = DrawCircle
        this.draw = new MapboxDraw({
          displayControlsDefault: false,
          defaultMode: 'simple_select',
          styles: styles,
          userProperties: true
        })
        this.map.addControl(this.draw)
        this.map.on('draw.create', (e) => {
          this.draw.setFeatureProperty(e.features[0].id, 'name', this.drawName)
        })
        this.map.on('draw.selectionchange', (e) => {
          this.$emit('drawSelectionChange', e)
        })
        return this.draw
      },
      setDrawMode(type, name) {
        if (this.draw) {
          this.drawName = name
          return this.draw.changeMode(type)
        }
      },

      deleteSelectGeometry() {
        if (this.draw) {
          const ids = this.draw.getSelectedIds()
          this.draw.delete(ids)
        }
      },
      deleteDrawGeometry() {
        if (this.draw) {
          this.draw.deleteAll()
        }
      },
      getAllDrawGeometry() {
        if (this.draw) {
          return this.draw.getAll().features
        }
        return []
      },
      addDrawGeometry(geometry) {
        if (this.draw) {
          this.draw.add(geometry)
        }
      },
      selectDrawGeometry() {
        if (this.draw) {
          return this.draw.changeMode('simple_select')
        }
      },
      initMarker(el, center) {
        new maplibregl.Marker(el).setLngLat(center).addTo(this.map)
      },
      getBounds(geometry) {
        const bounds = new maplibregl.LngLatBounds()
        switch (geometry.type) {
          case 'Point':
            bounds.extend(geometry.coordinates)
            break
          case 'Polygon':
            geometry.coordinates[0].forEach((coord) => {
              bounds.extend(coord)
            })
            break
          case 'MultiPolygon':
            geometry.coordinates.forEach((item) => {
              item[0].forEach((coord) => {
                bounds.extend(coord)
              })
            })
            break
          default:
            break
        }
        return bounds
      },
      getMap() {
        return this.map
      },
      useSessionMapConfig() {
        this.initCenter = this.mapConfig.centerGeometry
          ? JSON.parse(this.mapConfig.centerGeometry).coordinates
          : [114.317183, 30.474632]
        this.initZoom = this.mapConfig.centerZoom ? Number(this.mapConfig.centerZoom) : 12
        this.hasImage = this.mapConfig.hasImage
        this.mapSource = this.mapConfig.mapSource || 'tdt'
        this.mapSourceToken = this.mapConfig.mapSourceToken || 'ab3ceef3e172e3c1af136a5bc7dab498'
        this.hasImageMinZoom = this.mapConfig.minZoom ? Number(this.mapConfig.minZoom) : 10
        this.boundary = this.mapConfig.boundaryGeometry
          ? JSON.parse(this.mapConfig.boundaryGeometry)
          : null
        if (this.mapSource && this.mapSourceToken) {
          this.map = this.initMap()
        }
        this.map.on('load', () => {
          this.mapLoad()
        })
      },
      useDefaultMapConfig() {
        this.initCenter = [114.317183, 30.474632]
        this.initZoom = 12
        this.hasImage = 'off'
        this.mapSource = 'tdt'
        this.mapSourceToken = 'ab3ceef3e172e3c1af136a5bc7dab498'
        this.hasImageMinZoom = 10
        this.boundary = null
        if (this.mapSource && this.mapSourceToken) {
          this.map = this.initMap()
        }
        this.map.on('load', () => {
          this.mapLoad()
        })
      }
    },
    beforeUnmount() {
      if (this.draw) {
        this.map.removeControl(this.draw)
        this.draw = null
      }
    },
    mounted() {
      if (this.mapConfig) {
        this.useSessionMapConfig()
      } else {
        this.initMapConfig()
      }
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .mapStyleChoose {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 180px;
    height: 39px;
    background: #ffffff;
    bottom: 60px;
    left: 19px;
    font-size: 14px;
    font-weight: 400;
    border-radius: 20px;
    line-height: 24px;
    cursor: pointer;
  }

  .choosed {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    width: 94px;
    height: 39px;
    opacity: 1;
    border-radius: 20px;
  }
  .unchoosed {
    color: #7c7c7c;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 86px;
    height: 39px;
    opacity: 1;
  }
  .system-theme-background-color {
    background-color: #36a98a;
  }
</style>

<style>
  .mzindex {
    z-index: 99999 !important;
  }
</style>
