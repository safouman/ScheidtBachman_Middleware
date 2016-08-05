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
    SAVE_CONFIG
} from '../actions/types'
const confirmed_devices=[];
export default function (state={confirmed_devices:[]}, action) {
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
                          ...state.confirmed_devices.slice(action.payload + 1)]
                  }
              case READ_DEVICE:

                  return {...state, read_data: action.payload}

              case SEND_ACK:
                  console.log(action.payload)
                  return {...state, ack:action.payload}
              case FLUSH_READ_DATA:

                  return {...state, read_data: [], confirmed_devices:[],ack:"",config_error:""}
              case CONFIG_ERROR:
                  return {...state, config_error: action.payload};
              case CLEAR:
                  return {...state,read_data: [],ack:"", config_error:""}
              case SAVE_CONFIG:
                  console.log("config",action.payload)
                  return{...state,config:action.payload}
          }

  return state;
};

