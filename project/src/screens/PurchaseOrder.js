import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Alert, Modal, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsForOrder, savePurchaseOrder, setOrderDetails, clearOrderDetails } from '../redux/actions/purchaseOrderActions'; // Update the path if needed
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import images from '../images/images';
import theme from '../themes/theme';

const { width } = Dimensions.get('window');

const PurchaseOrder = ({ navigation, route }) => {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrderDatePickerVisible, setOrderDatePickerVisibility] = useState(false);
  const [isDeliveryDatePickerVisible, setDeliveryDatePickerVisibility] = useState(false);

  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.purchaseOrder);

  useEffect(() => {
    if (route.params && route.params.Name) {
      setAdminName(route.params.Name);
    }
    dispatch(fetchProductsForOrder(searchQuery));
    return () => {
      dispatch(clearOrderDetails());
    };
  }, [dispatch, route.params, searchQuery]);

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
      Alert.alert('Error', 'All required fields must be filled');
      return;
    }

    const orderDetails = {
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
    };

    dispatch(savePurchaseOrder(orderDetails));
  };

  const showOrderDatePicker = () => setOrderDatePickerVisibility(true);
  const hideOrderDatePicker = () => setOrderDatePickerVisibility(false);
  const handleOrderDateConfirm = (date) => {
    setOrderDate(date.toISOString().split('T')[0]);
    hideOrderDatePicker();
  };

  const showDeliveryDatePicker = () => setDeliveryDatePickerVisibility(true);
  const hideDeliveryDatePicker = () => setDeliveryDatePickerVisibility(false);
  const handleDeliveryDateConfirm = (date) => {
    setExpectedDeliveryDate(date.toISOString().split('T')[0]);
    hideDeliveryDatePicker();
  };

  const toggleModal = () => setModalVisible(!modalVisible);

  const addProductToOrder = (product) => {
    const existingProduct = selectedProducts.find(p => p.productName === product.productName);
    if (existingProduct) {
      existingProduct.quantity = parseInt(existingProduct.quantity || '1');
      setSelectedProducts([...selectedProducts]);
    } else {
      setSelectedProducts([...selectedProducts, { productName: product.productName, quantity: '1' }]);
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
    dispatch(fetchProductsForOrder(query));
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
    <LinearGradient colors={theme.gradients.lightBluePurple} style={styles.background}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.header}>
          <Image source={images.logo} style={styles.logo} resizeMode="contain" />
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
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={showOrderDatePicker}>
          <TextInput
            style={styles.input}
            placeholder="Order Date *"
            value={orderDate}
            editable={false}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isOrderDatePickerVisible}
          mode="date"
          onConfirm={handleOrderDateConfirm}
          onCancel={hideOrderDatePicker}
        />
        <TouchableOpacity onPress={showDeliveryDatePicker}>
          <TextInput
            style={styles.input}
            placeholder="Expected Delivery Date *"
            value={expectedDeliveryDate}
            editable={false}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDeliveryDatePickerVisible}
          mode="date"
          onConfirm={handleDeliveryDateConfirm}
          onCancel={hideDeliveryDatePicker}
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
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude *"
          value={longitude}
          onChangeText={setLongitude}
        />
        <Text style={styles.title}>Selected Products</Text>
        <FlatList
          data={selectedProducts}
          renderItem={renderSelectedProduct}
          keyExtractor={(item) => item.productName}
        />
        <TouchableOpacity style={styles.button} onPress={toggleModal}>
          <Text style={styles.buttonText}>Add Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleStorePurchaseOrder}>
          <Text style={styles.buttonText}>Store Purchase Order</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Products"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
            {loading ? (
              <Text>Loading...</Text>
            ) : error ? (
              <Text>Error fetching products</Text>
            ) : (
              <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.productName}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
