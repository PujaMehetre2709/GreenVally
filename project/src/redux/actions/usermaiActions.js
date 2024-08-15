// redux/actions/userMaiActions.js
import axios from 'axios';
import Config from '../../config/config';

const BASE_URL = Config.baseurl;

// Action Types
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';


// Action Creators
export const fetchUsersRequest = () => ({ type: FETCH_USERS_REQUEST });

export const fetchUsersSuccess = (users) => ({
  type: FETCH_USERS_SUCCESS,
  payload: users,
});

export const fetchUsersFailure = (error) => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});

export const addUserSuccess = () => ({
  type: ADD_USER_SUCCESS,
});

export const deleteUserSuccess = () => ({
  type: DELETE_USER_SUCCESS,
});

// Thunks
export const fetchUsers = () => async (dispatch) => {
  dispatch(fetchUsersRequest());
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    dispatch(fetchUsersSuccess(response.data));
  } catch (error) {
    dispatch(fetchUsersFailure(error.message));
  }
};

export const addUser = (newUser) => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/add-users`, newUser);
    dispatch(addUserSuccess());
    dispatch(fetchUsers()); // Refresh users list
  } catch (error) {
    console.error('Error adding user:', error.response ? error.response.data : error.message);
  }
};

export const deleteUser = (userId) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/delete-user/${userId}`);
    dispatch(deleteUserSuccess());
    dispatch(fetchUsers()); // Refresh users list
  } catch (error) {
    console.error('Error deleting user:', error.message);
  }
};

export const updateUserRequest = () => ({ type: UPDATE_USER_REQUEST });
export const updateUserSuccess = () => ({ type: UPDATE_USER_SUCCESS });
export const updateUserFailure = (error) => ({
  type: UPDATE_USER_FAILURE,
  payload: error,
});

// Thunks
export const updateUser = (userData) => async (dispatch) => {
  dispatch(updateUserRequest());
  try {
    await axios.put(`${BASE_URL}/update-user/${userData.id}`, userData);
    dispatch(updateUserSuccess());
  } catch (error) {
    dispatch(updateUserFailure(error.message));
    throw error; // Rethrow the error to be caught in the component
  }
};