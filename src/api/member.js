import http from '@http/http'
export const memberPage = query => http.GET('./api/member/memberPage', query)
export const updateMember = member => http.POST('./api/member/updateMember', member)
export const createMember = member => http.POST('./api/member/createMember', member)
export const deleteMemberById = member => http.DELETE(`./api/member/${member.id}`, member)
export const exportMembers = member => http.EXPORT('./api/member/exportMembers', member)
