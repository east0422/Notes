el-cascader回显

设置options进行填充
<template>
  <div>
    <el-cascader
      ref="cascader"
      v-model="distCode"
      :props="districtCascaderProps"
      :options="addressOptions"
      placeholder="请选择"
      separator=""
      @change="cascaderChange">
    </el-cascader>
  </div>
</template>

<script>

const XIXIANGDATA = {
  center: "{\"type\":\"Point\",\"coordinates\":[107.761936,32.985107]}",
  distCode: '610724000000',
  distFullName: '陕西省汉中市西乡县',
  distName: '西乡县',
  distShortName: '西乡县',
  id: 'h3ZZbX0ntHMyIL8rH7TQDDLbzwa5anNH',
  isExist: true,
  leaf: false,
  isTenant: null,
  level: 3,
  orderNum: 1,
  parentId: '610700000000',
  remark: null
}

export default {
  data() {
    return {
      justShowXiXiang: true, // 固定只显示陕西省汉中市西乡县数据
      distCode: '', // 行政区域编码
      distName: '', // 行政区域名称
      addressOptions: [], // 用于编辑默认值回显
      districtCascaderProps: { // 行政区域级联渲染
        checkStrictly: true,
        emitPath: false,
        lazy: true,
        lazyLoad: this.districtCascaderLazyLoad,
        value: 'distCode',
        label: 'distName',
        isLeaf: 'leaf'
      }
    }
  },
  methods: {
    async districtCascaderLazyLoad(node, resolve) { // 行政区划级联选择器懒加载
      if (node.isLeaf) return resolve([])
      if (!this.justShowXiXiang) {
        const api = level === 0 ? 'districtListLevel' : 'districtParentCodeList'
        const params = level === 0 ? { level: 1 } : { distCode }
        const { code, data } = await this.$api.topeakPlatformServer[api]({
          ...params,
          loading: false
        })
        resolve(
          code === 200
            ? data.map(item => {
                item.leaf = item.isExist === false ? true : false
                return item
              })
            : []
        )
      } else {
        if (level === 0) {
          resolve([XIXIANGDATA])
        } else {
          const { code, data } = await this.$api.topeakPlatformServer.districtParentCodeList({
          distCode: distCode,
          loading: false
        })
        resolve(
          code === 200
            ? data.map(item => {
                item.leaf = item.isExist === false ? true : false
                return item
              })
            : []
        )
        }
      }
    },
    getParentNodeByClass(element, className) { // 根据 class 获取父级节点
      const pNode = element.parentNode
      const pClassList = element.parentNode.className
      if (!pNode) return pNode
      return pClassList.indexOf(className) === -1 ? this.getParentNodeByClass(pNode, className) : pNode
    },
    cascaderChange(val, e) { // 行政区域级联选择更改
      let checkedNodes = this.$refs.cascader.getCheckedNodes(true)
      if (Array.isArray(checkedNodes) && checkedNodes.length > 0) {
        this.distName = checkedNodes[0].data.distFullName
      } else {
        this.distName = ''
      }
      if (!val) return
      e = e || window.event
      const node = this.getParentNodeByClass(e.target, 'el-cascader-node')
      if (node) node.click()
    },
    async loadOptions(list, level) { //递归加载子级行政区域
      let self = this
      let array = []
      for(let item of list) {
        let len = this.distCode.length
        if (level < 5) { // 省、市、县(两位编码)
          len = (level - 1) * 2
        } else if (level == 5) { // 镇(三位编码)
          len = 9
        }
        let curDistCode = this.distCode.substring(0, len)
        for (let i = this.distCode.substring(len).length; i > 0; i--) {
          curDistCode += '0'
        }
        if (item.distCode && item.distCode.substring(0, len) == curDistCode.substring(0, len)) {
          const {code, data} = await this.$api.server.districtParentCodeList({
            distCode: curDistCode,
            loading: false
          })
          if (code == 200 && data) {
            item.children = await self.loadOptions(data, level + 1) // element有规则children为指定选项的子选项为选项对象的某个属性值
          }
        }
        array.push(item)
      }
      return array
    },
    async getProvince() { // 获取省级列表
      const {code, data} = await this.$api.server.districtListLevel({
        level: 1,
        loading: false
      })
      if (code == 200 && Array.isArray(data)) {
        this.addressOptions = await this.loadOptions(data, 2)
      }
    }
  },
  mounted() {
    if (this.distCode) {
      if (!this.justShowXiXiang) {
        this.getProvince()
      } else {
        this.addressOptions = await this.loadOptions([XIXIANGDATA], 4)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>

