import * as config from './config';

const HOST = config.getConfiguration(config.HOST);

const HTTP_STATUS_FETCH_ERROR = 486;
const HTTP_STATUS_NETWORK_ERROR = 408;
const HTTP_EXCEPTIONS_FOR_APP = [
    { code: 403, type: 'ForbiddenError', message: 'Access is denied' },
];
const HTTP_EXCEPTIONS_FOR_SYSTEM = [
    { code: 200, type: 'Unknown', message: 'Unknown' },
];
const HTTP_EXCEPTIONS_FOR_NETWORK = [
    { code: 408, type: 'Network', message: '网络超时，请重试' },
];
function assembleBody(options) {
    if (!options.body) {
        return undefined;
    }
    return (options.isJson === true) ? JSON.stringify(options.body) : toQueryString(options.body);
}
function assembleOptions(options, restMethod) {
    let newOptions = options;
    if (!options) {
        newOptions = {};
    }

    return {
        ...newOptions,
        headers: { ...newOptions.headers, 'Content-Type': ((newOptions.isJson === true) ? 'application/json' : 'application/x-www-form-urlencoded') },
        body: assembleBody(newOptions),
        method: restMethod,
    };
}

function toQueryString(obj) {
    return obj ? Object.keys(obj).sort().map((key) => {
        const val = obj[key];
        if (Array.isArray(val)) {
            return val.sort().map(val2 => `${encodeURIComponent(key)}=${encodeURIComponent(val2)}`).join('&');
        }

        return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    }).join('&') : '';
}

function buildOptions(options) {
    let headers = options.headers;
    return {
        ...options,
        headers: {
            ...headers,
            Accept: 'text/plain, application/json, application/*+json, */*',
        }
    }
}

function buildUrl(url, options) {
    let newURL = `${HOST}${url}`;
    const paramStr = toQueryString(options.params);
    if (paramStr && paramStr.length > 0) {
        newURL += `?${paramStr}`;
    }
    return newURL;
}

function timeout(ms, promise) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            const error = new Error();
            error.network = true;
            error.type = 'Network';
            error.message = '网络超时，请重试';
            reject(error);
        }, ms);
        promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            },
        );
    });
}

function filterException(array, response, data) {
    for (let id = 0; id < array.length; id += 1) {
        const entry = array[id];
        if ((entry.code !== response.status)) {
            return false;
        }

        if (!data.errors) {
            return false;
        }

        for (let i = 0; i < data.errors.length; i += 1) {
            const err = data.errors[i];
            if ((entry.type === err.type) && (entry.message === err.message)) {
                console.debug('Filter in exception matching: ', entry);
                return true;
            }
        }
    }

    return false;
}

async function checkStatus(response) {
    let data = response;
    console.log(response);
    if (response.status !== HTTP_STATUS_FETCH_ERROR && response.status !== HTTP_STATUS_NETWORK_ERROR) {
        if (response.headers.get('content-length') === '0') {
            data = {};
        } else {
            data = await response.json();
        }
    }

    if (response.ok) {
        return data;
    }

    console.debug(`Status: ${response.status} statusText: ${response.statusText}`);
    console.debug('Exception data:', data);

    const isAPPException = filterException(HTTP_EXCEPTIONS_FOR_APP, response, data);
    const isSystemException = filterException(HTTP_EXCEPTIONS_FOR_SYSTEM, response, data);
    if (!isAPPException || isSystemException) {
        Toast.fail('系统异常', 2);
    }

    const isNetworkException = filterException(HTTP_EXCEPTIONS_FOR_NETWORK, response, data);
    if (isNetworkException) {
        Toast.fail('网络连接超时，请检查网络', 2);
    }

    const error = new Error(response.statusText);
    error.status = response.status;
    error.data = data;
    throw error;
}
export async function request(url, options) {
    const buildURL = buildUrl(url, options);
    const buildOption = buildOptions(options);
    let response = {};
    try {
        response = await timeout(20 * 1000, fetch(buildURL, buildOption));
    } catch (err) {
        if (err.network) {
            response = {
                ok: false,
                status: HTTP_STATUS_NETWORK_ERROR,
                statusText: '网络超时，请重试',
                errors: [err],
            };
        } else {
            response = {
                ok: false,
                status: HTTP_STATUS_FETCH_ERROR,
                statusText: `Fetch error: ${err}`,
            };
        }
    }

    const data = await checkStatus(response);

    const ret = {
        data,
        headers: {},
    };

    if (response.headers.get('x-total-count')) {
        ret.headers['x-total-count'] = response.headers.get('x-total-count');
    }

    console.log('Response: ', ret);
    return ret;
}

export function post(url, options) {
    return request(url, assembleOptions(options, 'POST'));
}

export function get(url, options) {
    const option = assembleOptions(options, 'GET');
    return request(url, option);
}

export function put(url, options) {
    return request(url, assembleOptions(options, 'PUT'));
}

export function patch(url, options) {
    return request(url, assembleOptions(options, 'PATCH'));
}

export function remove(url, options) {
    return request(url, assembleOptions(options, 'DELETE'));
}

export function head(url, options) {
    return request(url, assembleOptions(options, 'HEAD'));
}