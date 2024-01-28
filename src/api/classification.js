import http from '@http/http'
export const getClaOptions = id => http.GET('./api/classification/getOptions', id)
