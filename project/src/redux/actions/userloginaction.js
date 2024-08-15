// src/redux/userLoginActions.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../../config/config';

const BASE_URL = Config.baseurl;

// Action Types
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';

// Action Creators
export const userLogin = (userId, password) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });

  try {
    const response = await axios.post(`${BASE_URL}/user-login`, {
      user_id: userId,
      password,
    });

    if (response.status === 200) {
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('userPassword', password);
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: response.data,
      });
    } else {
      dispatch({
        type: USER_LOGIN_FAILURE,
        payload: 'Invalid credentials',
      });
    }
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};
