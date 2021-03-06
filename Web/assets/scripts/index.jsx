import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import  {Router, Route, browserHistory, IndexRoute} from 'react-router';
import reducers from './reducers';
import App from './components/app';
import Config from './components/configView/config';
import Signin from './components/auth/signin';
import Signup from './components/auth/signup';
import Signout from './components/auth/signout';
import Welcome from './components/welcome';
import Devicelist from './components/configView/deviceprops';
import ConfigStepper from './components/configView/configstepper'
import requireAuth from './components/higherOrderComponents/require_authentication';
import Container from './components/LogViewer/Container';
import injectTapEventPlugin from 'react-tap-event-plugin';
import reduxThunk from 'redux-thunk';
import {AUTH_USER} from './actions/types'
import StatusContainer from './components/Status/Status'

injectTapEventPlugin();

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers)
const token = localStorage.getItem('token');
//if we have a token consider the user logged in
if (token) {
    store.dispatch({type: AUTH_USER})
}


ReactDOM.render(
    <Provider store={store}>

        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Welcome}/>
                <Route path="configdevices" component={requireAuth(ConfigStepper)}/>
                <Route path="Status" component={requireAuth(StatusContainer)}/>
                <Route path="logviewer" component={Container}/>
                <Route path="signin" component={Signin}/>
                <Route path="signout" component={Signout}/>
                <Route path="signup" component={requireAuth(Signup)}/>
            </Route>
        </Router>

    </Provider>
    , document.getElementById('app'));
