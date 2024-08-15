import { combineReducers } from 'redux';
import usermaiReducer from './reducers/usermaiReducer';
import adminLoginReducer from './reducers/adminloginreducer';
import customerReducer from './reducers/customerReducer';
import productReducer from './reducers/productReducer';
import userLoginReducer from './reducers/userloginreducer';
import purchaseOrderReducer from './reducers/purchaseOrderReducer'; // Import the purchaseOrderReducer

const rootReducer = combineReducers({
  usermai: usermaiReducer,
  adminLogin: adminLoginReducer,
  customers: customerReducer,
  products: productReducer,
  userLogin: userLoginReducer,
  purchaseOrders: purchaseOrderReducer, // Add the purchaseOrderReducer here
});

export default rootReducer;
