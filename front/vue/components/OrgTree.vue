<template>
  <div class="org-tree">
    <div class="title">{{ title }}</div>
    <custom-tree class="tree" :tree-data="orgTree" :current-id="orgId" @node-click="nodeClick"></custom-tree>
  </div>
</template>

<script>
export default {
  name: 'OrgTree',
  props: {
    // 面板标题
    title: {
      type: String,
      default: '党组织'
    },
    // 组织 id
    orgId: String,
    // 是否需要初始化 orgId：给 orgId 赋值最外层的第一级id, orgId 有值时失效
    needInit: Boolean
  },
  data() {
    return {
      // 组织树
      orgTree: []
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    // 组织树节点点击
    nodeClick(val) {
      this.$emit('node-click', val)
    },
    // 获取组织树数据
    async getTree() {
      const { code, data } = await this.$api.topeakBusinessServer.pbOrgTree().catch(err => err)
      if (code !== 200) return this.$message.error('获取党组织数据失败')
      if (!this.orgId && this.needInit && data && data[0]) this.nodeClick(data[0])
      this.orgTree = data
    }
  }
}
</script>

<style lang="less" scoped>
.org-tree {
  display: flex;
  flex-direction: column;
}

.title {
  flex-shrink: 0;
  padding: 0 20px;
  height: 60px;
  font-weight: bold;
  font-size: 18px;
  line-height: 60px;
  color: #565656;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

/deep/ .tree {
  .custom-tree-node {
    padding-right: 18px;
  }
}
</style>
