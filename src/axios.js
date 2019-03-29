import axios from 'axios'

const getObjectFirstProperty = (object = {}) => {
    for (let key in object) {
        return [key, object[key]];
    }
};

const deleteObjectFirstProperty = (object = {}) => {
    for (let key in object) {
        delete object[key];
        return
    }
};

let headerExceptRequestURLs = [];
let headerOptions = [];
let handleGlobalServerException = (response) => {};
let handleGlobalServerCode = (error) => {};

const service = axios.create();
service.withCredentials = true;

service.defaults.adapter = (config) => {
    return new Promise((resolve, reject) => {
        const { url , params: data, headers: header, method } = config;
        uni.request({
            url,
            header,
            method,
            data,
            success(res) {
                resolve(res)
            },
            fail(res) {
                reject(res);
            },
        })
    })
};

service.interceptors.request.use(config => {
    let hasUrl = headerExceptRequestURLs.some(url => url === config.url);
    if (!hasUrl) {
        headerOptions.forEach((header) => {
            config.headers[header[0]] = header[1];
        });
    }
    return config;
}, error => {
    Promise.reject(error)
});

service.interceptors.response.use(
    response => {
        handleGlobalServerCode(response);
        return response;
    },
    error => {  //响应错误处理
        handleGlobalServerException(error);
        return Promise.reject(error)
    }
);

service.getData = (url, par, options = {}) => {
    let queryParams = {
        params: {
            _t: new Date().getTime()
        }
    };
    if (par) {
        let params = Object.assign(queryParams.params, par);
        queryParams = {
            params
        }
    }
    queryParams = Object.assign(queryParams, options);
    return new Promise((resolve, reject) => {
        service.get(url, queryParams)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
};

service.postData = (url, par, options = {}) => {
    let queryParams = {
        params: {
            _t: new Date().getTime()
        }
    };
    if (par) {
        let params = Object.assign(queryParams.params, par);
        queryParams = {
            params
        }
    }
    queryParams = Object.assign(queryParams, options);
    return new Promise((resolve, reject) => {
        service.post(url, null, queryParams)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
};

service.postJSON = (url, par, options = {headers: {'Content-Type': 'application/json'}}) => {
    let queryParams = {
        params: {
            _t: new Date().getTime()
        }
    };
    if (par) {
        let params = Object.assign(queryParams.params, par);
        queryParams = {
            params
        }
    }
    queryParams = Object.assign(queryParams, options);
    return new Promise((resolve, reject) => {
        service.post(url, null, queryParams)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
};

service.setBaseUrl = (baseURL) => {
    service.defaults.baseURL = baseURL;
};

service.setTimeout = (time) => {
    service.defaults.timeout = time;
};

service.addHeader = (key = '', value = '') => {
    headerOptions.push([key, value])
};

service.setHeadersExcept = (URLs = []) => {
    headerExceptRequestURLs = URLs;
};

service.changeIsWithCredentials = (isWithCredentials) => {
    service.withCredentials = isWithCredentials;
};

service.setHandleGlobalServerException = (fn) => {
    handleGlobalServerException = fn;
};

service.setHandleGlobalServerCode = (fn) => {
    handleGlobalServerCode = fn;
};

export default service;
