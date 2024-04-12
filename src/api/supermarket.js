import http from '@http/http'
export const marketRegister = name => http.POST('./api/supermarket/register', name)
export const getSupermarketById = query => http.GET(`./api/supermarket/${query.supId}`, query)
