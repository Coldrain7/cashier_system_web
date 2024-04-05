import http from '@http/http'
export const getSupplierOptions = supId => http.GET('./api/supplier/getOptions', supId)
export const getSupplier = supplier => http.GET('./api/supplier/getSuppliers', supplier)
export const getSupplierById = supplier => http.GET(`./api/supplier/${supplier.id}`, supplier)
export const updateSupplier = supplier => http.GET('./api/supplier/updateSupplier', supplier)
export const createSupplier = supplier => http.POST('./api/supplier/createSupplier', supplier)
