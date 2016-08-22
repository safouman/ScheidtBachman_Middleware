import {
   FETCH_LOG,
LOG_FETCH_ERROR,
LOG_NAMES,DOWNLAOD_LOG
} from '../actions/types';
export default function (state={}, action) {
    switch (action.type){
        case FETCH_LOG:
            console.log("inside log reducer",action.payload)
            return {...state,logdata:action.payload};
        case LOG_FETCH_ERROR:

             return {...state, logfetch_error: action.payload};
        case LOG_NAMES:
            return{...state,lognames:action.payload};
        case DOWNLAOD_LOG:
            return{...state}
    }
    return state;

}