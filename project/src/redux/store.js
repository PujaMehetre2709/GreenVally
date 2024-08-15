import { configureStore } from '@reduxjs/toolkit';
import usermaiReducer from './reducers/usermaiReducer'; 
import adminLoginReducer from './reducers/adminloginreducer'; 
import customerReducer from './reducers/customerReducer';
import productReducer from './reducers/productReducer';
import userLoginReducer from './reducers/userloginreducer';
import purchaseOrderReducer from './reducers/purchaseOrderReducer';


// Create store with configureStore
const store = configureStore({
  reducer: {
    usermai: usermaiReducer,
    adminLogin: adminLoginReducer,
    customers: customerReducer,
    products: productReducer,
    user: userLoginReducer,
    purchaseOrderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false, // Disable ImmutableStateInvariantMiddleware
      serializableCheck: false, // Optionally disable serializableCheck if needed
    }),
});

export default store;
