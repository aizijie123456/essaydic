import React from 'react';
import dva from 'dva/mobile';
import Router from './router.js';
import createLogger from 'redux-logger';
import * as models from './models';
import * as config from './utils/config.js';

const app = config.isDev() ? dva(
    {
        onAction: createLogger({
        }),
    }
) : dva();

Object.keys(models).forEach(key => app.model(models[key]));

app.router(() => <Router />);

export default app;
