import * as securedRestClient from '../utils/securedRestClient';

export async function fetchDataDemo(uid) {
    try {
        let url = `/mobile/product/${uid}`;
        const response = await securedRestClient.get(url);
        const { data } = response;
        return data;
    } catch (err) {

    }
    return {};
}