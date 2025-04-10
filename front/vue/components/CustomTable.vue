<template>
  <div class="fill custom-table">
    <el-table
      ref="tableRef"
      :class="[{ fill: props.isTableFill, 'hide-expand-icon': props.hiddenExpandIcon }, 'table']"
      :data="props.list"
      :row-key="props.rowKey"
      :stripe="props.stripe"
      :border="props.border"
      :show-header="props.showHeader"
      :height="props.height"
      :max-height="props.maxHeight"
      :default-expand-all="props.defaultExpandAll"
      :indent="props.indent"
      :tree-props="props.treeProps"
      :show-overflow-tooltip="props.showOverflowTooltip"
      @selection-change="selectionChange">
      <el-table-column
        v-if="props.showSelection"
        type="selection"
        width="50"
        :align="'center'"
        :reserve-selection="!!props.rowKey" />
      <el-table-column
        v-if="props.showIndex"
        type="index"
        :index="indexFormat"
        :align="'center'"
        label="序号"
        width="60" />
      <el-table-column
        v-for="(item, index) in props.columns || []"
        :key="item.id || item.prop || index"
        :prop="item.prop"
        :label="item.label"
        :header-align="item.headerAlign || 'left'"
        :align="item.align || 'left'"
        :width="item.width || ''"
        :fixed="item.fixed || (item.type === 'operates' ? 'right' : false)"
        :min-width="item.minWidth || ''"
        :class-name="(item.isSpacePre && 'space-pre') || ''"
        :sortable="!!item.sortable">
        <template #default="{ row, $index }">
          <slot
            :name="item.slotName || item.prop || `column-${index + 1}`"
            :row="row"
            :index="$index">
            <div v-if="item.type === 'operates'" class="operate-container">
              <template v-for="(oItem, oIndex) in props.operates || []" :key="oItem.emit">
                <template v-if="oItem.show || (oItem.showFunc && oItem.showFunc(row))">
                  <el-dropdown
                    v-if="oItem.type === 'dropdown'"
                    trigger="click"
                    @command="operatCallback($event, row, $index)">
                    <span
                      :class="[
                        'operate-btn',
                        { active: currentHighlightOperatBtn === `${$index + 1}_${oIndex + 1}` }
                      ]"
                      @mouseenter="() => highlightOperatBtnChange($index + 1, oIndex + 1)"
                      @mouseleave="() => highlightOperatBtnChange(0, 0)"
                      @mouseup="() => highlightOperatBtnChange(0, 0)">
                      {{ oItem.name }}
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          v-for="odItem in oItem.dropdownList ||
                          (oItem.dropdownListFunc && oItem.dropdownListFunc(row)) ||
                          []"
                          :key="odItem.emit"
                          :command="odItem.emit">
                          {{ odItem.name }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                  <span
                    v-else
                    :class="[
                      'operate-btn',
                      { active: currentHighlightOperatBtn === `${$index + 1}_${oIndex + 1}` }
                    ]"
                    @click="operatCallback(oItem.emit, row, $index)"
                    @mouseenter="() => highlightOperatBtnChange($index + 1, oIndex + 1)"
                    @mouseleave="() => highlightOperatBtnChange(0, 0)"
                    @mouseup="() => highlightOperatBtnChange(0, 0)">
                    {{ oItem.name }}
                  </span>
                </template>
              </template>
            </div>
            <span v-else-if="item.isThousandF">
              {{ thousandFormat(row, item) }}
            </span>
            <span v-else>
              {{
                ((item.parentProp && row[item.parentProp] && row[item.parentProp][item.prop]) ||
                  row[item.prop] ||
                  '') + ((item.unitProp && row[item.unitProp]) || item.unit || '') ||
                item.defaultVal ||
                ''
              }}
            </span>
          </slot>
        </template>
      </el-table-column>
      <template #empty>
        <slot name="empty">
          <div class="table-empty">
            <div class="empty-img"></div>
            <div class="empty-text">暂无数据</div>
          </div>
        </slot>
      </template>
    </el-table>
    <!-- 底部分页 -->
    <pagination
      v-if="!props.hidePagination"
      v-model:pageNum="curPageNum"
      v-model:pageSize="curPageSize"
      :total="props.total"
      :layout="props.pageLayout"
      :sizes="props.pageSizes"
      :pagerCount="props.pagerCount"></pagination>
  </div>
</template>

<script lang="ts" setup name="CustomTable">
  interface CustomTableProps {
    showIndex?: boolean // 是否显示索引序号(默认不显示)
    showSelection?: boolean // 是否显示多选框(默认不显示)
    defaultSelectList?: any[] // 默认选中数据
    list?: any[] // 列表显示数据
    columns: any[] // 表格列配置
    operates?: any[] // 操作列配置
    // table配置属性
    rowKey?: string | ((row: any) => string) // 行数据的Key，用来优化Table的渲染；在使用reserve-selection功能与显示树形数据时该属性是必填的
    stripe?: boolean // 是否为斑马纹
    border?: boolean // 是否带有纵向边框
    isTableFill?: boolean // 表格是否fill
    hiddenExpandIcon?: boolean // 是否隐藏展开图标
    showHeader?: boolean
    height?: number | string
    maxHeight?: number | string
    defaultExpandAll?: boolean
    indent?: number
    treeProps?: { hasChildren?: string; children?: string; checkStrictly?: boolean }
    showOverflowTooltip?: boolean
    // 底部分页
    hidePagination?: boolean // 是否隐藏分页(默认显示)
    pageNum?: number // 当前页码
    pageSize?: number // 每页条数
    total?: number // 数据总数
    pagerCount?: number // 页码按钮的数量(默认7)
    pageLayout?: string // 分页布局
    pageSizes?: number[] // 每页条数选项
  }
  const props = withDefaults(defineProps<CustomTableProps>(), {
    showIndex: false,
    showSelection: false,
    defaultSelectList: () => [],
    list: () => [],
    columns: () => [],
    operates: () => [],
    // table配置属性
    rowKey: 'id',
    strip: false,
    border: false,
    isTableFill: true,
    hiddenExpandIcon: false,
    showHeader: true,
    defaultExpandAll: false,
    indent: 16,
    treeProps: () => {
      return { hasChildren: 'hasChildren', children: 'children', checkStrictly: false }
    },
    showOverflowTooltip: true,
    // 底部分页
    hidePagination: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    pagerCount: 7,
    pageLayout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: () => [10, 20, 30, 40, 50, 100]
  })

  const emits = defineEmits([
    'operate-callback',
    'selectionChange',
    // 分页事件
    'pageChange',
    'update:pageNum',
    'update:pageSize'
  ])

  const curPageNum = computed({
    get: () => props.pageNum,
    set: (val) => {
      emits('update:pageNum', val)
      emits('pageChange')
    }
  })
  const curPageSize = computed({
    get: () => props.pageSize,
    set: (val) => {
      emits('update:pageSize', val)
      emits('pageChange')
    }
  })

  // 当前高亮操作按钮
  const currentHighlightOperatBtn = ref('')
  const tableRef = ref()
  // 高亮操作列按钮
  const highlightOperatBtnChange = (rowIndex: any, colIndex: any) => {
    currentHighlightOperatBtn.value = !rowIndex || !colIndex ? '' : `${rowIndex}_${colIndex}`
  }

  // 列表索引格式处理
  const indexFormat = (index: number) => {
    return props.hidePagination ? index + 1 : (props.pageNum - 1) * props.pageSize + index + 1
  }
  // 选择项数组变化
  const selectionChange = (newSelection: any[]) => {
    emits('selectionChange', newSelection)
  }
  // 操作回调
  const operatCallback = (emitName: string, row: any, index: number) => {
    emits('operate-callback', { emitName: emitName, row: row, index: index })
  }

  // 数字千分位显示
  const thousandFormat = (row: any, item: any) => {
    if (item.parentProp) {
      return $utils.thousandFunc(
        row[item.parentProp] && row[item.parentProp][item.prop],
        item.reserveFloatLen
      )
    }
    return $utils.thousandFunc(row[item.prop], item.reserveFloatLen)
  }
  defineExpose({
    tableRef
  })
</script>

<style lang="scss" scoped>
  .custom-table {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .table {
      .table-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        .empty-img {
          width: 482px;
          height: 323px;
          background: url('#{$commonImgUrl}/list_table_empty.png') no-repeat center;
          background-size: contain;
        }
        .empty-text {
          font-size: 22px;
          color: #ccced3;
          transform: translateY(-60px);
        }
      }
      .operate-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;
        .operate-btn {
          font-size: 14px;
          color: #099d74;
          cursor: pointer;
          &:not(:first-child) {
            margin-left: 15px;
          }
        }
      }
      .space-pre {
        .cell span {
          white-space: pre;
        }
      }
    }
  }
</style>

<style lang="scss">
  .custom-table {
    .table {
      thead {
        tr {
          height: 44px !important;
          th {
            background: #f2f2f2 !important;
            font-size: 14px;
            color: #333333;
            .cell {
              padding: 0 10px;
              font-weight: bold;
              font-size: 14px;
              color: #333333;
              white-space: nowrap;
            }
          }
        }
      }
      td {
        padding: 12px 0;
        border-color: #f2f2f3;
      }
      .cell {
        font-size: 14px;
        color: #333333;
        white-space: nowrap;
      }
      .el-table__inner-wrapper::before {
        width: 0 !important;
      }
    }
    /* 隐藏展开图标 */
    .hide-expand-icon {
      .el-table__expand-icon {
        display: none;
      }
      .el-table__placeholder {
        width: 0;
      }
    }
  }
</style>
