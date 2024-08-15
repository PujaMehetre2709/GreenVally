// customerActions.js
import axios from 'axios';
import Config from '../../config/config';

const BASE_URL = Config.baseurl;

// Action Types
export const FETCH_CUSTOMERS_REQUEST = 'FETCH_CUSTOMERS_REQUEST';
export const FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS';
export const FETCH_CUSTOMERS_FAILURE = 'FETCH_CUSTOMERS_FAILURE';
export const ADD_CUSTOMER_REQUEST = 'ADD_CUSTOMER_REQUEST';
export const ADD_CUSTOMER_SUCCESS = 'ADD_CUSTOMER_SUCCESS';
export const ADD_CUSTOMER_FAILURE = 'ADD_CUSTOMER_FAILURE';
export const EDIT_CUSTOMER_REQUEST = 'EDIT_CUSTOMER_REQUEST';
export const EDIT_CUSTOMER_SUCCESS = 'EDIT_CUSTOMER_SUCCESS';
export const EDIT_CUSTOMER_FAILURE = 'EDIT_CUSTOMER_FAILURE';
export const DELETE_CUSTOMER_REQUEST = 'DELETE_CUSTOMER_REQUEST';
export const DELETE_CUSTOMER_SUCCESS = 'DELETE_CUSTOMER_SUCCESS';
export const DELETE_CUSTOMER_FAILURE = 'DELETE_CUSTOMER_FAILURE';

// Fetch Customers
export const fetchCustomers = () => async (dispatch) => {
    dispatch({ type: FETCH_CUSTOMERS_REQUEST });

    try {
        const response = await axios.get(`${BASE_URL}/customers`);
        dispatch({ type: FETCH_CUSTOMERS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_CUSTOMERS_FAILURE, payload: error.message });
    }
};

// Add Customer
export const addCustomer = (customer) => async (dispatch) => {
    dispatch({ type: ADD_CUSTOMER_REQUEST });

    try {
        const response = await axios.post(`${BASE_URL}/store-customer`, customer);
        if (response.status === 201) {
            dispatch({ type: ADD_CUSTOMER_SUCCESS, payload: customer });
        }
    } catch (error) {
        dispatch({ type: ADD_CUSTOMER_FAILURE, payload: error.message });
    }
};

// Edit Customer
export const editCustomer = (customerId, customer) => async (dispatch) => {
    dispatch({ type: EDIT_CUSTOMER_REQUEST });

    try {
        const response = await axios.put(`${BASE_URL}/edit-customer/${customerId}`, customer);
        if (response.status === 200) {
            dispatch({ type: EDIT_CUSTOMER_SUCCESS, payload: { customerId, customer } });
        }
    } catch (error) {
        dispatch({ type: EDIT_CUSTOMER_FAILURE, payload: error.message });
    }
};

// Delete Customer
export const deleteCustomer = (customerId) => async (dispatch) => {
    dispatch({ type: DELETE_CUSTOMER_REQUEST });

    try {
        const response = await axios.delete(`${BASE_URL}/delete-customers/${customerId}`);
        if (response.status === 200) {
            dispatch({ type: DELETE_CUSTOMER_SUCCESS, payload: customerId });
        }
    } catch (error) {
        dispatch({ type: DELETE_CUSTOMER_FAILURE, payload: error.message });
    }
};
