<template>
  <div>
    <el-select
      v-model="searForm.distCode"
      filterable
      remote
      clearable
      placeholder="请输入行政区域"
      popper-class="virtuallistselect"
      :remote-method="districtRemoteMethod"
      :loading="districtLoading"
      @visible-change="districtVisibleChange"
      @change="searchClick">
      <virtual-list-options
        ref="virtualListOptions"
        :listData="districtList"
        :optionKey="'distCode'"
        :extraProps="{labelKey: 'distFullName', valueKey: 'distCode'}">
      </virtual-list-options>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        distCode: ''
      },
      districtList: [], // 行政区列表
      districtLoading: false,
    }
  },
  methods: {
    searchClick() {
      // todo: 调用列表查询接口
    },
    districtVisibleChange(val) {
      if (!val) {
        // 重置状态初始化，避免select选中后面的选项再次点击进入前面是空白
        this.$refs.virtualListOptions && this.$refs.virtualListOptions.reset()
      }
    },
    async districtRemoteMethod(query) {
      if (!query) {
        this.districtLoading = false
        this.districtList = []
        this.searchForm.distCode = ''
      } else {
        let reqData = {
          page: {
            current: 0,
            size: -1
          },
          search: {
            distFullName: query
          }
        }
        this.districtLoading = true
        const {code, data} = await this.$api.xxx(reqData).catch(err => err)
        this.districtLoading = false
        if (code == 200 && data && Array.isArray(data.records)) {
          this.districtList = data.records
        } else {
          this.districtList = []
        }
      }
    }
  },
  mounted() {
    
  }
}
</script>

<style lang="less" scoped>

</style>