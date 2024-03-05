import http from '@http/http'
export const getClaOptions = id => http.GET('./api/classification/getOptions', id)
export const addClassification = classification => http.POST('./api/classification/createClassification', classification)
