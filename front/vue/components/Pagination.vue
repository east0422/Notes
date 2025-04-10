<template>
  <el-pagination
    v-model:current-page="curPageNum"
    v-model:page-size="curPageSize"
    :background="props.isBackground"
    :pager-count="props.pagerCount"
    :layout="props.layout"
    :total="props.total"
    :hide-on-single-page="props.hideOnSinglePage"
    :page-sizes="props.sizes"
    class="hcontainer pagination" />
</template>

<script setup lang="ts" name="Pagination">
  interface PaginationProps {
    pageNum?: number
    pageSize?: number
    total?: number
    pagerCount?: number
    isBackground?: boolean // 是否为分页按钮添加背景色
    hideOnSinglePage?: boolean // 只有一页时是否隐藏
    layout?: string
    sizes?: Array<number>
  }
  const props = withDefaults(defineProps<PaginationProps>(), {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    isBackground: true,
    hideOnSinglePage: false,
    pagerCount: 5,
    layout: 'prev, pager, next, sizes, total',
    sizes: () => [10, 20, 30, 40, 50, 100]
  })

  const emits = defineEmits(['update:pageNum', 'update:pageSize', 'change'])

  const curPageNum = computed({
    get: () => props.pageNum,
    set: (val) => {
      emits('update:pageNum', val)
      emits('change')
    }
  })
  const curPageSize = computed({
    get: () => props.pageSize,
    set: (val) => {
      emits('update:pageSize', val)
      emits('change')
    }
  })
</script>

<style lang="scss" scoped></style>
