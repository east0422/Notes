let list = [
  { id: 1, name: '部门 A', pid: 0 },
  { id: 2, name: '部门 B', pid: 0 },
  { id: 3, name: '部门 C', pid: 1 },
  { id: 4, name: '部门 D', pid: 1 },
  { id: 5, name: '部门 E', pid: 2 },
  { id: 6, name: '部门 F', pid: 3 },
  { id: 7, name: '部门 G', pid: 8 },
  { id: 8, name: '部门 H', pid: 4 }
]

// 将对象转换为树结构数据
function convertToTree(arr) {
  if (!Array.isArray(arr)) {
    return []
  }

  let map = {} // id对象
  let pMap = {} // pid对象
  let pids = [] // pids数组
  let ids = [] // id数组
  arr.map((item) => {
    ids.push(item.id)
    pids.push(item.pid)
    map[item.id] = item
    if (pMap[item.pid]) {
      pMap[item.pid].push(item)
    } else {
      pMap[item.pid] = [item]
    }
  })
  let nodes = {}
  arr.map((item) => {
    if (!ids.includes(item.pid)) { // 根节点
      nodes[item.id] = item
      findChild(item)
      
      function findChild(curItem) { // 递归遍历子节点
        if (pMap[curItem.id]) {
          curItem.children = pMap[curItem.id]
          pMap[curItem.id].forEach((item1) => {
            findChild(item1)
          })
        }
      }
    }
  })

  return Object.values(nodes)
}

const trees = convertToTree(list)
// for (const item of trees) {
//   console.log(item)
// }

// 打印树结构
function printTree(trees, indent = 0) {
  let spaceStartStr = ' '.repeat(indent === 0 ? 0 : indent * 2)
  let spaceStr = ' '.repeat(indent === 0 ? indent + 2 : indent * 2 + 2)
  trees.forEach((item) => {
    if (item.children) {
      console.log(`${spaceStartStr}{\n${spaceStr}id: ${item.id},\n${spaceStr}name: '${item.name}',\n${spaceStr}pid: ${item.pid},\n${spaceStr}children:  [`)
      printTree(item.children, indent + 2)
      console.log(`${spaceStr}]\n${spaceStartStr}}`)
    } else {
      console.log(`${spaceStartStr}{\n${spaceStr}id: ${item.id},\n${spaceStr}name: '${item.name}',\n${spaceStr}pid: ${item.pid},\n${spaceStr}children:  []\n${spaceStartStr}}`)
    }
  })
}

printTree(trees, 0)