declare namespace API {
  type GetAreaMarkerListParams = {
    areaId: string
  }

  type GetAreaMarkerListResult = {}
  type GetAreaListResultItem = {
    code: String
    name: String
  }
  type GetAreaListResult = GetAreaListResultItem[]
}
