import { combineReducers } from 'redux';

import {reducer as form} from 'redux-form'
import authReducer from './auth_reducer'
import configReducer from './config_reducer'
const rootReducer = combineReducers({
 form,
 auth:authReducer,
 config:configReducer,
 

});

export default rootReducer;
