// _parID 父节点标识.标识它是父节点的值(数据是乱的,给出pid的值找不到对应id,则传空)
export const getTreeData = (
  data: Array<any>,
  idKey = 'id',
  parentIdKey = 'parentId',
  childrenKey = 'children',
  _parID?: any,
): Array<any> => {
  if (!data || data.length === 0) {
    return []
  }
  if (_parID === undefined || _parID === null || _parID === '') {
    // 找根数据（根节点的pid未知）
    const disParentCode: Array<any> = []
    // 遍历出所有的上级ID
    for (const item of data) {
      const parID = item[parentIdKey]
      if (disParentCode.indexOf(parID) > -1) {
        continue
      }
      disParentCode.push(parID)
    }
    // 遍历出所有的ID
    const disCode: Array<any> = []
    for (const item of data) {
      const funID = item[idKey]
      disCode.push(funID)
    }
    const notExisted: Array<any> = []
    for (const item of disParentCode) {
      if (disCode.indexOf(item) === -1) {
        notExisted.push(item)
      }
    }
    const resultList: Array<any> = []
    for (const item of data) {
      const parID = item[parentIdKey]
      if (notExisted.indexOf(parID) > -1) {
        resultList.push(item)
      }
    }
    // 查找下级
    for (const item of resultList) {
      const funID = item[idKey]
      const temp = getTreeData(data, idKey, parentIdKey, childrenKey, funID)
      if (temp.length > 0) {
        item[childrenKey] = temp
      }
    }
    return resultList
  } else {
    // 根节点的pid已知
    const resultList: Array<any> = []
    for (const item of data) {
      const parID = item[parentIdKey]
      if (parID !== null && parID === _parID) {
        resultList.push(item)
      }
    }
    // 查找下级
    for (const item of resultList) {
      const funID = item[idKey]
      const temp = getTreeData(data, idKey, parentIdKey, childrenKey, funID)
      if (temp.length > 0) {
        item[childrenKey] = temp
      }
    }
    return resultList
  }
}
export const deleteOptionsEmptyChildren = (options) => {
  options.forEach((option) => {
    if (option.children && option.children.length) {
      deleteOptionsEmptyChildren(option.children)
    } else {
      delete option.children
    }
  })
  return options
}
export const getSelectedIds = (
  data: Array<any>,
  id: String,
  parentKey = 'parentId',
  key = 'id',
  childrenKey = 'children',
) => {
  // rootPId作用：根节点的pId设置为了一个值，但是找不到对应的以pId的值为id的节点， 也就是说根节点的pId是无效的，不能被push进来(过滤脏数据)
  // 找到第一级的pId(rootPId)
  const rootPIds = data.map((item) => item[parentKey])
  const selResult: Array<any> = []
  function findSel(data: Array<any>, id: String) {
    let isFind = false
    for (const i of data) {
      if (isFind) {
        break
      }
      if (i[key] !== id) {
        if (undefined !== i[childrenKey] && i[childrenKey] !== null) {
          if (i[parentKey] && !rootPIds.includes(i[parentKey])) {
            selResult.push(i[parentKey])
          }
          isFind = findSel(i[childrenKey], id)
        }
      } else {
        if (i[parentKey] && !rootPIds.includes(i[parentKey])) {
          selResult.push(i[parentKey])
        }
        selResult.push(id)
        isFind = true
      }
    }
    if (!isFind) {
      selResult.pop()
    }
    return isFind
  }
  findSel(data, id)
  return selResult
}
export const setParentKey = (treeData: Array<any>, idKey = 'id', pIdKey = 'parentId') => {
  const findData = (list: Array<any>, pId?: String) => {
    list.forEach((item) => {
      item[pIdKey] = item[pIdKey] || pId
      if (item.children?.length) {
        findData(item.children, item[idKey])
      }
    })
  }
  findData(treeData)
  return treeData
}
