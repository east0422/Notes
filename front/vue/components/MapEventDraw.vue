<template>
  <el-drawer
    :model-value="props.drawerVisible"
    :show-close="false"
    size="80%"
    :append-to-body="appendToBody"
    :withHeader="false"
    custom-class="drawer-demo">
    <div class="content-container mapinit">
      <el-container>
        <el-header height="50px">
          <div class="left">
            <el-button circle @click="close" size="small">
              <template #icon><IEpArrowLeft /></template>
            </el-button>
            <span class="back_title">返回</span>
            <el-divider direction="vertical"></el-divider>
            <span class="title">标记-{{ title }}</span>
          </div>
          <div class="right"></div>
        </el-header>
        <el-main style="display: flex">
          <Map
            enableGridTool
            ref="mapRef"
            @mapLoaded="mapLoaded"
            id="mapEvent"
            @drawSelectionChange="drawSelectionChange"
            showMainBoundary></Map>
        </el-main>
        <el-footer height="80px" v-if="enableEdit">
          <div class="left">
            <el-button @click="draw('draw_point')" v-if="enablePoint">
              <template #icon><IEpAddLocation /></template>
              点
            </el-button>
            <el-button @click="draw('draw_polygon')" v-if="enablePolygon">
              <span class="icon-polygon"></span>
              多边形
            </el-button>
            <el-button @click="draw('draw_rectangle')" v-if="enableRectangle">
              <template #icon><span class="icon-rectangle"></span></template>
              矩形
            </el-button>
            <el-button @click="draw('draw_circle')" v-if="enableCircle">
              <template #icon><span class="icon-circle"></span></template>
              圆
            </el-button>
            <el-button @click="deleteGeometry" v-if="enableDelete">
              <template #icon><IEpDelete /></template>
              删除
            </el-button>
          </div>
          <div style="width: 345px" v-if="enableInput">
            <el-input placeholder="请输入geometryGeojson" v-model="state.geometryInput" clearable>
              <template v-slot:append>
                <el-button class="toright" @click="updateGeometry">更新</el-button>
              </template>
            </el-input>
          </div>
          <el-button v-if="enableProject" @click="state.projectDialogVisible = true">
            <template #icon><IEpGrid /></template>
            投影
          </el-button>
          <div>
            <span v-if="enableArea">
              <div v-show="state.initArea > 0">
                实际绘制面积：{{
                  state.unit == '平方米'
                    ? state.initArea
                    : Number((state.initArea * 0.0015).toFixed(2))
                }}
                <el-tag
                  type="info"
                  @click="changeUnit"
                  class="system-theme-font-color"
                  style="cursor: pointer">
                  {{ state.unit }}
                </el-tag>
              </div>
            </span>
          </div>
          <!-- 采集面板组件未移进来，点击无效  -->
          <!-- <el-button v-if="enableGetData" @click="state.showGetData = !state.showGetData">
            {{ state.showGetData ? '关闭采集画板' : '打开采集画板' }}
          </el-button> -->
          <div class="right">
            <el-button class="large default-drawer-btn" plain @click="close">取消</el-button>
            <el-button
              class="large default-drawer-btn"
              type="primary"
              @click="save"
              :disabled="disablebtn">
              确定
            </el-button>
          </div>
        </el-footer>
      </el-container>
    </div>
    <el-dialog
      title="投影坐标转换"
      v-model:visible="state.projectDialogVisible"
      width="30%"
      :modal="false"
      append-to-body>
      <div style="margin: 0px 30px">
        <div style="display: flex; align-items: center; margin-top: 10px">
          <span style="margin-right: 10px">EPSG代码:</span>
          <el-input v-model="epsgCode" placeholder="请输入EPSG代码" style="width: 180px"></el-input>
          <el-divider direction="vertical"></el-divider>
          <span style="width: 200px; font-size: 12px; color: #ccc">
            您需要知道投影坐标的坐标系EPSG代号，否则无法得到正确结果！
          </span>
        </div>
        <div style="display: flex; align-items: center; margin-top: 10px">
          <span>投影坐标：</span>
          <el-input
            v-model="projectCoordString"
            placeholder="请输入内容"
            type="textarea"
            :rows="7"
            style="width: 400px"></el-input>
        </div>
        <div style="margin-top: 10px; margin-left: 30px">
          <el-button @click="openPreviewCoordDialog()">格式提取预览</el-button>
        </div>
        <div style="margin-top: 10px; margin-left: 30px" v-if="previewCoord">
          <div v-for="(arr, index) in previewCoord" :key="index">
            <el-tag style="margin-bottom: 3px" type="info">
              {{ arr.join(', ') }}
            </el-tag>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="((dialogVisible = false), (previewCoord = ''))">取 消</el-button>
          <el-button type="primary" @click="updateProject">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<script setup>
  import { area, polygon } from '@turf/turf'
  import transform from '@ryry886/coord-transform'
  import epsg from 'epsg'
  import { ElMessage } from 'element-plus'
  const props = defineProps({
    drawerVisible: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    backgroundData: {
      type: Array
    },
    title: {
      type: String,
      default: ''
    },
    enablePoint: {
      type: Boolean,
      default: true
    },
    enablePolygon: {
      type: Boolean,
      default: false
    },
    enableEdit: {
      type: Boolean,
      default: true
    },
    enableRectangle: {
      type: Boolean,
      default: false
    },
    enableCircle: {
      type: Boolean,
      default: false
    },
    enableDelete: {
      type: Boolean,
      default: true
    },
    enableInput: {
      type: Boolean,
      default: true
    },
    enableArea: {
      type: Boolean,
      default: true
    },
    enableGetData: {
      type: Boolean,
      default: true
    },
    enableMulti: {
      type: Boolean,
      default: false
    },
    enableProject: {
      type: Boolean,
      default: false
    },
    enableFit: {
      type: Boolean,
      default: false
    },
    menuType: {
      type: String,
      default: 'draw'
    },
    enableOutput: {
      type: Boolean,
      default: false
    },
    // Dialog 自身是否插入至 body 元素上
    appendToBody: {
      type: Boolean,
      default: false
    },
    accomplishFunc: {
      // 父组件中传递过来的回调方法(默认null则执行confirmMethod中对应方法)
      type: Function,
      default: null
    },
    disablebtn: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['update:drawerVisible', 'confirm', 'close', 'open', 'mapAccomplish'])
  const mapRef = ref()
  const state = reactive({
    // 弹出层显隐
    geometryInput: '',
    showGetData: false,
    drawTool: null,
    initArea: 0,
    unit: '亩',
    projectDialogVisible: false,
    epsgCode: '',
    projectCoordString: '',
    previewCoord: ''
  })
  const localDetail = reactive({
    ...props.detail
  })

  const mapLoaded = async () => {
    switch (props.menuType) {
      case 'draw':
        break
      case 'entityBase':
        await getCommonList('entityBasePage', 'industryName')
        break
      default:
        break
    }
    if (props.detail.geometry) {
      //绘制
      const polygon = JSON.parse(props.detail.geometry)
      let feature
      switch (polygon.type) {
        case 'Polygon':
        case 'Point':
          feature = {
            type: 'Feature',
            properties: { name: props.detail.drawName },
            geometry: polygon
          }
          mapRef.value.addDrawGeometry(feature)
          break
        case 'MultiPolygon':
          polygon.coordinates.forEach((item) => {
            const g = {
              type: 'Polygon',
              coordinates: item
            }
            feature = {
              type: 'Feature',
              properties: { name: props.detail.drawName },
              geometry: g
            }
            mapRef.value.addDrawGeometry(feature)
          })
          break
        default:
          break
      }
      // 缩放
      if (props.enableFit) {
        const bounds = mapRef.value.getBounds(polygon)
        mapRef.value.getMap().fitBounds(bounds, {
          padding: { top: 10, bottom: 25, left: 15, right: 5 },
          maxZoom: 19
        })
      } else {
        const bounds = mapRef.value.getBounds(polygon)
        mapRef.value.getMap().fitBounds(bounds, {
          padding: { top: 10, bottom: 25, left: 15, right: 5 },
          maxZoom: mapRef.value.getMap().getZoom()
        })
      }
      if (!props.enableEdit) {
        draw('staticMode')
      }
    }
  }
  const getProjectList = async () => {
    const { code, data } = await $api.topeakBusinessServer
      .projectPlanPage({
        page: {
          current: 0,
          size: -1
        },
        search: {}
      })
      .catch((err) => err)
    if (code !== 200) {
      return Elmessage.error('获取规划建设列表数据失败')
    }
    const features = []
    data.records.forEach((item) => {
      if (item.geometry) {
        const feature = {
          type: 'Feature',
          properties: { name: item.projectName, id: item.id },
          geometry: JSON.parse(item.geometry)
        }
        features.push(feature)
      }
    })
    const FeatureCollection = {
      type: 'FeatureCollection',
      features: features
    }
    mapRef.value.getMap().addSource('project-source', {
      type: 'geojson',
      data: FeatureCollection
    })
    mapRef.value.getMap().addLayer({
      id: 'project-layer',
      type: 'fill',
      source: 'project-source',
      filter: ['!=', 'id', props.detail.id],
      paint: {
        'fill-color': '#0DBC79',
        'fill-opacity': 0.5,
        'fill-outline-color': '#fff'
      }
    })
    mapRef.value.getMap().addLayer({
      id: 'project-line-layer',
      type: 'line',
      source: 'project-source',
      filter: ['!=', 'id', props.detail.id],
      paint: {
        'line-color': '#fff',
        'line-width': 2
      }
    })
    mapRef.value.getMap().addLayer({
      id: 'project-layer-label',
      type: 'symbol',
      source: 'project-source',
      filter: ['!=', 'id', props.detail.id],
      paint: {
        'text-color': 'rgba(255,255,255,1)',
        'text-halo-color': 'rgba(0, 0, 0,1)',
        'text-halo-width': 2
      },
      layout: {
        'text-field': ['get', 'name'],
        'text-variable-anchor': ['center'],
        'text-justify': 'auto'
      }
    })
  }
  const changeUnit = () => {
    state.unit = state.unit == '平方米' ? '亩' : '平方米'
  }
  const drawSelectionChange = (e) => {
    if (e.features.length > 0) {
      let calArea = 0
      e.features.forEach((f) => {
        if (f.geometry.type != 'Point') {
          calArea += area(f.geometry)
        }
      })
      state.initArea = Number(calArea.toFixed(2))
      if (props.enableOutput) {
        state.geometryInput = JSON.stringify(e.features[0].geometry)
      }
    } else {
      state.initArea = 0
      state.geometryInput = ''
    }
  }
  const getCommonList = async (api, drawName) => {
    const { code, data } = await $api.topeakBusinessServer[api]({
      page: { current: 1, size: 100000 },
      search: {}
    }).catch((err) => err)
    if (code !== 200) {
      return Elmessage.error('获取列表数据失败')
    }
    const features = []
    data.records.forEach((item) => {
      if (item.geometry) {
        const feature = {
          type: 'Feature',
          properties: { name: item[drawName], id: item.id },
          geometry: JSON.parse(item.geometry)
        }
        features.push(feature)
      }
    })
    const FeatureCollection = {
      type: 'FeatureCollection',
      features: features
    }
    mapRef.value.getMap().addSource('common-source', {
      type: 'geojson',
      data: FeatureCollection
    })
    mapRef.value.getMap().addLayer({
      id: 'common-layer',
      type: 'circle',
      source: 'common-source',
      filter: ['!=', 'id', props.detail.id],
      paint: {
        'circle-color': '#0DBC79',
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    })
    mapRef.value.getMap().addLayer({
      id: 'common-layer-label',
      type: 'symbol',
      source: 'common-source',
      filter: ['!=', 'id', props.detail.id],
      paint: {
        'text-color': 'rgba(255,255,255,1)',
        'text-halo-color': 'rgba(0, 0, 0,1)',
        'text-halo-width': 2
      },
      layout: {
        'text-field': ['get', 'name'],
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-radial-offset': 0.8,
        'text-justify': 'auto'
      }
    })
  }
  const getCommonLineList = async (api, drawName) => {
    const { code, data } = await $api.topeakBusinessServer[api]({
      page: { current: 1, size: 100000 },
      search: {}
    }).catch((err) => err)
    if (code !== 200) {
      return Elmessage.error('获取列表数据失败')
    }
    const features = []
    data.records.forEach((item) => {
      if (item.geometry) {
        const feature = {
          type: 'Feature',
          properties: { name: item[drawName], id: item.id },
          geometry: JSON.parse(item.geometry)
        }
        features.push(feature)
      }
    })
    const FeatureCollection = {
      type: 'FeatureCollection',
      features: features
    }
    mapRef.value.getMap().addSource('land-source', {
      type: 'geojson',
      data: FeatureCollection
    })
    mapRef.value.getMap().addLayer({
      id: 'land-layer',
      type: 'fill',
      source: 'land-source',
      filter: ['!=', 'id', props.detail.id],
      paint: {
        'fill-color': '#0DBC79',
        'fill-opacity': 0.5,
        'fill-outline-color': '#fff'
      }
    })
    mapRef.value.getMap().addLayer({
      id: 'land-line-layer',
      type: 'line',
      source: 'land-source',
      filter: ['!=', 'id', props.detail.id],
      paint: {
        'line-color': '#fff',
        'line-width': 2
      }
    })
    mapRef.value.getMap().addLayer({
      id: 'land-layer-label',
      type: 'symbol',
      source: 'land-source',
      filter: ['!=', 'id', props.detail.id],
      paint: {
        'text-color': 'rgba(255,255,255,1)',
        'text-halo-color': 'rgba(0, 0, 0,1)',
        'text-halo-width': 2
      },
      layout: {
        'text-field': ['get', 'name'],
        'text-variable-anchor': ['center'],
        'text-radial-offset': 0.5,
        'text-justify': 'auto'
      }
    })
  }
  const getArea = (geometry) => {
    let drawPolygon = null
    let drawArea = 0
    switch (geometry.type) {
      case 'Polygon':
        drawPolygon = polygon(geometry.coordinates)
        drawArea = area(drawPolygon)
        break
      case 'MultiPolygon':
        geometry.coordinates.forEach((item) => {
          drawPolygon = polygon(item)
          drawArea += area(drawPolygon)
        })
        break
      default:
        break
    }
    return Number(drawArea.toFixed(2))
  }
  const checkGeojson = (geosjonString) => {
    try {
      JSON.parse(geosjonString)
      return true
    } catch (error) {
      return false
    }
  }
  const openPreviewCoordDialog = () => {
    const geometry = formatProjectCoordString(state.projectCoordString)
    state.projectCoordString = geometry.coordinates[0]
  }
  const formatProjectCoordString = (projectCoordString) => {
    const regex = /(\d+\.\d+|\d+)[,\uff0c](\d+\.\d+|\d+)/g
    const coordinates = []
    let match
    while ((match = regex.exec(projectCoordString))) {
      coordinates.push([parseFloat(match[1]), parseFloat(match[2])])
    }
    return {
      type: 'Polygon',
      coordinates: [coordinates]
    }
  }
  const updateProject = () => {
    if (!state.epsgCode) {
      ElMessage.info('请输入EPSG代码')
      return
    }
    let geometry = formatProjectCoordString(state.projectCoordString)
    if (
      geometry.coordinates[0][0].toString() !=
      geometry.coordinates[0][geometry.coordinates[0].length - 1].toString()
    ) {
      geometry.coordinates[0].push(geometry.coordinates[0][0])
    }
    if (geometry.coordinates[0].length < 4) {
      Elmessage.info('有效坐标个数少于三个')
      return
    }
    try {
      geometry = transform(geometry, {
        from: epsg[`EPSG:${state.epsgCode}`],
        to: '+proj=longlat +ellps=GRS80 +no_defs',
        proj4: true
      })
    } catch (error) {
      Elmessage.info('请检查坐标输入格式')
    }

    const feature = {
      type: 'Feature',
      properties: { name: props.detail.drawName },
      geometry: geometry
    }
    mapRef.value.addDrawGeometry(feature)
    const bboxPolygon = mapRef.value.getBounds(geometry)
    mapRef.value.getMap().fitBounds(bboxPolygon, {
      padding: { top: 10, bottom: 25, left: 15, right: 5 },
      maxZoom: 19
    })
    state.projectDialogVisible = false
    return true
  }
  const updateGeometry = () => {
    //先校验是否geojson
    const bool = checkGeojson(state.geometryInput)
    if (bool) {
      const geometry = JSON.parse(state.geometryInput)
      if (geometry.type && geometry.coordinates) {
        const feature = {
          type: 'Feature',
          properties: { name: props.detail.drawName },
          geometry: geometry
        }
        mapRef.value.addDrawGeometry(feature)
        const bounds = mapRef.value.getBounds(geometry)
        mapRef.value.getMap().fitBounds(bounds, {
          padding: { top: 10, bottom: 25, left: 15, right: 5 },
          maxZoom: 19
        })
        return true
      }
    }
    return Elmessage.info('请检查输入格式是否正确')
  }
  // 关闭弹窗
  const close = () => {
    emits('confirm', 'getList')
    emits('update:drawerVisible', false)
  }
  const draw = (type) => {
    mapRef.value.setDrawMode(type, props.detail.drawName)
  }
  const deleteGeometry = () => {
    mapRef.value.deleteSelectGeometry()
    state.geometryInput = ''
  }

  const saveGeometry = async () => {
    mapRef.value.selectDrawGeometry() //重置模式，防止开启绘制后，不绘制，导致添加空图形
    const geos = mapRef.value.getAllDrawGeometry()
    //首先判断是否为空
    if (geos.length < 1) {
      localDetail.geometry = ''
      if (props.detail.needAddress) {
        localDetail.address = null
      }
      if (props.detail.needArea) {
        localDetail.needArea = null
      }
      localDetail.isCograph = 'no'
    } else {
      let polygon = null
      if (props.enableMulti) {
        polygon = combinePolygonGeometry(geos)
        localDetail.geometry = JSON.stringify(polygon)
      } else if (geos.length > 1) {
        ElMessage.warning('只能保存一个标记，请删除多余标记')
        return false
      } else {
        polygon = geos[0].geometry
        localDetail.geometry = JSON.stringify(polygon)
        //计算位置
        if (localDetail.needAddress && polygon.type == 'Point') {
          const res = await mapRef.value.getGeoAddress(polygon.coordinates)
          console.log(polygon.coordinates)
          // const res = await $api.topeakBusinessServer.drEarlyWarningAddressCoordinates({
          //   coordinates: JSON.stringify(polygon.coordinates)
          // })
          localDetail.address = res.result.formatted_address
        }
      }
      //计算面积
      if (localDetail.needArea) {
        const area = getArea(polygon)
        localDetail.area = area
      }
    }
    return true
  }
  const save = async () => {
    const bool = await saveGeometry()
    if (bool) {
      if (typeof props.accomplishFunc == 'function') {
        props.accomplishFunc(props.detail)
      } else {
        emits('mapAccomplish', localDetail)
      }
      close()
    }
  }
</script>

<style lang="scss" scoped>
  .mapinit {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  .el-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-main {
    text-align: center;
    padding: 0;
  }

  .back_title {
    font-size: 18px;
    color: #b0b0b0;
    font-weight: 400;
    margin-left: 10px;
    height: 28px;
    line-height: 28px;
  }
  .title {
    font-size: 18px;
    height: 28px;
    font-weight: bold;
    line-height: 28px;
    //   border-bottom: 2px solid;
  }
  .toright {
    font-weight: 400;
    line-height: 27px;
    font-size: 16px;
    // color: #7F7F7F !important;
    border: #7f7f7f;
  }
  .toright:hover {
    color: #099d74;
  }
  .left {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-divider {
    margin: 0px 16px;
  }
  .icon-polygon {
    width: 12px;
    height: 12px;
    background: url('#{$mapsImgUrl}/icon-polygon.png') no-repeat center;
    background-size: contain;
  }
  .icon-rectangle {
    width: 12px;
    height: 12px;
    background: url('#{$mapsImgUrl}/icon-rectangle.png') no-repeat center;
    background-size: contain;
  }
  .icon-circle {
    text-align: center;
    width: 12px;
    height: 12px;
    background: url('#{$mapsImgUrl}/icon-circle.png') no-repeat center;
    background-size: contain;
  }
</style>

<style>
  .marker {
    /* display: block; */
    border-width: 3px;
    border-color: #fff;
    border-style: solid;
    border-radius: 50%;
    cursor: pointer;
    padding: 0px;
  }
</style>
