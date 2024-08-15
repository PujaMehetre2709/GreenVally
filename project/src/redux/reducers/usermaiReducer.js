// redux/reducers/userMaiReducer.js
import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    ADD_USER_SUCCESS,
    DELETE_USER_SUCCESS,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
  } from '../actions/usermaiActions';
  
  const initialState = {
    users: [],
    loading: false,
    error: null,
  };
  
  const usermaiReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_USERS_REQUEST:
      case UPDATE_USER_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_USERS_SUCCESS:
        return {
          ...state,
          loading: false,
          users: action.payload,
        };
      case ADD_USER_SUCCESS:
      case DELETE_USER_SUCCESS:
        return {
          ...state,
          loading: false,
        };
      case UPDATE_USER_SUCCESS:
        return {
          ...state,
          loading: false,
          users: state.users.map(user =>
            user.user_id === action.payload.user_id ? action.payload : user
          ),
        };
      case FETCH_USERS_FAILURE:
      case UPDATE_USER_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default usermaiReducer;
  