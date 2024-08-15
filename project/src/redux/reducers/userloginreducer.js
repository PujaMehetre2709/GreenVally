// src/redux/userLoginReducer.js

import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
  } from '../actions/userloginaction';
  
  const initialState = {
    loading: false,
    user: null,
    error: null,
  };
  
  const userLoginReducer = (state = initialState, action) => {
    switch (action.type) {
      case USER_LOGIN_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case USER_LOGIN_SUCCESS:
        return {
          ...state,
          loading: false,
          user: action.payload,
          error: null,
        };
      case USER_LOGIN_FAILURE:
        return {
          ...state,
          loading: false,
          user: null,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default userLoginReducer;
  