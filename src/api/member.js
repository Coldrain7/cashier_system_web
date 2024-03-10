import http from '@http/http'
export const memberPage = query => http.GET('./api/member/memberPage', query)
