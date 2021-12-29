import { request } from '@/utils/request'
import { deleteOptionsEmptyChildren, getTreeData, setParentKey } from '@/utils/methods'
export function getAreaMarkerList(params: API.GetAreaMarkerListParams) {
  // <BaseResponse<API.GetAreaMarkerListResult>> isGetDataDirectly: false
  return request<API.GetAreaMarkerListResult>(
    {
      url: '/pc-c-gov/analysis/v1/analysisArea',
      method: 'get',
      params,
    },
    {
      isGetDataDirectly: true,
    },
  )
}
export function getAreaList() {
  return request<API.GetAreaListResult>({
    url: '/pc/area/v1/areas/all',
    method: 'get',
  }).then((res) => {
    res = res
      .filter(({ code }) => code !== '0')
      .map((item) => {
        return {
          ...item,
          areaName: item.name,
          areaCode: ~~item.code,
        }
      })
    res = setParentKey(getTreeData(res), 'areaCode', 'parentAreaCode')
    return deleteOptionsEmptyChildren(res)
  })
}
