import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsForOrder, addProduct, removeProduct, updateProductQuantity, savePurchaseOrder } from '../redux/actions/purchaseOrderActions';
import theme from '../themes/theme';

const EditPurchaseOrder = ({ navigation, route }) => {
  const { order } = route.params;
  const dispatch = useDispatch();

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
    dispatch(savePurchaseOrder(updatedOrder))
      .then(() => {
        Alert.alert("Success", "Purchase Order updated successfully");
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to update Purchase Order");
        console.error(error);
      });
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
    <LinearGradient
      colors={theme.gradients.lightBluePurple}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Edit Purchase Order</Text>
          <TextInput
            style={styles.input}
            placeholder="Customer ID"
            value={customerId.toString()}
            onChangeText={setCustomerId}
            editable={false}
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
              keyExtractor={item => item.id.toString()}
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
                keyExtractor={item => item.id.toString()}
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
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  datePickerButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  selectedProductsContainer: {
    marginBottom: 20,
  },
  selectedProductsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedProductText: {
    flex: 1,
    fontSize: 16,
  },
  quantityInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    width: 60,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  removeProductButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default EditPurchaseOrder;
