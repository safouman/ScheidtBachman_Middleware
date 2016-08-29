import {
    DEVICES_SELECTED,
    UNSELECT_DEVICE,
    CONFIRM_DEVICE,
    UNCONFIRM_DEVICE,
    READ_DEVICE,
    SEND_ACK,
    FLUSH_READ_DATA,
    CONFIG_ERROR,
    CLEAR,
    SAVE_CONFIG,
    UPLOAD_SUCCESS,
    RESET_STATUS,
    MIDDLEWARE,
    MIDDLEWARE_ERROR,
    CHECK_SEND,
    UNCHECK_SEND,
    CHECK_SENDALL,
    UNCHECK_SENDALL,
    SETMIDDLEWARE_ALL,
    SETMIDDLEWARE,
    GET_CONFIG,
    GET_STATUS,
    START_MIDDLEWARE,
    KILL_MIDDLEWARE
} from '../actions/types'
const confirmed_devices = [];
export default function (state = {confirmed_devices: [], status: false}, action) {
    switch (action.type) {
        case DEVICES_SELECTED:

            return {...state, selected_devices: action.payload};
        case UNSELECT_DEVICE:

            return {
                ...state, selected_devices: [...state.selected_devices.slice(0, action.payload),
                    ...state.selected_devices.slice(action.payload + 1)]
            }
        case CONFIRM_DEVICE:


            return {
                ...state, confirmed_devices: [
                    ...state.confirmed_devices,
                    action.payload,

                ]
            }
        case UNCONFIRM_DEVICE:


            return {
                ...state, confirmed_devices: [...state.confirmed_devices.slice(0, action.payload),
                    ...state.confirmed_devices.slice(action.payload + 1)],
                config: ""
            }
        case READ_DEVICE:

            return {...state, read_data: action.payload}

        case SEND_ACK:
            console.log(action.payload)
            return {...state, ack: action.payload}
        case FLUSH_READ_DATA:

            return {...state, read_data: [], confirmed_devices: [], ack: "", config_error: "", config: ""}
        case CONFIG_ERROR:
            return {...state, config_error: action.payload};
        case CLEAR:
            return {...state, read_data: [], ack: "", config_error: ""}
        case SAVE_CONFIG:
            console.log("config", action.payload)
            return {...state, config: action.payload}
        case UPLOAD_SUCCESS:
            return {...state, status: true}
        case RESET_STATUS:
            return {...state, status: false}
        case MIDDLEWARE:
            return {...state, middleware_names: action.payload}
        case MIDDLEWARE_ERROR:
            return {...state, middleware_names_error: action.payload};
        case CHECK_SENDALL:
            return {...state, confirmed_devices: action.payload, checksend: true}
        case UNCHECK_SENDALL:
            return {...state, confirmed_devices: action.payload, checksend: false}
        case CHECK_SEND:
            return {...state, confirmed_devices: action.payload}
        case UNCHECK_SEND:
            return {...state, confirmed_devices: action.payload}
        case SETMIDDLEWARE_ALL:
            return {...state, confirme_devices: action.payload}
        case SETMIDDLEWARE:
            return {...state, confirmed_devices: action.payload}
        case GET_CONFIG:
            return {...state, configfile: action.payload}
        case GET_STATUS:
            return {...state, middleware_status: action.payload}
        case START_MIDDLEWARE:
            return {...state, status: true, message: action.payload}
        case KILL_MIDDLEWARE:
            return {...state, status: true, message: action.payload}
    }

    return state;
};

