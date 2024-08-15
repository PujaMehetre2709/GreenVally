import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from '../../config/config';
const BASE_URL = Config.baseurl;

// Action Types
export const ADMIN_LOGIN_REQUEST = 'ADMIN_LOGIN_REQUEST';
export const ADMIN_LOGIN_SUCCESS = 'ADMIN_LOGIN_SUCCESS';
export const ADMIN_LOGIN_FAILURE = 'ADMIN_LOGIN_FAILURE';
export const ADMIN_LOGOUT_REQUEST = 'ADMIN_LOGOUT_REQUEST';
export const ADMIN_LOGOUT_SUCCESS = 'ADMIN_LOGOUT_SUCCESS';
export const ADMIN_LOGOUT_FAILURE = 'ADMIN_LOGOUT_FAILURE';

// Action Creators

export const adminLogin = (email, password) => async (dispatch) => {
    dispatch({ type: ADMIN_LOGIN_REQUEST });
  
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        await AsyncStorage.setItem("userEmail", email);
        await AsyncStorage.setItem("userPassword", password);
  
        dispatch({
          type: ADMIN_LOGIN_SUCCESS,
          payload: data,
        });
      } else {
        dispatch({
          type: ADMIN_LOGIN_FAILURE,
          payload: data.message || 'Login failed',
        });
      }
    } catch (error) {
      dispatch({
        type: ADMIN_LOGIN_FAILURE,
        payload: error.message,
      });
    }
  };
  
export const adminLogout = () => async (dispatch) => {
    dispatch({ type: ADMIN_LOGOUT_REQUEST });
  
    try {
      await AsyncStorage.removeItem("userEmail");
      await AsyncStorage.removeItem("userPassword");
      await AsyncStorage.removeItem("authToken"); // Adjust based on your actual keys
  
      dispatch({
        type: ADMIN_LOGOUT_SUCCESS,
      });
  
      // Optionally, handle additional logic after logout
      // e.g., redirect to login screen
    } catch (error) {
      dispatch({
        type: ADMIN_LOGOUT_FAILURE,
        payload: error.message,
      });
    }
  };
