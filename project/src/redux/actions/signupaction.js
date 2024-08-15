import axios from 'axios';
import { Alert } from 'react-native';
import Config from '../config/config'; // Adjust the path as necessary

const BASE_URL = Config.baseurl;

// Action Types
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';

// Action Creators
const signupRequest = () => ({
  type: SIGNUP_REQUEST,
});

const signupSuccess = (user) => ({
  type: SIGNUP_SUCCESS,
  payload: user,
});

const signupFailure = (error) => ({
  type: SIGNUP_FAILURE,
  payload: error,
});

// Signup Action
export const signup = (name, email, password) => {
  return async (dispatch) => {
    dispatch(signupRequest());

    try {
      const response = await axios.post(`${BASE_URL}/signup`, {
        name,
        email,
        password,
      });
      dispatch(signupSuccess(response.data));
      Alert.alert("Signup Successful", "You have successfully signed up.");
      // You can navigate to another screen if needed here
    } catch (error) {
      dispatch(signupFailure(error.message));
      Alert.alert("Signup Failed", "Failed to signup. Please try again.");
    }
  };
};
