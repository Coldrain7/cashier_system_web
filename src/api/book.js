import http from '@http/http'
export const getBookList = (query) => http.GET('./api/book/pageList', query)
