import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../redux/actions/productActions'; // Updated import
import { LinearGradient } from "expo-linear-gradient";
import images from '../images/images.js';
import theme from '../themes/theme';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get("window");

const ProductMaster = ({ navigation, route }) => {
  const [productId, setProductId] = useState("");
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
  const [adminName, setAdminName] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => ({
    loading: state.product?.loading || false,
    error: state.product?.error || null,
  }));

  useEffect(() => {
    if (route.params?.Name) {
      setAdminName(route.params.Name);
    }
  }, [route.params]);

  const handleStoreProduct = () => {
    if (
      !productId ||
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

    dispatch(addProduct({
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
    }));
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const clearFields = () => {
    setProductId("");
    setProductName("");
    setDescription("");
    setUnitOfMeasurement("");
    setPrice("");
    setCurrency("");
    setProductCategory("");
    setExpiryDate("");
    setBatchNumber("");
    setStatus("Active");
    setDiscountAllowed("No");
  };

  const handleConfirmDate = (date) => {
    setExpiryDate(date.toDateString());
    setDatePickerVisibility(false);
  };

  const viewProducts = () => {
    navigation.navigate('ViewProducts'); // Adjust this to your actual route name
  };

  return (
    <LinearGradient
      colors={theme.gradients.lightBluePurple}
      style={styles.backgroundGradient}
    >
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.header}>
          <Image
            source={images.logo}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.adminName}>{adminName || "Admin"}</Text>
        </View>
        <Text style={styles.title}>Product Master</Text>
        <TextInput
          style={styles.input}
          placeholder="Product ID *"
          value={productId}
          onChangeText={setProductId}
        />
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
          <TouchableOpacity
            style={[styles.input, styles.datePickerButton]}
            onPress={() => setDatePickerVisibility(true)}
          >
            <Text style={styles.dateText}>{expiryDate || "Expiry Date"}</Text>
          </TouchableOpacity>
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
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleStoreProduct}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.viewProductsButton]} onPress={viewProducts}>
          <Text style={styles.buttonText}>View Products</Text>
        </TouchableOpacity>
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
    // Removed border styles
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  Name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B0082",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#4B0082",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceInput: {
    flex: 1,
    marginRight: 5,
  },
  currencyInput: {
    flex: 1,
    marginLeft: 5,
  },
  batchNumberInput: {
    flex: 1,
    marginRight: 5,
  },
  datePickerButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
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
    overflow: "hidden",
    marginBottom: 15,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  button: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#4B0082",
  },
  viewProductsButton: {
    backgroundColor: "#6A5ACD",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductMaster;
