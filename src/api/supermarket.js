import http from '@http/http'
export const marketRegister = name => http.POST('./api/supermarket/register', name)
