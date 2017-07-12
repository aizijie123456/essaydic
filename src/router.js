import React from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';
// import Toast from 'antd-mobile/lib/toast';
import { Toast } from 'antd-mobile';
import { HomeView, AdView } from './routes';
let timeOutId = 0;
let backPressTimes = 0;
const onExitApp = () => {
    clearTimeout(timeOutId);
    if (backPressTimes > 0) {
        backPressTimes = 0;
        return false;
    }
    Toast.info('再点一次退出程序', 1, null, false);
    backPressTimes += 1;
    timeOutId = setTimeout(() => {
        backPressTimes = 0;
    }, 1000);
    return true;
};


const AppRouter = () => (
    <Router onExitApp={onExitApp}>
        <Scene key="root">
            {/* home */}
            <Scene key="ad" hideNavBar component={AdView} type="reset" initial />
            <Scene key="home" hideNavBar component={HomeView} type="reset" />
            {/* login */}
            {/*<Scene key="userLogin" component={LoginView} hideNavBar type="reset"  />*/}
        </Scene>
    </Router>
);

export default AppRouter;