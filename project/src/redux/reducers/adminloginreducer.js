import { ADMIN_LOGIN_REQUEST,
   ADMIN_LOGIN_SUCCESS, 
   ADMIN_LOGIN_FAILURE ,
   ADMIN_LOGOUT_SUCCESS, 
   ADMIN_LOGOUT_FAILURE } from '../actions/adminloginaction';

const initialState = {
  admin: null,
  loading: false,
  error: null,
};

const adminLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_LOGIN_SUCCESS:
      return {
        ...state,
        admin: action.payload,
        loading: false,
        error: null,
      };
    case ADMIN_LOGIN_FAILURE:
      return {
        ...state,
        admin: null,
        loading: false,
        error: action.payload,
      };
      case ADMIN_LOGOUT_SUCCESS:
      return {
        ...state,
        admin: null,
        loading: false,
        error: null,
      };
    case ADMIN_LOGOUT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default adminLoginReducer;
