import axios, { CancelToken } from 'axios';

const basePath = 'api/v1/';

const cancelMap = {};

const REQUEST_CANCELED = "REQUEST_CANCELED";

const request = async (path, method, data = {}, options) => {
    if (options['cancelPrev'] == true && cancelMap[path]) {
        cancelMap[path].cancel(REQUEST_CANCELED);
    }
    cancelMap[path] = CancelToken.source();
    let respData = {}, isErrored = false;
    try {
        const obj = {
            url: basePath + path,
            method: method,
            cancelToken: cancelMap[path].token,
        };
        if (options.headers) obj.headers = options.headers;
        const resp = await axios(_.assign(obj, data));
        delete cancelMap[path];
        respData = resp.data;
    } catch (err) {
        delete cancelMap[path];
        if (_.isEqual(REQUEST_CANCELED, err.message)) {
            respData = err;
        } else {
            respData = err ?
                err.response ?
                    err.response.data ?
                        err.response.data :
                        err.response :
                    err :
                { message: 'Unexpected error occured' };
            isErrored = true;
        }
    }
    if (isErrored) throw respData;
    return respData;
}

class Request {

    static get = (path, params, options = {}) => {
        return request(path, 'GET', { params }, options);
    }

    static post = (path, data, options = {}) => {
        return request(path, 'POST', { data }, options);
    }

    static delete = (path, options = {}) => {
        return request(path, 'DELETE', {}, options);
    }

}

export default Request;