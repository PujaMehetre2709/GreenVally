import axios from 'axios';
import Config from '../../config/config';
const BASE_URL = Config.baseurl;

// Action Types
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const UPDATE_PRODUCT_QUANTITY = 'UPDATE_PRODUCT_QUANTITY';
export const SET_ORDER_DETAILS = 'SET_ORDER_DETAILS';
export const CLEAR_ORDER_DETAILS = 'CLEAR_ORDER_DETAILS';
export const FETCH_PRODUCTS_FOR_ORDER_REQUEST = 'FETCH_PRODUCTS_FOR_ORDER_REQUEST';
export const FETCH_PRODUCTS_FOR_ORDER_SUCCESS = 'FETCH_PRODUCTS_FOR_ORDER_SUCCESS';
export const FETCH_PRODUCTS_FOR_ORDER_FAILURE = 'FETCH_PRODUCTS_FOR_ORDER_FAILURE';
export const FETCH_PURCHASE_ORDERS_REQUEST = 'FETCH_PURCHASE_ORDERS_REQUEST';
export const FETCH_PURCHASE_ORDERS_SUCCESS = 'FETCH_PURCHASE_ORDERS_SUCCESS';
export const FETCH_PURCHASE_ORDERS_FAILURE = 'FETCH_PURCHASE_ORDERS_FAILURE';

// Action Creators
export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: products,
});

export const addProduct = (product) => ({
  type: ADD_PRODUCT,
  payload: product,
});

export const removeProduct = (productId) => ({
  type: REMOVE_PRODUCT,
  payload: productId,
});

export const updateProductQuantity = (productId, quantity) => ({
  type: UPDATE_PRODUCT_QUANTITY,
  payload: { productId, quantity },
});

export const setOrderDetails = (orderDetails) => ({
  type: SET_ORDER_DETAILS,
  payload: orderDetails,
});

export const clearOrderDetails = () => ({
  type: CLEAR_ORDER_DETAILS,
});

// Async Actions
export const savePurchaseOrder = (order) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/store-purchase-order`, order);
    if (response.status === 201) {
      dispatch(clearOrderDetails());
      alert('Purchase order stored successfully');
    } else {
      alert('Failed to store purchase order');
    }
  } catch (error) {
    console.error('Error saving purchase order:', error);
    alert('An error occurred while saving the purchase order');
  }
};

export const fetchProductsForOrder = (query) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_FOR_ORDER_REQUEST });
  try {
    const response = await axios.get(`${BASE_URL}/products`, { params: { search: query } });
    dispatch({ type: FETCH_PRODUCTS_FOR_ORDER_SUCCESS, payload: response.data });
  } catch (error) {
    console.error('Error fetching products:', error);
    dispatch({ type: FETCH_PRODUCTS_FOR_ORDER_FAILURE, payload: error.message });
  }
};

export const fetchPurchaseOrders = () => async (dispatch) => {
  dispatch({ type: FETCH_PURCHASE_ORDERS_REQUEST });
  try {
    const response = await axios.get(`${BASE_URL}/purchase-orders`);
    dispatch({ type: FETCH_PURCHASE_ORDERS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_PURCHASE_ORDERS_FAILURE, payload: error.message });
  }
};
