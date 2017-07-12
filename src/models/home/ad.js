import { Actions } from 'react-native-router-flux';
export default {
    namespace: 'ad',
    state: {
        tickCount: 3,
    },
    effects: {
        *countdownStart({ payload: { tick, count } }, { call, put }) {
            const delay = (timeout) => {
                return new Promise(resolve => {
                    setTimeout(resolve, timeout);
                });
            };
            yield call(delay, tick);
            count--;
            if (count > 0) {
                yield put({ type: 'refreshTick' });
                yield put({ type: 'countdownStart', payload: { tick, count } });
            } else {
                Actions.home()
            }
        },
        *skipStartPage({ payload: { } }, { call, put }) {
            console.log("action.home()");
            // ;
        },
    },
    reducers: {
        refreshTick(state) {
            const tickCount = state.tickCount - 1;
            return { ...state, tickCount };
        },
    },
};
