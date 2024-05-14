<template>
  <el-tree
    ref="treeRef"
    :class="customClass + ' custom-tree'"
    :data="treeData"
    node-key="id"
    :default-expand-all="defaultExpandAll"
    :highlight-current="highlightCurrent"
    :check-strictly="checkStrictly"
    :expand-on-click-node="expandOnClickNode"
    :current-node-key="currentId"
    :show-checkbox="showCheckbox"
    :filter-node-method="filterNodeMethod"
    :default-checked-keys="defaultCheckedKeys"
    @node-click="nodeClick"
    @check="nodeCheck"
  >
    <div class="custom-tree-node" slot-scope="{ node }">
      <!-- <img
        :src="
          node.level === 1
            ? require('../../assets/img/icon/icon-tree-label.png')
            : require('../../assets/img/icon/icon-tree-child-label.png')
        "
        alt=""
      /> -->
      <slot :node="node">
        <span class="custom-tree-node-label" :class="{ 'is-bold': node.level === 1 }">{{ node.label }}</span>
      </slot>
    </div>
  </el-tree>
</template>

<script>
export default {
  name: 'CustomTree',
  props: {
    treeData: {
      type: Array,
      default: () => []
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => []
    },
    currentId: {
      type: String,
      default: ''
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 节点过滤规则
    filterNodeMethod: {
      type: Function,
      default: () => true
    },
    // 是否高亮
    highlightCurrent: {
      type: Boolean,
      default: true
    },
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    // 是否在点击节点的时候展开或者收缩节点，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点
    expandOnClickNode: {
      type: Boolean,
      default: false
    },
    // 自定义类名
    customClass: String
  },
  watch: {
    currentId: {
      handler(val) {
        this.$nextTick(() => {
          this.$refs.treeRef.setCurrentKey(val || null)
        })
      },
      immediate: true
    }
  },
  methods: {
    nodeClick(data, node) {
      this.$emit('node-click', data, node)
    },
    nodeCheck(data, checkNode) {
      this.$emit('check', {data, checkNode})
    },
    // 暴露对树节点进行筛选操作方法
    filter(val) {
      this.$refs.treeRef.filter(val)
    }
  }
}
</script>

<style lang="less" scoped>
.custom-tree {
  flex: 1;
  overflow: auto;
}
/deep/ .el-tree-node__content {
  // min-height: 50px;
  height: 100%;
}
/deep/ .el-tree-node__expand-icon {
  font-size: 20px !important;
  color: #aaaaaa;
}
/deep/ .el-tree-node__expand-icon.is-leaf {
  color: transparent;
}
/deep/ .el-tree-node__expand-icon.expanded {
  transform: rotate(45deg);
}

.custom-tree-node {
  white-space: normal;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 50px;
  line-height: 30px;
  img {
    width: 26px;
    height: 26px;
    margin-right: 14px;
  }
  .custom-tree-node-label {
    flex: 1;
    // font-size: 18px;
    color: #565656;
  }
  .is-bold {
    font-weight: bold;
  }
}
</style>
