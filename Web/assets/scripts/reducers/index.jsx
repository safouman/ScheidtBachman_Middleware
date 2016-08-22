import {combineReducers} from 'redux';

import {reducer as form} from 'redux-form'
import authReducer from './auth_reducer'
import configReducer from './config_reducer'
import logReducer from './logviewer_reducer'
const rootReducer = combineReducers({
    form,
    auth: authReducer,
    config: configReducer,
    log: logReducer


});

export default rootReducer;
