<template>
  <div class="list-table-container" :class="{ 'is-visibility-hide': isVisibilityHide }">
    <el-table
      ref="table"
      class="table"
      :class="{ 'is-update-columns': isUpdateColumns }"
      :data="data || config.data || []"
      :row-key="config.rowkey"
      :stripe="config.stripe"
      :border="config.border"
      :show-header="config.showHeader === false ? false : true"
      :height="config.noScroll ? undefined : 100"
      :highlight-current-row="config.highlightCurrentRow"
      :span-method="config.spanMethod"
      :cell-class-name="config.cellClassName"
      :tree-props="config.treeProps"
      :expand-row-keys="config.expandRowKeys"
      :default-expand-all="config.defaultExpandAll"
      :default-sort="config.defaultSortFun"
      @selection-change="selectListChange"
      @current-change="currentChange"
      @expand-change="expandChange"
      @sort-change="sortChange"
    >
      <el-table-column v-if="config.showRadio" width="30">
        <template #default="scope">
          <el-radio
            :label="(config.currentPage - 1) * config.pageSize + scope.$index"
            v-model="config.radio"
            @change.native="getCurrentRow(scope.row)"
          ></el-radio>
        </template>
      </el-table-column>
      <el-table-column
        v-if="config.showSelection"
        type="selection"
        width="50"
        :reserve-selection="!!config.rowkey"
        :resizable="!!config.resizable"
      ></el-table-column>
      <el-table-column
        v-if="config.showIndex"
        type="index"
        :index="indexFormat"
        label="序号"
        width="60"
        :resizable="!!config.resizable"
      ></el-table-column>
      <el-table-column
        v-if="config.showExpand"
        type="expand"
        :label="config.configLabel"
        width="50"
        :resizable="!!config.resizable"
      >
        <template #default="{ row }">
          <slot name="childrenListTable" :row="row">
            <list-table
              ref="listTable"
              class="list-table"
              :showOperateName="showOperateName"
              :config="config.childrenConfig"
              :data="row[config.childrenConfig.parentProp || 'children']"
              @operat-callback="listTableCallback"
            >
              <template #[slotName]="slopProps" v-for="(slot, slotName) in $scopedSlots">
                <slot :name="slotName" v-bind="slopProps"></slot>
              </template>
            </list-table>
          </slot>
        </template>
      </el-table-column>
      <template v-for="(item, index) in config.columns">
        <el-table-column
          :key="index"
          v-if="!item.hide"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :sortable="item.sortable"
          :resizable="!!config.resizable"
        >
          <template #default="{ row, $index }">
            <slot :name="item.slotName || item.prop || `column-${index + 1}`" :row="row" :index="$index">
              <span v-if="item.type === 'operates'" class="operat-btns">
                <template v-for="(bItem, bKey) in config.operates || []">
                  <template v-if="bItem.show || (bItem.showFunc && bItem.showFunc(row))">
                    <el-dropdown
                      v-if="bItem.type === 'dropdown'"
                      :key="bKey"
                      trigger="click"
                      @command="operatCallback($event, { row, $index })"
                    >
                      <div
                        :key="bKey"
                        :class="[
                          {active: currentHighlightOperatBtn === `${$index + 1}_${bKey + 1}`},
                          showOperateName ? 'link': 'operat-btn']"
                        @mouseenter="highlightOperatBtnChange($index + 1, bKey + 1)"
                        @mouseleave="highlightOperatBtnChange"
                        @mouseup="highlightOperatBtnChange"
                      >
                        <div v-if="showOperateName">{{bItem.name}}</div>
                        <el-tooltip v-if="bItem.icon && !showOperateName" :content="bItem.name" placement="top">
                          <i class="operat-icon" :class="[bItem.icon]"></i>
                        </el-tooltip>
                      </div>
                      <el-dropdown-menu slot="dropdown" :class="['dropdown-menu-demo', {'link': showOperateName}]">
                        <el-dropdown-item
                          v-for="(cItem, cKey) in bItem.dropdownList ||
                          (bItem.dropdownListFunc && bItem.dropdownListFunc(row)) ||
                          []"
                          :key="cKey"
                          :command="cItem.emit"
                        >
                          {{ cItem.name }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <el-tooltip
                      v-else
                      :key="bKey"
                      :content="bItem.name"
                      :disabled="showOperateName"
                      placement="top"
                      manual
                      :value="currentHighlightOperatBtn === `${$index + 1}_${bKey + 1}`"
                    >
                      <div
                        :key="bKey"
                        :class="[
                          {active: currentHighlightOperatBtn === `${$index + 1}_${bKey + 1}`},
                          showOperateName ? 'link': 'operat-btn']"
                        @click="operatCallback(bItem.emit, { row, $index })"
                        @mouseenter="highlightOperatBtnChange($index + 1, bKey + 1)"
                        @mouseleave="highlightOperatBtnChange"
                        @mouseup="highlightOperatBtnChange"
                      >
                        <div v-if="showOperateName">{{bItem.name}}</div>
                        <i v-if="bItem.icon && !showOperateName" class="operat-icon" :class="[bItem.icon]"></i>
                      </div>
                    </el-tooltip>
                  </template>
                </template>
              </span>
              <span v-else-if="item.type === 'button'" class="operat-btns">
                <template v-for="(bItem, bKey) in row[item.prop]">
                  <el-tooltip
                    :key="bKey"
                    v-if="bItem.show || (bItem.showFunc && bItem.showFunc(row))"
                    :content="bItem.name"
                    :disabled="showOperateName"
                    placement="top"
                    manual
                    :value="currentHighlightOperatBtn === `${$index + 1}_${bKey}`"
                  >
                    <div
                      :key="bKey"
                      :class="[
                        {active: currentHighlightOperatBtn === `${$index + 1}_${bKey + 1}`},
                        showOperateName ? 'link': 'operat-btn']"
                      @click="operatCallback(bItem.emit, { row, $index })"
                      @mouseenter="highlightOperatBtnChange($index + 1, bKey)"
                      @mouseleave="highlightOperatBtnChange"
                      @mouseup="highlightOperatBtnChange"
                    >
                      <div v-if="showOperateName">{{bItem.name}}</div>
                      <i v-if="bItem.icon && !showOperateName" class="operat-icon" :class="[bItem.icon]" :style="bItem.iconStyle"></i></div
                  ></el-tooltip>
                </template>
              </span>
              <span v-else-if="item.type === 'buttonDrop'" class="operat-btns">
                <template v-for="(bItem, bKey) in row[item.prop]">
                  <template v-if="bItem.show || (bItem.showFunc && bItem.showFunc(row))">
                    <el-dropdown :key="bKey" v-if="bItem.type === 'dropdown'" @command="operatCallback($event, { row, $index })">
                      <div
                        :key="bKey"
                        :class="[
                          {active: currentHighlightOperatBtn === `${$index + 1}_${bKey + 1}`},
                          showOperateName ? 'link': 'operat-btn']"
                        @mouseenter="highlightOperatBtnChange($index + 1, bKey)"
                        @mouseleave="highlightOperatBtnChange"
                        @mouseup="highlightOperatBtnChange"
                      >
                        <div v-if="showOperateName">{{bItem.name}}</div>
                        <i v-if="bItem.icon && !showOperateName" class="operat-icon" :class="[bItem.icon]"></i>
                      </div>
                      <el-dropdown-menu slot="dropdown" :class="['dropdown-menu-demo', {'link': showOperateName}]">
                        <el-dropdown-item
                          v-for="(cItem, cKey) in bItem.dropdownList ||
                          (bItem.dropdownListFunc && bItem.dropdownListFunc(row)) ||
                          []"
                          :key="cKey"
                          :command="cItem.emit"
                          >{{ cItem.name }}</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                    <el-tooltip
                      :key="bKey"
                      v-else
                      :content="bItem.name"
                      :disabled="showOperateName"
                      placement="top"
                      manual
                      :value="currentHighlightOperatBtn === `${$index + 1}_${bKey}`"
                    >
                      <div
                        :key="bKey"
                        :class="[
                          {active: currentHighlightOperatBtn === `${$index + 1}_${bKey + 1}`},
                          showOperateName ? 'link': 'operat-btn']"
                        @click="operatCallback(bItem.emit, { row, $index })"
                        @mouseenter="highlightOperatBtnChange($index + 1, bKey)"
                        @mouseleave="highlightOperatBtnChange"
                        @mouseup="highlightOperatBtnChange"
                      >
                        <div v-if="showOperateName">{{bItem.name}}</div>
                        <i v-if="bItem.icon && !showOperateName" class="operat-icon" :class="[bItem.icon]"></i></div
                    ></el-tooltip>
                  </template>
                </template>
              </span>
              <span v-else-if="item.type === 'link'" class="link" @click="operatCallback(item.emit, { row, $index })">
                {{ row[item.prop] }}
              </span>
              <span v-else :title="(item.parentProp && row[item.parentProp] && row[item.parentProp][item.prop] || row[item.prop])">
                {{ (item.parentProp && row[item.parentProp] && row[item.parentProp][item.prop] || row[item.prop]) +
                  (item.unitProp && row[item.unitProp] && item.unit || '') }}
              </span>
            </slot>
          </template>
        </el-table-column>
      </template>
      <template slot="empty">
        <slot name="empty">
          <div class="data-empty">
            <div class="empty-img"></div>
            <div class="empty-text">暂无数据</div>
          </div>
        </slot>
      </template>
    </el-table>
    <el-pagination
      v-if="!config.hidePagination"
      class="pagination"
      background
      :layout="config.paginationLayout || 'total, sizes, prev, pager, next, jumper'"
      :current-page.sync="config.currentPage"
      :page-sizes="config.pageSizes || [10, 20, 50, 100]"
      :page-size.sync="config.pageSize"
      :pager-count="config.pagerCount || 7"
      :total="config.total"
      @size-change="paginationPageSizeChange"
      @current-change="paginationCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'ListTable',
  props: {
    config: {
      type: Object,
      default: () => ({
        data: []
      })
    },
    data: Array,
    // 默认勾选数据
    defaultSelectList: {
      type: Array,
      default: () => []
    },
    showOperateName: { // 操作按钮是否显示文字而不显示图标(默认显示图标)
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否隐藏元素
      isVisibilityHide: true,
      // 是否更新列
      isUpdateColumns: false,
      // 当前高亮操作按钮
      currentHighlightOperatBtn: ''
    }
  },
  watch: {
    'config.columns': {
      handler() {
        // 解决表头加载闪烁
        this.isUpdateColumns = true
        setTimeout(() => {
          this.isUpdateColumns = false
        }, 100)
      },
      deep: true
    }
  },
  created() {
    var unwatchDefaultSelectList = this.$watch(
      'defaultSelectList',
      (newVal, oldVal) => {
        if (!newVal.length) return
        if (unwatchDefaultSelectList) unwatchDefaultSelectList()
        if (oldVal && oldVal.length) return
        this.$nextTick(() => {
          // 在某些情况下rowkey相同但item可能不是同一个
          // newVal.map(item => {
          //   this.$refs.table['toggleRowSelection'](item, true)
          // })

          // 监听到默认选项更改时config.data有可能还未完成赋值，对defaultSelectList值更改放到获取config.data后
          // 获取默认选择数组所有rowkey组成新的数组
          let rowKey = this.config.rowkey || 'id'
          let keys = newVal.map(item => {
            return item[rowKey]
          })
          this.config.data.map(item => {
            this.$refs.table['toggleRowSelection'](item, keys.includes(item[rowKey]))
          })
        })
      },
      { immediate: true }
    )
  },
  mounted() {
    this.resetVisibility()
  },
  activated() {
    this.resetVisibility()
  },
  methods: {
    // 重置组件显示 - 解决表格加载闪烁
    resetVisibility() {
      this.isVisibilityHide = true
      setTimeout(() => {
        this.isVisibilityHide = false
      }, 100)
    },
    // 高亮操作列按钮
    highlightOperatBtnChange(rI, key) {
      this.currentHighlightOperatBtn = !rI || !key ? '' : `${rI}_${key}`
    },
    // 获取操作回调事件名
    getOperatName(eventName) {
      return (this.config.customEventName && this.config.customEventName[eventName]) || eventName
    },
    // 当前行变化
    currentChange(row, oldRow) {
      this.operatCallback('currentChange', { row, oldRow })
    },
    // 展开/关闭行
    expandChange(row, expand) {
      this.operatCallback('expandChange', { row, expand })
    },
    // 排序条件变化
    sortChange({ column, prop, order }) {
      this.operatCallback('sortChange', { column, prop, order })
    },
    // 列表索引格式处理
    indexFormat(index) {
      return this.config.hidePagination ? index + 1 : (this.config.currentPage - 1) * this.config.pageSize + index + 1
    },
    // 选择项数组变化
    selectListChange(selectList) {
      this.operatCallback('selectListChange', selectList)
    },
    // 单选数组变化
    getCurrentRow(row) {
      this.operatCallback('getCurrentRow', row)
    },
    // 分页器条数切换
    paginationPageSizeChange() {
      this.config.currentPage = 1
      this.paginationCurrentChange(1)
    },
    // 分页器当前页切换
    paginationCurrentChange(val) {
      this.operatCallback('currentPageChange', val)
    },
    // 操作回调
    operatCallback(eventName, data) {
      this.$emit('operat-callback', { eventName: this.getOperatName(eventName), data })
    },
    // 子级列表回调
    listTableCallback({ eventName, data }) {
      this.operatCallback(eventName, data)
    },
    // 暴露tbody滚动条回到顶部方法
    scrollToTop() {
      this.$refs.table.$refs.bodyWrapper.scrollTop = 0
      if (this.$refs.table.$refs.emptyBlock) this.$refs.table.$refs.emptyBlock.scrollTop = 0
    },
    // 暴露清空选择项方法
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    // 暴露清空排序条件方法
    clearSort() {
      this.$refs.table.clearSort()
    }
  }
}
</script>

<style lang="less" scoped>
.list-table-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &.is-visibility-hide {
    visibility: hidden;
  }
}

/deep/ .table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  > :not(.el-table__body-wrapper) {
    flex-shrink: 0;
  }

  .el-table__body-wrapper {
    flex: 1;
  }
  
  .el-table__body {
    tr {
      &.current-row {
        > td {
          &.el-table__cell {
            background-color: cornsilk;
          }
        }
      }
    }
  }

  &:not(.el-table--border) {
    &::before {
      display: none;
    }
  }

  &.el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #f3fdf9;
  }

  &.is-update-columns {
    .el-table__header-wrapper {
      visibility: hidden;

      .cell {
        white-space: nowrap;
      }
    }
  }

  th {
    padding: 30px 0;

    &.is-leaf {
      border-color: #f2f2f3;
    }
  }

  td {
    padding: 15px 0;
    border-color: #f2f2f3;
  }

  .el-table__header {
    .has-gutter {
      th {
        &:nth-last-child(2) {
          border-right: none;
        }
      }
    }

    .cell {
      font-weight: bold;
      font-size: 18px;
    }
  }

  .cell {
    font-family: 'Source Han Sans CN';
    font-size: 16px;
    color: #565656;
  }

  .el-table__empty-block {
    align-items: flex-start;
    overflow-y: auto;
  }

  .el-table__empty-text {
    line-height: initial;
  }

  .el-table__expand-icon {
    font-size: 16px;
  }
}

.operat-btns {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;

  .operat-btn {
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
    color: #999999;

    &.active {
      border-color: #36a98a;
      color: #36a98a;
    }

    &:not(:first-child) {
      margin-left: 20px;
    }
  }

  .operat-icon {
    font-size: 24px;
    color: #ccced3;
  }
}

/deep/ .el-dropdown {
  .operat-btn {
    margin-left: 20px;
  }
  .link {
    margin-left: 10px;
  }
}

.pagination {
  flex-shrink: 0;
  padding: 25px 0;
  display: flex;
  justify-content: center;
}

.data-empty {
  display: flex;
  flex-direction: column;
  align-items: center;

  .empty-img {
    width: 482px;
    height: 323px;
    background: url('../../assets/img/list-data-empty.png') no-repeat center;
    background-size: contain;
  }

  .empty-text {
    font-size: 22px;
    color: #ccced3;
    transform: translateY(-60px);
  }
}

.link {
  font-size: 16px;
  color: #66b1ff;
  cursor: pointer;
  &:not(:first-child) {
    margin-left: 10px;
  }
  .el-dropdown-menu__item {
    color: #66b1ff;
  }
}

/deep/ .el-table .descending .sort-caret.descending {
  border-top-color: #36a98a;
}
/deep/ .el-table .ascending .sort-caret.ascending {
  border-bottom-color: #36a98a;
}

.operat-btns {
  .link {
    color: #36a98a;
  }
}
</style>
