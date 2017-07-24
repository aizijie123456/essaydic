import * as homeService from '../../services/homeService';

export default {
    namespace: 'home',
    state: {
        id: '',
        name: '',
        desc: '',
    },
    effects: {
        * fetchDataDemo({ uid }, { call, put }) {
            const response = yield call(homeService.fetchDataDemo, uid)
            const { id, name, desc } = response;
            yield put({ type: 'updateState', id, name, desc });
        }
    },
    reducers: {
        updateState(state, { id, name, desc }) {
            return { ...state, id, name, desc };
        },
    },
};
