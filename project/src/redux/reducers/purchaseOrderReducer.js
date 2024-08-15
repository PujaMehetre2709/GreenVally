import {
  SET_PRODUCTS,
  ADD_PRODUCT,
  REMOVE_PRODUCT,
  UPDATE_PRODUCT_QUANTITY,
  SET_ORDER_DETAILS,
  CLEAR_ORDER_DETAILS,
  FETCH_PURCHASE_ORDERS_REQUEST,
  FETCH_PURCHASE_ORDERS_SUCCESS,
  FETCH_PURCHASE_ORDERS_FAILURE,
  FETCH_PRODUCTS_FOR_ORDER_REQUEST,
  FETCH_PRODUCTS_FOR_ORDER_SUCCESS,
  FETCH_PRODUCTS_FOR_ORDER_FAILURE
} from '../actions/purchaseOrderActions';

const initialState = {
  products: [],
  selectedProducts: [],
  orderDetails: {
    customerId: '',
    customerName: '',
    orderDate: '',
    expectedDeliveryDate: '',
    paymentMethod: '',
    specialInstructions: '',
    billingAddress: '',
    shippingAddress: '',
    latitude: '',
    longitude: '',
  },
  purchaseOrders: [],
  loading: false,
  error: null,
  
};

const purchaseOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    // Handling product actions
    case SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };

    case ADD_PRODUCT:
      const existingProduct = state.selectedProducts.find(p => p.id === action.payload.id);
      if (existingProduct) {
        return {
          ...state,
          selectedProducts: state.selectedProducts.map(p =>
            p.id === action.payload.id
              ? { ...p, quantity: (parseInt(p.quantity) + 1).toString() }
              : p
          ),
        };
      }
      return {
        ...state,
        selectedProducts: [...state.selectedProducts, { ...action.payload, quantity: '1' }],
      };

    case REMOVE_PRODUCT:
      return {
        ...state,
        selectedProducts: state.selectedProducts.filter(p => p.id !== action.payload),
      };

    case UPDATE_PRODUCT_QUANTITY:
      return {
        ...state,
        selectedProducts: state.selectedProducts.map(p =>
          p.id === action.payload.productId
            ? { ...p, quantity: action.payload.quantity.toString() }
            : p
        ),
      };

    case SET_ORDER_DETAILS:
      return {
        ...state,
        orderDetails: { ...state.orderDetails, ...action.payload },
      };

    case CLEAR_ORDER_DETAILS:
      return {
        ...state,
        orderDetails: initialState.orderDetails,
        selectedProducts: [],
      };

    // Handling purchase order actions
    case FETCH_PURCHASE_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_PURCHASE_ORDERS_SUCCESS:
      return { ...state, loading: false, purchaseOrders: action.payload };

    case FETCH_PURCHASE_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Handling products for order actions
    case FETCH_PRODUCTS_FOR_ORDER_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_PRODUCTS_FOR_ORDER_SUCCESS:
      return { ...state, loading: false, products: action.payload };

    case FETCH_PRODUCTS_FOR_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default purchaseOrderReducer;
