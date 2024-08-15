import {
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,
  } from '../actions/signupaction'; // Adjust the path as necessary
  
  const initialState = {
    loading: false,
    user: null,
    error: null,
  };
  
  // Reducer
  const signupreducer = (state = initialState, action) => {
    switch (action.type) {
      case SIGNUP_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case SIGNUP_SUCCESS:
        return {
          ...state,
          loading: false,
          user: action.payload,
          error: null,
        };
      case SIGNUP_FAILURE:
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
  
  export default signupreducer;
  