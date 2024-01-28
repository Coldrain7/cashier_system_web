import http from '@http/http'
export const getSupplierOptions = supId => http.GET('./api/supplier/getOptions', supId)
