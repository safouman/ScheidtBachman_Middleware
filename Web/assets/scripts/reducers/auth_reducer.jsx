/**
 * Created by safwen on 6/1/16.
 */
import {AUTH_USER ,UNAUTH_USER ,AUTH_ERROR,USER_ADDED,FETCH_DEVICE,DEVICES_SELECTED} from '../actions/types'
export default function (state={}, action) {
    switch (action.type){
        case USER_ADDED:
            return {...state,error:''};
        case AUTH_USER:
            return {...state, error:'', authenticated:true} ;
        case UNAUTH_USER:
            return{...state, authenticated:false};
        case AUTH_ERROR:
            return {...state, error: action.payload};
        case FETCH_DEVICE:
            console.log("fetching", action.payload)
            return{...state, devices:action.payload };
       
    }
    return state;

}