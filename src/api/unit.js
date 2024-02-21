import http from '@http/http'
export const getUnitOptions = supId => http.GET('./api/unit/getOptions', supId)
export const addUnit = unit => http.POST('./api/unit/createUnit', unit)
export const deleteUnitById = unit => http.DELETE(`./api/unit/${unit.id}`, unit)
