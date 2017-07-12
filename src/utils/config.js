//this is used for switch dev or prod config parameters
const config = __DEV__ ? require('../config.dev.json') : require('../config.pro.json');
export const getConfiguration = key => config[key];
export const HOST = 'host';

//this is used to set dev flag ant invoke logger method
export const isDev = () => __DEV__;

//define other golabl config parameters
