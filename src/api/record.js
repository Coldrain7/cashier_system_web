import http from '@http/http'
export const createRecords = query => http.POST('./api/record/createRecords', query)
export const getRecordsWithMember = query => http.GET('./api/record/getRecordsWithMember', query)
export const getRecordWithCommodity = query => http.GET('./api/record/getRecordWithCommodity', query)
export const getPendedRecords = query => http.GET(`./api/record/getPendedRecords/${query.supId}`, query)
