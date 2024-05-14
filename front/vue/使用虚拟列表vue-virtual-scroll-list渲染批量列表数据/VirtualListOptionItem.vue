<template>
  <el-option :label="source[labelKey]" :value="source[valueKey]"></el-option>
</template>

<script>
  export default {
    name: 'VirtualListOptionItem',
    props: {
      source: {
        type: Object,
        default() {
          return {}
        }
      },
      labelKey: {
        type: String,
        default: 'label'
      },
      valueKey: {
        type: String,
        default: 'value'
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
