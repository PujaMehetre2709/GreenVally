import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { editProduct, fetchProducts } from '../redux/actions/productActions';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../themes/theme';

const { width } = Dimensions.get("window");

const EditProduct = ({ route, navigation }) => {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state);

  const [product, setProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const productToEdit = products.find(p => p.productId === productId);
    setProduct(productToEdit);
  }, [productId, products]);

  const handleEditProduct = () => {
    if (!product) return;

    dispatch(editProduct(productId, product));
    Alert.alert("Success", "Product updated successfully");
    navigation.goBack();
  };

  const handleChange = (name, value) => {
    setProduct({
      ...product,
      [name]: value,
    });
  };

  if (!product) return <Text>Loading...</Text>;

  return (
    <LinearGradient
      colors={theme.gradients.lightBluePurple}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Edit Product</Text>
        <TextInput
          style={styles.input}
          placeholder="Product ID"
          value={product.productId}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={product.productName}
          onChangeText={(text) => handleChange('productName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={product.description}
          onChangeText={(text) => handleChange('description', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Unit of Measurement"
          value={product.unitOfMeasurement}
          onChangeText={(text) => handleChange('unitOfMeasurement', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={product.price.toString()}
          onChangeText={(text) => handleChange('price', Number(text))}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Currency"
          value={product.currency}
          onChangeText={(text) => handleChange('currency', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Product Category"
          value={product.productCategory}
          onChangeText={(text) => handleChange('productCategory', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Batch Number"
          value={product.batchNumber}
          onChangeText={(text) => handleChange('batchNumber', text)}
        />
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleEditProduct}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#4B0082",
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: '#4B0082',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditProduct;
