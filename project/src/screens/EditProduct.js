import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, updateProduct } from '../redux/actions/productActions';
import images from '../images/images.js';
import theme from '../themes/theme';

const EditProduct = ({ route, navigation }) => {
  const { productId } = route.params;
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [unitOfMeasurement, setUnitOfMeasurement] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [status, setStatus] = useState("Active");
  const [discountAllowed, setDiscountAllowed] = useState("No");

  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(state => ({
    product: state.product.currentProduct,
    loading: state.product.loading,
    error: state.product.error,
  }));

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (product) {
      setProductName(product.productName);
      setDescription(product.description);
      setUnitOfMeasurement(product.unitOfMeasurement);
      setPrice(product.price);
      setCurrency(product.currency);
      setProductCategory(product.productCategory);
      setExpiryDate(product.expiryDate);
      setBatchNumber(product.batchNumber);
      setStatus(product.status);
      setDiscountAllowed(product.discountAllowed);
    }
  }, [product]);

  const handleUpdateProduct = useCallback(() => {
    if (
      !productName ||
      !description ||
      !unitOfMeasurement ||
      !price ||
      !currency ||
      !productCategory
    ) {
      Alert.alert("Error", "All required fields must be filled");
      return;
    }

    dispatch(updateProduct({
      productId,
      productName,
      description,
      unitOfMeasurement,
      price,
      currency,
      productCategory,
      expiryDate,
      batchNumber,
      status,
      discountAllowed,
    }))
    .then(() => {
      Alert.alert("Success", "Product updated successfully!");
      navigation.goBack(); // Go back to the previous screen
    })
    .catch((error) => {
      Alert.alert("Error", error.message || "Something went wrong");
    });
  }, [
    dispatch, productId, productName, description, unitOfMeasurement,
    price, currency, productCategory, expiryDate, batchNumber,
    status, discountAllowed, navigation
  ]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <View style={styles.header}>
        <Image
          source={images.logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Edit Product</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Product Name *"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description *"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Unit of Measurement *"
        value={unitOfMeasurement}
        onChangeText={setUnitOfMeasurement}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.priceInput]}
          placeholder="Price *"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.currencyInput]}
          placeholder="Currency *"
          value={currency}
          onChangeText={setCurrency}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Product Category *"
        value={productCategory}
        onChangeText={setProductCategory}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.batchNumberInput]}
          placeholder="Batch Number"
          value={batchNumber}
          onChangeText={setBatchNumber}
        />
        <TextInput
          style={[styles.input, styles.dateInput]}
          placeholder="Expiry Date"
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
      </View>
      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Active" value="Active" />
          <Picker.Item label="Inactive" value="Inactive" />
        </Picker>
      </View>
      <Text style={styles.label}>Discount Allowed</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={discountAllowed}
          onValueChange={(itemValue) => setDiscountAllowed(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdateProduct}>
        <Text style={styles.buttonText}>Update Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#4B0082",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  priceInput: {
    flex: 1,
    marginRight: 5,
  },
  currencyInput: {
    flex: 1,
  },
  batchNumberInput: {
    flex: 2,
  },
  dateInput: {
    flex: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4B0082",
  },
  pickerContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 40,
  },
  button: {
    backgroundColor: "#4B0082",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProduct;
