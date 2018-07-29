import axios from 'axios';


if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = 'http://localhost:3000/api';
}else{
    axios.defaults.baseURL = 'http://47.98.177.214/api';
}



// axios.defaults.headers.common['Authorization'] = '';
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';


// 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//     // 在发送请求之前做些什么
//     return config;
// }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
// });

// 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//     // 对响应数据做点什么
//     return response;
// }, function (error) {
//     // 对响应错误做点什么
//     return Promise.reject(error);
// });


export default {
    search(text) {
        return axios.get(`search/${text}`);
    },
    historicalEarnings(id) {
        return axios.get(`historicalEarnings/${id}`);
    },
    earningsCalendar(dateFrom, dateTo, country) {
        return axios.get('earningsCalendar', {
            params: {
                dateFrom,
                dateTo,
                country
            }
        })
    },
    historicalData(pairId, dateFrom, dateTo) {
        return axios.get('historicalData', {
            params: {
                pairId,
                dateFrom,
                dateTo
            }
        })
    }
}  