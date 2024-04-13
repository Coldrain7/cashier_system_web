import http from '@http/http'
export const marketRegister = name => http.POST('./api/supermarket/register', name)
export const getSupermarketById = query => http.GET(`./api/supermarket/${query.supId}`, query)
export const updateSupermarket = supermarket => http.POST('./api/supermarket/updateSupermarket', supermarket)
