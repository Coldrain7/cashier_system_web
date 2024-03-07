import http from '@http/http'
export const getClaOptions = id => http.GET('./api/classification/getOptions', id)
export const addClassification = classification => http.POST('./api/classification/createClassification', classification)
export const deleteClaById = id => http.DELETE(`./api/classification/${id}`, id)
export const searchClassifications = query => http.GET('./api/classification/searchClassifications', query)
