import { 
    FETCH_CUSTOMERS_REQUEST,
    FETCH_CUSTOMERS_SUCCESS,
    FETCH_CUSTOMERS_FAILURE,
    ADD_CUSTOMER_REQUEST,
    ADD_CUSTOMER_SUCCESS,
    ADD_CUSTOMER_FAILURE,
    EDIT_CUSTOMER_REQUEST,
    EDIT_CUSTOMER_SUCCESS,
    EDIT_CUSTOMER_FAILURE,
    DELETE_CUSTOMER_REQUEST,
    DELETE_CUSTOMER_SUCCESS,
    DELETE_CUSTOMER_FAILURE,
  } from '../actions/customerActions'; // Adjust import path as needed
  
  const initialState = {
    customers: [],
    loading: false,
    error: null,
  };
  
  const customerReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_CUSTOMERS_REQUEST:
      case ADD_CUSTOMER_REQUEST:
      case EDIT_CUSTOMER_REQUEST:
      case DELETE_CUSTOMER_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
  
      case FETCH_CUSTOMERS_SUCCESS:
        return {
          ...state,
          loading: false,
          customers: action.payload,
        };
  
      case ADD_CUSTOMER_SUCCESS:
        return {
          ...state,
          loading: false,
          customers: [...state.customers, action.payload],
        };
  
      case EDIT_CUSTOMER_SUCCESS:
        return {
          ...state,
          loading: false,
          customers: state.customers.map(customer =>
            customer.customerId === action.payload.customerId ? action.payload : customer
          ),
        };
  
      case DELETE_CUSTOMER_SUCCESS:
        return {
          ...state,
          loading: false,
          customers: state.customers.filter(customer => customer.customerId !== action.payload),
        };
  
      case FETCH_CUSTOMERS_FAILURE:
      case ADD_CUSTOMER_FAILURE:
      case EDIT_CUSTOMER_FAILURE:
      case DELETE_CUSTOMER_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default customerReducer;
  