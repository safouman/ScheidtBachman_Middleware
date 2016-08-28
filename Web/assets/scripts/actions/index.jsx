import axios from 'axios';
import {browserHistory} from 'react-router'
import {
    DEVICES_SELECTED,
    USER_ADDED,
    AUTH_ERROR,
    AUTH_USER,
    UNAUTH_USER,
    FETCH_DEVICE,
    CONFIRM_DEVICE,
    UNCONFIRM_DEVICE,
    UNSELECT_DEVICE,
    READ_DEVICE,
    SEND_ACK,
    FLUSH_READ_DATA,
    CONFIG_ERROR,
    CLEAR,
    SAVE_CONFIG,
    FETCH_LOG,
    LOG_FETCH_ERROR,
    LOG_NAMES,
    DOWNLAOD_LOG,
    UPLOAD_SUCCESS,
    RESET_UPLOAD,
    MIDDLEWARE,
    MIDDLEWARE_ERROR,
    CHECK_SEND,
    UNCHECK_SEND,
    CHECK_SENDALL,
    UNCHECK_SENDALL,
    SETMIDDLEWARE_ALL,
    SETMIDDLEWARE
} from './types'

import request  from 'superagent'
import callback from 'superagent'
const ROOT_URL = 'http://localhost:5000';


export function signinUser({username, password}) {
    return function (dispatch) {

        var config = {
            auth: {
                username,
                password
            }
        }

        axios.get(`${ROOT_URL}/api/token`, config)
            .then(response=> {

                //if request is good
                //-update state
                dispatch({type: AUTH_USER})
                //-save jwt token
                localStorage.setItem('token', response.data.token)
                //-redirect user
                browserHistory.push('/')

            })
            .catch(()=> {

                //show error
                dispatch(authError('Bad Login Info'));


            })
    }
}

export function signupUser({username, password}) {
    return function (dispatch) {
        axios.post(`${ROOT_URL}/api/signup`, {username, password})
            .then(response=> {

                //if request is good
                //-update state
                dispatch({type: USER_ADDED})


                //-redirect user
                browserHistory.push('/config')

            })
            .catch(response=> dispatch(authError(response.data.error)));


    }
}

export function authError(error) {
    return {
        type: AUTH_ERROR,
        payload: error
    };


}

export function signoutUser() {
    localStorage.removeItem('token');


    return {type: UNAUTH_USER};

}

export function fetchDevice() {
    return function (dispatch) {
        var token = localStorage.getItem('token')

        axios.get(`${ROOT_URL}/api/list_usb`, {
            auth: {
                username: token,
            }
        })
            .then(response=> {
                console.log("inside action", response.data)
                dispatch({
                    type: FETCH_DEVICE,
                    payload: response.data
                    //.replace(/\"([^(\")"]+)\":/g,"$1:")
                })
            })
            .catch(response=> dispatch(configError(response.error)));

    }

};

export function select_devices(selected) {

    return {
        type: DEVICES_SELECTED,
        payload: selected.devices
    };
}

export function unselect_device(index) {

    return {
        type: UNSELECT_DEVICE,
        payload: index
    }

};

export function confirm_device(confirmed_device) {

    return {
        type: CONFIRM_DEVICE,
        payload: confirmed_device
    };


};

export function unconfirm_device(index) {
    return {
        type: UNCONFIRM_DEVICE,
        payload: index
    };
};

export function read_device(index, path, Subsystem) {
    return function (dispatch) {

        var token = localStorage.getItem('token')
        axios.post(`${ROOT_URL}/api/read_device`, {path: path, Subsystem: Subsystem}, {
                auth: {
                    username: token,
                }
            }
        )
            .then(response=> {

                dispatch({
                    type: READ_DEVICE,
                    payload: {'id': index, 'data': response.data.test}

                })
            })

            .catch(response=> dispatch(configError(response.data.error)));


    }


};

export function send_ack(path, baudrate, Subsystem, ack, index) {
    return function (dispatch) {

        var token = localStorage.getItem('token')
        axios.post(`${ROOT_URL}/api/send_ack`, {path: path, baudrate: baudrate, Subsystem: Subsystem, ack: ack}, {
            auth: {
                username: token,
            }
        })
            .then(response=> {

                dispatch({
                    type: SEND_ACK,
                    payload: {'id': index, 'data': response.data.ack}

                })
            })

            .catch(response=> dispatch(configError(response.data.error)));

    }
};

export function flush_data() {
    return {
        type: FLUSH_READ_DATA

    }
};

export function clear() {
    return {
        type: CLEAR

    }
};

export function configError(error) {
    return {
        type: CONFIG_ERROR,
        payload: error
    };


};

export function saveConfig(config) {

    return function (dispatch) {
        console.log(config)
        var settings={settings:config}

        var token = localStorage.getItem('token')
        axios.post(`${ROOT_URL}/api/save_config`, {config: settings}, {
                auth: {
                    username: token,
                }
            }
        )
            .then(response=> {

                dispatch({
                    type: SAVE_CONFIG,
                    payload: {'data': response.data.result}

                })
            }).catch(response=> dispatch(configError(response.data.error)));


    }

}

export function logFetchError(error) {
    return {
        type: LOG_FETCH_ERROR,
        payload: error
    }
}
export function fetchLog(name = 'Main.log') {

    return function (dispatch) {
        axios.post(`${ROOT_URL}/api/fetch_log`, {name: name}, {async: false}).then(
            response=>

                dispatch({
                    type: FETCH_LOG,
                    payload: response.data

                })).catch(response =>dispatch(logFetchError("ERROR Fetching LOG")))
    }

}

export function logNames() {

    return function (dispatch) {
        axios.get(`${ROOT_URL}/api/log_names`, {async: false}).then(
            response=>

                dispatch({
                    type: LOG_NAMES,
                    payload: JSON.parse(response.data)

                })).catch(response =>dispatch(logFetchError("ERROR Fetching log Names")))
    }
}

export function downloadLog(name) {
    console.log("inside downlaodlog action", name)
    //
    window.open(ROOT_URL + '/api/download/' + name)


}

export function uploadFile(files) {
    console.log(files)
    return function (dispatch) {

        var req = request.post('http://localhost:5000/upload')
        files.forEach((file)=> {
            req.attach('file', file, file.name);
        });
        req.then(
            dispatch({
                type: UPLOAD_SUCCESS,
                payload: 'upload_success'

            })
        )


    };
}
export function resetUploadStatus() {
    return {
        type: RESET_UPLOAD,

    }

}
export function middlewareFetchError(error) {
    return {
        type: MIDDLEWARE_ERROR,
        payload: error
    }
}
export function middlwareNames() {

    return function (dispatch) {
        axios.get(`${ROOT_URL}/api/middlware_names`, {async: false}).then(
            response=>

                dispatch({
                    type: MIDDLEWARE,
                    payload: JSON.parse(response.data)

                })).catch(response =>dispatch(middlewareFetchError("ERROR Fetching existing middlwares")))
    }
}

export function CheckSendALL(confirmed_devices) {

    for (let item in confirmed_devices) {
        confirmed_devices[item].Send = true

    }

    return {
        type: CHECK_SENDALL,
        payload: confirmed_devices


    }


}

export function UnCheckSendALL(confirmed_devices) {

    for (let item in confirmed_devices) {
        confirmed_devices[item].Send = false

    }

    return {
        type: UNCHECK_SENDALL,
        payload: confirmed_devices


    }


}
export function CheckSend(confirmed_devices, index) {
    confirmed_devices[index].Send = true
    console.log(confirmed_devices)
    return {
        type: CHECK_SEND,
        payload: confirmed_devices


    }
}

export function UnCheckSend(confirmed_devices, index) {
    confirmed_devices[index].Send = false
    console.log(confirmed_devices)

    return {
        type: UNCHECK_SEND,
        payload: confirmed_devices


    }
}
export function setMiddleware_All(confirmed_devices, middlware) {

    for (let item in confirmed_devices) {
        confirmed_devices[item].Process = middlware
    }
    return {
        type: SETMIDDLEWARE_ALL,
        payload: confirmed_devices
    }

}

export function setMiddleware(confirmed_devices, middlware, index) {


    confirmed_devices[index].Process = middlware


    return {
        type: SETMIDDLEWARE,
        payload: confirmed_devices
    }

}