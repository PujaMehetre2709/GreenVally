import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from "expo-linear-gradient";
import NetInfo from '@react-native-community/netinfo';
import { fetchProducts, deleteProduct } from '../redux/actions/productActions'; // Update import path if needed
import images from '../images/images.js';
import theme from '../themes/theme';

const ViewProducts = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items || []); // Ensure state path matches your reducer
  const productStatus = useSelector((state) => state.products.status); // Ensure state path matches your reducer

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        dispatch(fetchProducts()); // Fetch products when network connectivity is restored
      }
    });

    if (productStatus === 'idle' || productStatus === 'failed') {
      dispatch(fetchProducts()); // Initial fetch or retry on failure
    }

    return () => unsubscribe();
  }, [dispatch, productStatus]);

  const handleDeletePress = (productId) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => dispatch(deleteProduct(productId)) },
      ],
      { cancelable: false }
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (productStatus === 'loading') {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={theme.gradients.lightBluePurple}
      style={styles.backgroundGradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            source={images.logo}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Product List</Text>
        </View>
        {products.length > 0 ? (
          products.map((product) => (
            <View key={product.productId} style={styles.productCard}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProduct', { product })}
              >
                <Text style={styles.editButtonText}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePress(product.productId)}
              >
                <Text style={styles.deleteButtonText}>🗑</Text>
              </TouchableOpacity>
              <Text style={styles.productId}>Product ID: {product.productId}</Text>
              <Text style={styles.productName}>Product Name: {product.productName}</Text> 
              <Text style={styles.productDescription}>Description: {product.description}</Text>
              <Text style={styles.productDetails}>Unit of Measurement: {product.unitOfMeasurement}</Text>
              <Text style={styles.productDetails}>Price: {product.price}</Text>
              <Text style={styles.productDetails}>Currency: {product.currency}</Text>
              <Text style={styles.productDetails}>Category: {product.productCategory}</Text>
              <Text style={styles.productDetails}>Expiry Date: {formatDate(product.expiryDate)}</Text>
              <Text style={styles.productDetails}>Batch Number: {product.batchNumber}</Text>
              <Text style={styles.productDetails}>Status: {product.status}</Text>
              <Text style={styles.productDetails}>Discount Allowed: {product.discountAllowed}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noProducts}>No products available</Text>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    color: "#4B0082",
    fontWeight: "bold",
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4B0082",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  productId: {
    fontSize: 16,
    color: "#4B0082",
  },
  productName: {
    fontSize: 16,
    color: "#4B0082",
    marginVertical: 5,
  },
  productDescription: {
    fontSize: 14,
    color: "#333",
    marginVertical: 5,
  },
  productDetails: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  noProducts: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4B0082",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 40,
    backgroundColor: "#4B0082",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: "#FF0000",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewProducts;
