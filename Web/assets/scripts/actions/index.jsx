
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
    SAVE_CONFIG
    
} from './types'

const ROOT_URL= 'http://localhost:5000';


export  function signinUser({username,password}) {
    return function (dispatch) {

        var config = { auth: {
    username,
    password
  }}

        axios.get(`${ROOT_URL}/api/token`,config)
            .then(response=>{

                //if request is good
                //-update state
                dispatch({type: AUTH_USER})
                //-save jwt token
                localStorage.setItem('token',response.data.token)
                //-redirect user
                 browserHistory.push('/config')

            })
            .catch(()=>{
                
                //show error
                dispatch(authError('Bad Login Info'));
                

            })
    }}

export function signupUser({username, password}) {
    return function (dispatch) {
        axios.post(`${ROOT_URL}/api/signup`,{username, password})
         .then(response=>{

                //if request is good
                //-update state
                dispatch({type: USER_ADDED})


                //-redirect user
                 browserHistory.push('/config')

    })
            .catch(response=> dispatch(authError(response.data.error)));




}}

export  function authError(error) {
    return {
        type:AUTH_ERROR,
        payload: error
    };


}

export  function signoutUser() {
    localStorage.removeItem('token');


    return{type: UNAUTH_USER};

}

export function fetchDevice() {
    return function (dispatch) {
        var token= localStorage.getItem('token')

        axios.get(`${ROOT_URL}/api/list_usb`,{
             auth: {
    username:token,
  }} )
            .then(response=>{
            
                 dispatch({
                     type: FETCH_DEVICE,
                     payload: response.data.results.result
                         //.replace(/\"([^(\")"]+)\":/g,"$1:")
                 })
            })
            .catch(response=> dispatch(configError(response.data.error)));

  }
    
};

export function select_devices(selected) {
  
    return {
             type: DEVICES_SELECTED,
                payload: selected.devices
         };
    }

export function unselect_device(index) {
   
    return{
        type:UNSELECT_DEVICE,
        payload:index
    }
    
};

export function confirm_device(confirmed_device) {
   
    return {
        type:CONFIRM_DEVICE,
        payload:confirmed_device
    };
    
  
};
    
export function unconfirm_device(index) {
    return{
        type:UNCONFIRM_DEVICE,
        payload:index
    };
};

export function read_device(index,path,Subsystem) {
     return function (dispatch) {
        
         var token= localStorage.getItem('token')
         axios.post(`${ROOT_URL}/api/read_device`,{path:path,Subsystem:Subsystem},{
             auth: {
    username:token,
  }}


         )
            .then(response=>{

                 dispatch({
                     type: READ_DEVICE,
                     payload:{'id':index,'data': response.data.test}

                 })
            })

             .catch(response=> dispatch(configError(response.data.error)));


  }


};

export function send_ack(path,baudrate,Subsystem,ack,index){
     return function (dispatch) {
         
         var token= localStorage.getItem('token')
         axios.post(`${ROOT_URL}/api/send_ack`,{path:path,baudrate:baudrate,Subsystem:Subsystem,ack:ack},{
             auth: {
    username:token,
  }})
   .then(response=>{

                 dispatch({
                     type: SEND_ACK,
                     payload:{'id':index,'data': response.data.ack}

                 })
            })

             .catch(response=> dispatch(configError(response.data.error)));
    
}};

export function flush_data() {
    return{
        type:FLUSH_READ_DATA
        
    }
};

export function clear() {
    return{
        type:CLEAR
        
    }
};

export  function configError(error) {
    return {
        type:CONFIG_ERROR,
        payload: error
    };


};

export function saveConfig(config) {
    return function (dispatch) {
              var token= localStorage.getItem('token')
         axios.post(`${ROOT_URL}/api/save_config`,{config:config},{
             auth: {
    username:token,
  }}


         )
            .then(response=>{

                 dispatch({
                     type: SAVE_CONFIG,
                     payload:{'data': response.data.result}

                 })
            })


  }
        
    }
