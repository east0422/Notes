<template>
  <el-drawer
    :visible.sync="drawerVisible"
    :append-to-body="true"
    size="86%"
    custom-class="drawer-demo regionfreightselect"
    :show-close="false"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="$emit('closed')">
    <div class="content-container">
      <div class="search-bar-demo drawer-search-bar-demo">
        <div class="left">
          <el-button class="large" type="primary" @click="addClick">新增个别区域及运费</el-button>
        </div>
        <div class="right">
        <el-button class="large" type="primary" icon="el-icon-check" @click="confirmClick">保存</el-button>
        <el-button class="large" icon="el-icon-close" @click="closeClick">取消</el-button>
        </div>
      </div>
      <div class="page-content-container">
        <el-table
          class="list-table"
          :data="regionFreightList">
          <el-table-column label="配送区域" prop="deliveryAreaName">
            <template slot-scope="scope">
              <el-cascader
                v-if="scope.row.isEdit || scope.row.isAdd"
                v-model="districtArr"
                :props="districtCascaderProps"
                :options="districtOptionsList"
                placeholder="全部"
                separator="、"
                collapse-tags
                ref="cascader"
                clearable
                popper-class="el-checkbox-no-radius"
                @change="districtChange(scope.row)">
              </el-cascader>
              <span v-else>{{scope.row.deliveryAreaName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="计价方式" prop="startCount">
            <template slot-scope="scope">
              <el-input-number
                v-if="scope.row.isEdit || scope.row.isAdd"
                v-model="scope.row.startCount"
                placeholder="0"
                :max="99999999"
                :min="0"
                :precision="0"
                :controls="false">
              </el-input-number>
              <span v-else>{{scope.row.startCount}}</span>
              <span>{{templateTypeUnit}}以内</span>
            </template>
          </el-table-column>
          <el-table-column label="费用(元)" prop="startPrice">
            <template slot-scope="scope">
              <el-input-number
                v-if="scope.row.isEdit || scope.row.isAdd"
                v-model="scope.row.startPrice"
                placeholder="0.00"
                :max="999999.99"
                :min="0.00"
                :precision="2"
                :controls="false">
              </el-input-number>
              <span v-else>{{scope.row.startPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column label="后续费方式" prop="increameCount">
            <template slot-scope="scope">
              <span>每增加</span>
              <el-input-number
                v-if="scope.row.isEdit || scope.row.isAdd"
                v-model="scope.row.increameCount"
                placeholder="0"
                :max="99999999"
                :min="0"
                :precision="0"
                :controls="false">
              </el-input-number>
              <span v-else>{{scope.row.increameCount}}</span>
              <span>{{templateTypeUnit}}</span>
            </template>
          </el-table-column>
          <el-table-column label="续费(元)" prop="increamePrice">
            <template slot-scope="scope">
              <el-input-number
                v-if="scope.row.isEdit || scope.row.isAdd"
                v-model="scope.row.increamePrice"
                placeholder="0.00"
                :max="999999.99"
                :min="0.00"
                :precision="2"
                :controls="false">
              </el-input-number>
              <span v-else>{{scope.row.increamePrice}}</span>
            </template>
          </el-table-column>
          <el-table-column label="满包邮" prop="fullPrice">
            <span>订单满</span>
            <template slot-scope="scope">
              <el-input-number
                v-if="scope.row.isEdit || scope.row.isAdd"
                v-model="scope.row.fullPrice"
                placeholder="0.00"
                :max="999999.99"
                :min="0.00"
                :precision="2"
                :controls="false">
              </el-input-number>
              <span v-else>{{scope.row.fullPrice}}</span>
              <span>元包邮</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center">
            <div slot-scope="scope" class="hcontainer">
              <el-tooltip
                v-if="scope.row.isEdit || scope.row.isAdd"
                content="保存"
                placement="top"
                manual
                :value="currentHighlightOperatBtn === `${scope.$index + 1}_save`">
                <div
                  class="operate-btn"
                  :class="{ active: currentHighlightOperatBtn === `${scope.$index + 1}_save` }"
                  @click="saveClick(scope.row)"
                  @mouseenter="highlightOperatBtnChange(scope.$index + 1,  'save')"
                  @mouseleave="highlightOperatBtnChange"
                  @mouseup="highlightOperatBtnChange">
                  <i class="operate-icon icon-save"></i>
                </div>
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.isEdit || scope.row.isAdd"
                content="取消"
                placement="top"
                manual
                :value="currentHighlightOperatBtn === `${scope.$index + 1}_cancel`">
                <div
                  class="operate-btn"
                  :class="{ active: currentHighlightOperatBtn === `${scope.$index + 1}_cancel` }"
                  @click="cancelClick(scope.row)"
                  @mouseenter="highlightOperatBtnChange(scope.$index + 1,  'cancel')"
                  @mouseleave="highlightOperatBtnChange"
                  @mouseup="highlightOperatBtnChange">
                  <i class="operate-icon icon-cancel"></i>
                </div>
              </el-tooltip>
              <el-tooltip
                v-if="!scope.row.isEdit && !scope.row.isAdd && scope.row.putInStorage != 'yes'"
                content="编辑"
                placement="top"
                manual
                :value="currentHighlightOperatBtn === `${scope.$index + 1}_edit`">
                <div
                  class="operate-btn"
                  :class="{ active: currentHighlightOperatBtn === `${scope.$index + 1}_edit` }"
                  @click="editClick(scope.row)"
                  @mouseenter="highlightOperatBtnChange(scope.$index + 1,  'edit')"
                  @mouseleave="highlightOperatBtnChange"
                  @mouseup="highlightOperatBtnChange">
                  <i class="operate-icon icon-edit-line"></i>
                </div>
              </el-tooltip>
              <el-tooltip
                v-if="!scope.row.isEdit && !scope.row.isAdd && scope.row.putInStorage != 'yes'"
                content="删除"
                placement="top"
                manual
                :value="currentHighlightOperatBtn === `${scope.$index + 1}_del`">
                <div
                  class="operate-btn"
                  :class="{ active: currentHighlightOperatBtn === `${scope.$index + 1}_del` }"
                  @click="delClick(scope.$index)"
                  @mouseenter="highlightOperatBtnChange(scope.$index + 1,  'del')"
                  @mouseleave="highlightOperatBtnChange"
                  @mouseup="highlightOperatBtnChange">
                  <i class="operate-icon icon-delete-line"></i>
                </div>
              </el-tooltip>
            </div>
          </el-table-column>
          <template slot="empty">
            <div class="data-empty">
              <div class="empty-img"></div>
              <div class="empty-text">暂无数据</div>
            </div>
          </template>
        </el-table>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'SalesServicesDistributionManagementRegionFreightSelectDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defaultList: {
      type: Array,
      default: () => []
    },
    templateTypeUnit: {
      type: String,
      default: '件'
    }
  },
  data() {
    return {
      drawerVisible: false,
      regionFreightList: [],
      currentHighlightOperatBtn: '',
      districtArr: [], // 新增模板选中的区域
      curCheckedArr: [], // 当前选中区域(去除了选中父级的子级)
      curDeliveryAreaName: '', // 当前编辑区域名称
      districtCascaderProps: { // 行政区划级联渲染规则
        multiple: true,
        checkStrictly: true,
        emitPath: false,
        lazy: true,
        lazyLoad: this.districtCascaderLazyLoad,
        value: 'distCode',
        label: 'distName',
        isLeaf: 'leaf'
      },
      districtOptionsList: []
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.drawerVisible = val
      },
      immediate: true
    },
    drawerVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  mounted() {
    if (this.defaultList.length) this.regionFreightList = JSON.parse(JSON.stringify(this.defaultList))
  },
  methods: {
    highlightOperatBtnChange(rI, key) { // 高亮操作列按钮
      this.currentHighlightOperatBtn = !rI || !key ? '' : `${rI}_${key}`
    },
    async getOptionsList() {
      let res = await this.getProvinceList()
      let subList = []
      this.districtArr.forEach(item => { // substr取前面几个元素，substring(start, length)
        if (item.substr(3) != '000000000') { // 非一级菜单
          subList.push(item)
        }
      })
      
      if (subList.length == 0) { // 都是一级菜单
        return res
      }
      // 补充子级数据
      // 暂只处理三级回显(distcode长度12，从前往后3省，2市，2区/县 5个0)
      let len = subList.length // 未处理长度
      for (let i = 0; i < res.length; i++) {
        if (len < 1) {
          break
        }
        for (let j = 0; j < subList.length; j++) {
           if (res[i].distCode.substring(0, 3) == subList[j].substring(0, 3)) {
            len--
            if (!res[i].children) {
              let cityList = await this.getOtherList(subList[j].substring(0, 3) + '000000000', 1)
              if (subList[j].substr(5) != '0000000') { // 区/县数据
                for (let k = 0; k < cityList.length; k++) {
                  if (cityList[k].distCode.substring(0, 5) == subList[j].substring(0, 5)) {
                    let areaList = await this.getOtherList(subList[j].substring(0, 5) + '0000000', 2)
                    cityList[k].children = areaList
                    break
                  } 
                }
              }
              res[i].children = cityList
            }
          }
        }
      }
      return res
    },
    async getProvinceList() {
      let reqData = {
        level: 1,
        loading: false
      }
      const { code, data } = await this.$api.topeakPlatformServer.districtListLevel(reqData)
      if (code == 200 && Array.isArray(data)) {
        return data.map(item => {
          item.leaf = (item.isExist === false)
          return item
        })
      } else {
        return []
      }
    },
    async getOtherList(distCode, level) {
      let reqData = {
        distCode: distCode,
        loading: false
      }
      const { code, data } = await this.$api.topeakPlatformServer.districtParentCodeList(reqData)
      if (code == 200 && Array.isArray(data)) {
        return data.map(item => {
          item.leaf = (item.isExist === false ? true : (level > 1))
          return item
        })
      } else {
        return []
      }
    },
    async districtCascaderLazyLoad(node, resolve) { // 行政区划级联选择器懒加载
      // 区域只显示省市区三级
      if (node.isLeaf || node.level > 2) return resolve([])
      const { level, value: distCode = '' } = node
      if (level === 0) {
        if (this.districtArr.length > 0) {
          // 存在回显id才设置回显
          let res = await this.getOptionsList()
          this.districtOptionsList = res
        } else {
          let provinceList = await this.getProvinceList()
          resolve(provinceList)
        }
      } else {
        let otherList = await this.getOtherList(distCode, level)
        resolve(otherList)
      }
    },
    districtChange(row) { // 切换行政区划
      let checkedNodeList = this.$refs.cascader ? this.$refs.cascader.getCheckedNodes() : []
      let checkedVal = []
      let checkedLabel = []
      checkedNodeList.map((item) => { // 遍历过滤掉选中父级的子级
        if (!item.parent || !item.parent.checked) {
          checkedVal.push(item.value)
          checkedLabel.push(item.pathLabels.join(''))
        }
      })

      row.deliveryAreaName = checkedLabel.join('、')
      this.curCheckedArr = checkedVal
    },
    closeClick() {
      this.drawerVisible = false
      this.$emit('close')
    },
    addClick() {
      if (this.isAdding) return this.$message.warning('新增数据未保存')
      if (this.isEditing) return this.$message.warning('修改数据未保存')
      this.districtArr = []
      this.regionFreightList.push({
        deliveryAreaName: '',
        province: '',
        city: '',
        county: '',
        areaData: [],
        town: '',
        startCount: 0,
        startPrice: 0,
        increameCount: 0,
        increamePrice: 0.00,
        fullPrice: 0.00,
        isAdd: true,
        isEdit: false
      })
      this.isAdding = true
    },
    saveClick(row) {
      if (!row.deliveryAreaName) return this.$message.warning('配送区域不能为空')
      if (!row.startCount) return this.$message.warning('计价方式不能为空')
      if (!row.startPrice) return this.$message.warning('费用不能为空')
      if (!row.increameCount) return this.$message.warning('后续费方式不能为空')
      if (!row.increamePrice) return this.$message.warning('续费不能为空')
      if (!row.fullPrice) return this.$message.warning('满包邮不能为空')

      this.$set(row, 'areaData', JSON.stringify(this.curCheckedArr || []))
      this.$set(row, 'isEdit', false)
      this.$set(row, 'isAdd', false)
      this.isAdding = false
      this.isEditing = false
      this.districtArr = []
      this.curCheckedArr = []
    },
    cancelClick(row) {
      if (row.isAdd) { // 取消新增
        this.regionFreightList.splice(this.regionFreightList.length-1, 1)
      } else { // 取消编辑
        this.$set(row, 'deliveryAreaName', this.curDeliveryAreaName)
        this.$set(row, 'isEdit', false)
        this.curDeliveryAreaName = ''
      }
      this.districtArr = []
      this.isAdding = false
      this.isEditing = false
    },
    editClick(row) {
      if (this.isAdding) return this.$message.warning('新增数据未保存')
      if (this.isEditing) return this.$message.warning('修改数据未保存')
      if (Array.isArray(row.areaData)) {
        this.districtArr = [...row.areaData]
      } else if (row.areaData) {
        this.districtArr = JSON.parse(row.areaData) || []
      }
      this.districtOptionsList = []
      this.curDeliveryAreaName = row.deliveryAreaName
      this.$set(row, 'isEdit', true)
      this.isEditing = true
    },
    delClick(index) {
      if (this.isAdding) return this.$message.warning('新增数据未保存')
      if (this.isEditing) return this.$message.warning('修改数据未保存')
      this.regionFreightList.splice(index, 1)
    },
    confirmClick() {
      if (this.isAdding) return this.$message.warning('新增数据未保存')
      if (this.isEditing) return this.$message.warning('修改数据未保存')

      // 配送区域不允许有重复，不然不知道如何选择配送价格
      let regionArr = []
      for (let i = 0; i < this.regionFreightList.length; i++) {
        let curRegionArr = []
        if (Array.isArray(this.regionFreightList[i].areaData)) {
          this.curRegionArr = this.regionFreightList[i].areaData
        } else {
          this.curRegionArr = JSON.parse(this.regionFreightList[i].areaData) || []
        }
        for (let j = 0; j < curRegionArr.length; j++) {
          if (regionArr.includes(curRegionArr[j])) {
            return this.$message.warning('配送区域中有重复的区域,请修改重复配送区域')
          }
          regionArr.push(curRegionArr[j])
        }
      }
      this.$emit('accomplish', this.regionFreightList)
      this.closeClick()
    }
  }
}
</script>

<style lang="less" scoped>
.content-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.page-content-container {
  position: relative;
  margin-top: 20px;
  padding-left: 17px;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
}

.data-empty {
  display: flex;
  flex-direction: column;
  align-items: center;

  .empty-img {
    width: 482px;
    height: 323px;
    background: url('~@/assets/img/list-data-empty.png') no-repeat center;
    background-size: contain;
  }

  .empty-text {
    font-size: 22px;
    color: #ccced3;
    transform: translateY(-60px);
  }
}

.operate-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
  background-color: #fcfcfc;
  border: 1px solid #f2f2f3;
  border-radius: 10px;
  transition: all 0.2s;
  cursor: pointer;

  &.active {
    border-color: #36a98a;
  }

  &:not(:first-child) {
    margin-left: 20px;
  }
}
.operate-icon {
  font-size: 24px;
  color: #ccced3;
}
</style>

<style lang="less">
.regionfreightselect {
  .el-input-number {
    width: 60%;
    margin: 0 10px;
  }
}
</style>
