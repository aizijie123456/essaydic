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

async function buildOptions(options) {
    let headers = options.headers;
    return {
        ...options,
        headers: {
            ...headers,
            Accept: 'text/plain, application/json, application/*+json, */*',
        }
    }
}

async function buildUrl(url, options) {
    let newURL = `${HOST}${url}`;
    const parameters = toQueryString(options.params);
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

export async function request(url, options) {
    const buildOptions = await buildOptions(options);
    const buildURL = buildUrl(url, options);
    let response = {};
    try {
        response = await timeout(20 * 1000, fetch(buildURL, buildOptions));
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
}

export function post(url, options) {
    return request(url, assembleOptions(options, 'POST'));
}

export function get(url, options) {
    return request(url, assembleOptions(options, 'GET'));
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