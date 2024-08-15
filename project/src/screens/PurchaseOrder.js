import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { width } = Dimensions.get("window");

import Config from '../config/config';
const BASE_URL = Config.baseurl;
import images from '../images/images.js';
import theme from '../themes/theme'; 

const PurchaseOrder = ({ navigation, route }) => {
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [Name, setAdminName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOrderDatePickerVisible, setOrderDatePickerVisibility] = useState(false);
  const [isDeliveryDatePickerVisible, setDeliveryDatePickerVisibility] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    if (route.params && route.params.Name) {
      setAdminName(route.params.Name);
    }
    fetchProducts();
  }, [route.params]);

  const fetchProducts = async (query = "") => {
    try {
      const response = await axios.get(`${BASE_URL}/products?search=${query}`);
      setProducts(response.data);
      await AsyncStorage.setItem('products', JSON.stringify(response.data)); // Save products to local storage
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch products");
      // Load products from local storage if the network request fails
      const cachedProducts = await AsyncStorage.getItem('products');
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      }
    }
  };

  const handleStorePurchaseOrder = async () => {
    if (
      !customerId ||
      !customerName ||
      !orderDate ||
      !expectedDeliveryDate ||
      !paymentMethod ||
      !billingAddress ||
      !shippingAddress ||
      !latitude ||
      !longitude
    ) {
      Alert.alert("Error", "All required fields must be filled ");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/store-purchase-order`,
        {
          customerId,
          customerName,
          products: selectedProducts,
          quantity,
          orderDate,
          expectedDeliveryDate,
          paymentMethod,
          specialInstructions,
          billingAddress,
          shippingAddress,
          location: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Purchase order stored successfully");
        clearFields();
      } else {
        Alert.alert("Error", "Failed to store purchase order");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while storing purchase order details");
    }
  };

  const clearFields = () => {
    setCustomerId("");
    setCustomerName("");
    setSelectedProducts([]);
    setQuantity("");
    setOrderDate("");
    setExpectedDeliveryDate("");
    setPaymentMethod("");
    setSpecialInstructions("");
    setBillingAddress("");
    setShippingAddress("");
    setLatitude("");
    setLongitude("");
  };

  const showOrderDatePicker = () => setOrderDatePickerVisibility(true);
  const hideOrderDatePicker = () => setOrderDatePickerVisibility(false);
  const handleOrderDateConfirm = (date) => {
    setOrderDate(date.toISOString().split("T")[0]);
    hideOrderDatePicker();
  };

  const showDeliveryDatePicker = () => setDeliveryDatePickerVisibility(true);
  const hideDeliveryDatePicker = () => setDeliveryDatePickerVisibility(false);
  const handleDeliveryDateConfirm = (date) => {
    setExpectedDeliveryDate(date.toISOString().split("T")[0]);
    hideDeliveryDatePicker();
  };

  const toggleModal = () => setModalVisible(!modalVisible);

  const addProductToOrder = (product) => {
    const existingProduct = selectedProducts.find(p => p.productName === product.productName);
    if (existingProduct) {
      existingProduct.quantity = parseInt(existingProduct.quantity || "1");
      setSelectedProducts([...selectedProducts]);
    } else {
      setSelectedProducts([...selectedProducts, { productName: product.productName, quantity: "1" }]);
    }
    toggleModal();
  };

  const updateProductQuantity = (productName, newQuantity) => {
    setSelectedProducts(selectedProducts.map(product =>
      product.productName === productName ? { ...product, quantity: newQuantity } : product
    ));
  };

  const removeProductFromOrder = (productName) => {
    setSelectedProducts(selectedProducts.filter(product => product.productName !== productName));
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    fetchProducts(query);
  };

  const renderSelectedProduct = ({ item }) => (
    <View style={styles.selectedProductContainer}>
      <Text style={styles.selectedProductText}>{item.productName}</Text>
      <TextInput
        style={styles.quantityInput}
        value={item.quantity}
        onChangeText={(text) => updateProductQuantity(item.productName, text)}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.removeProductButton}
        onPress={() => removeProductFromOrder(item.productName)}
      >
        <Text style={styles.buttonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => addProductToOrder(item)}
    >
      <Text style={styles.productName}>{item.productName}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={theme.gradients.lightBluePurple} // Apply gradient from theme
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.header}>
          <Image
            source={images.logo} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.Name}>{Name}</Text>
        </View>
        <Text style={styles.title}>Purchase Order</Text>
        <TextInput
          style={styles.input}
          placeholder="Customer ID *"
          value={customerId}
          onChangeText={setCustomerId}
        />
        <TextInput
          style={styles.input}
          placeholder="Customer Name *"
          value={customerName}
          onChangeText={setCustomerName}
        />
        <View style={styles.row}>
          <TouchableOpacity onPress={toggleModal} style={styles.selectProductButton}>
            <Text style={styles.productText}>Select Product</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={selectedProducts}
          renderItem={renderSelectedProduct}
          keyExtractor={(item) => item.productName}
        />
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={showOrderDatePicker} style={styles.orderDateInput}>
          <Text style={styles.dateText}>{orderDate || "Order Date"}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isOrderDatePickerVisible}
            mode="date"
            onConfirm={handleOrderDateConfirm}
            onCancel={hideOrderDatePicker}
          />
          <TouchableOpacity onPress={showDeliveryDatePicker} style={styles.deliveryDateInput}>
          <Text style={styles.dateText}>{expectedDeliveryDate || "Expected Delivery Date"}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDeliveryDatePickerVisible}
            mode="date"
            onConfirm={handleDeliveryDateConfirm}
            onCancel={hideDeliveryDatePicker}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Payment Method *"
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
          placeholder="Billing Address *"
          value={billingAddress}
          onChangeText={setBillingAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Shipping Address *"
          value={shippingAddress}
          onChangeText={setShippingAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Latitude *"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude *"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleStorePurchaseOrder} style={styles.submitButton}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ViewPurchaseOrders')} style={styles.viewOrdersButton}>
            <Text style={styles.buttonText}>View Orders</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
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
                keyExtractor={(item) => item.productName}
              />
              <TouchableOpacity style={styles.closeModalButton} onPress={toggleModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  formContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  Name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4B0082',
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    padding: 4,
    backgroundColor: '#fff',
  },
  row: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectProductButton: {
    backgroundColor: '#B9A0D8',
    padding: 10,
    borderRadius: 5,
  },
  productText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  orderDateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
    marginRight: 16,
  },
  deliveryDateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  dateText: {
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  viewOrdersButton: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#8A2BE2',
    borderRadius: 5,
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#fff',
    width: '90%',
  },
  closeModalButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 12,
  },
  productItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  productName: {
    fontSize: 16,
  },
  selectedProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 2,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#f8f9fa',
    borderWidth: 1,
  },
  selectedProductText: {
    fontSize: 15,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#B9A0D8',
    borderRadius: 5,
    width: 80,
    padding: 5,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  removeProductButton: {
    backgroundColor: '#dc3545',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default PurchaseOrder;
