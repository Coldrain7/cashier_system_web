import http from '@http/http'
export const getEvents = query => http.GET('./api/event/getEvents', query)
export const createEvents = events => http.POST('./api/event/createEvent', events)
export const getEventById = id => http.GET(`./api/event/${id}`, id)
export const getEventCommodities = id => http.GET(`./api/event/getEventCommodities/${id}`, id)
export const updateEventCommodities = event => http.POST('./api/event/updateEvents', event)
export const deleteEventById = id => http.DELETE(`./api/event/${id}`, id)
