import http from '@http/http'
export const getUnitOptions = supId => http.GET('./api/unit/getOptions', supId)
