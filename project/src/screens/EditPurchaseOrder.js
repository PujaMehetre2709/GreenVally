import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { fetchProductsForOrder, addProduct, removeProduct, updateProductQuantity, savePurchaseOrder } from '../redux/actions/purchaseOrderActions';
import images from '../images/images.js';
import theme from '../themes/theme'; 

const { width } = Dimensions.get("window");

const EditPurchaseOrder = ({ navigation, route }) => {
  const { order } = route.params;
  const [customerId, setCustomerId] = useState(order.customerId);
  const [customerName, setCustomerName] = useState(order.customerName);
  const [quantity, setQuantity] = useState(order.quantity);
  const [orderDate, setOrderDate] = useState(order.orderDate);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(order.expectedDeliveryDate);
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod);
  const [specialInstructions, setSpecialInstructions] = useState(order.specialInstructions);
  const [billingAddress, setBillingAddress] = useState(order.billingAddress);
  const [shippingAddress, setShippingAddress] = useState(order.shippingAddress);
  const [latitude, setLatitude] = useState(order.latitude);
  const [longitude, setLongitude] = useState(order.longitude);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOrderDatePickerVisible, setOrderDatePickerVisibility] = useState(false);
  const [isDeliveryDatePickerVisible, setDeliveryDatePickerVisibility] = useState(false);

  const dispatch = useDispatch();
  
  const products = useSelector(state => state.purchaseOrder?.products || []);
  const selectedProducts = useSelector(state => state.purchaseOrder?.selectedProducts || []);

  useEffect(() => {
    dispatch(fetchProductsForOrder(searchQuery));
  }, [searchQuery, dispatch]);

  const showOrderDatePicker = () => setOrderDatePickerVisibility(true);
  const hideOrderDatePicker = () => setOrderDatePickerVisibility(false);
  const handleOrderDateConfirm = (date) => {
    setOrderDate(date.toDateString());
    hideOrderDatePicker();
  };

  const showDeliveryDatePicker = () => setDeliveryDatePickerVisibility(true);
  const hideDeliveryDatePicker = () => setDeliveryDatePickerVisibility(false);
  const handleDeliveryDateConfirm = (date) => {
    setExpectedDeliveryDate(date.toDateString());
    hideDeliveryDatePicker();
  };

  const toggleModal = () => setModalVisible(!modalVisible);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleStorePurchaseOrder = () => {
    const updatedOrder = {
      customerId,
      customerName,
      quantity,
      orderDate,
      expectedDeliveryDate,
      paymentMethod,
      specialInstructions,
      billingAddress,
      shippingAddress,
      latitude,
      longitude,
      products: selectedProducts,
    };
    dispatch(savePurchaseOrder(updatedOrder));
    navigation.goBack();
  };

  const handleAddProduct = (product) => {
    dispatch(addProduct(product));
  };

  const handleRemoveProduct = (productId) => {
    dispatch(removeProduct(productId));
  };

  const handleUpdateProductQuantity = (productId, newQuantity) => {
    dispatch(updateProductQuantity(productId, newQuantity));
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleAddProduct(item)}
    >
      <Text style={styles.productText}>{item.productName}</Text>
    </TouchableOpacity>
  );

  const renderSelectedProduct = ({ item }) => (
    <View style={styles.selectedProductContainer}>
      <Text style={styles.selectedProductText}>{item.productName}</Text>
      <TextInput
        style={styles.quantityInput}
        value={item.quantity.toString()}
        onChangeText={(text) => handleUpdateProductQuantity(item.id, parseInt(text))}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.removeProductButton}
        onPress={() => handleRemoveProduct(item.id)}
      >
        <Text style={styles.buttonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={images.logo} style={styles.logo} />
      <Text style={styles.header}>Edit Purchase Order</Text>
      <TextInput
        style={styles.input}
        placeholder="Customer ID"
        value={customerId}
        onChangeText={setCustomerId}
      />
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={showOrderDatePicker}
      >
        <Text style={styles.datePickerText}>
          {orderDate ? `Order Date: ${orderDate}` : 'Select Order Date'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isOrderDatePickerVisible}
        mode="date"
        onConfirm={handleOrderDateConfirm}
        onCancel={hideOrderDatePicker}
      />
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={showDeliveryDatePicker}
      >
        <Text style={styles.datePickerText}>
          {expectedDeliveryDate ? `Expected Delivery Date: ${expectedDeliveryDate}` : 'Select Expected Delivery Date'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDeliveryDatePickerVisible}
        mode="date"
        onConfirm={handleDeliveryDateConfirm}
        onCancel={hideDeliveryDatePicker}
      />
      <TextInput
        style={styles.input}
        placeholder="Payment Method"
        value={paymentMethod}
        onChangeText={setPaymentMethod}
      />
      <TextInput
        style={styles.input}
        placeholder="Special Instructions"
        value={specialInstructions}
        onChangeText={setSpecialInstructions}
      />
      <TextInput
        style={styles.input}
        placeholder="Billing Address"
        value={billingAddress}
        onChangeText={setBillingAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Shipping Address"
        value={shippingAddress}
        onChangeText={setShippingAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />
      <View style={styles.selectedProductsContainer}>
        <Text style={styles.selectedProductsHeader}>Selected Products</Text>
        <FlatList
          data={selectedProducts}
          renderItem={renderSelectedProduct}
          keyExtractor={item => item.productName}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleStorePurchaseOrder}
      >
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={toggleModal}
      >
        <Text style={styles.buttonText}>Search Products</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Products"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={item => item.productName}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleModal}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  addProductButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  addProductButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productList: {
    maxHeight: 150,
  },
  productListModal: {
    maxHeight: 200,
  },
  productItem: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  productText: {
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quantityInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    width: 80,
    height: 40,
  },
  removeButtonText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default EditPurchaseOrder;
