import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../redux/actions/adminloginaction'; // Ensure correct import
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import images from '../images/images';
import theme from '../themes/theme';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const AdminLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { admin, error } = useSelector((state) => state.adminLogin);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        const storedPassword = await AsyncStorage.getItem("userPassword");

        // Log out the user if credentials are found
        if (storedEmail && storedPassword) {
          await AsyncStorage.removeItem("userEmail");
          await AsyncStorage.removeItem("userPassword");
        }
        setLoading(false);
      } catch (error) {
        console.log("Error reading login status from AsyncStorage: ", error);
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (admin) {
      navigation.navigate("AdminScreen", { Name: admin.Name });
    } else if (error) {
      setLoading(false);
      Alert.alert("Login Failed", error);
    }
  }, [admin, error, navigation]);

  const handleLogin = () => {
    setLoading(true);
    dispatch(adminLogin(email, password));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <LinearGradient
        colors={theme.gradients.lightBluePurple}
        style={styles.backgroundGradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.greenValleyText}>Green Valley</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Admin Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Admin ID"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.signupButtonText}>Signup</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 20,
    left: 20,
  },
  logo: {
    width: windowWidth * 0.2,
    height: windowWidth * 0.2,
    borderRadius: (windowWidth * 0.2) / 2,
  },
  greenValleyText: {
    fontSize: windowWidth > 600 ? 40 : 30,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#4B0082",
  },
  welcomeText: {
    fontSize: windowWidth > 600 ? 50 : 40,
    marginBottom: 5,
    color: "#4B0082",
    textAlign: "center",
    marginTop: windowWidth > 600 ? windowHeight * 0.3 : windowHeight * 0.15,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 20,
    paddingTop: windowWidth > 600 ? windowHeight * 0.15 : windowHeight * 0.1,
    alignItems: "center",
  },
  title: {
    fontSize: windowWidth > 600 ? 30 : 20,
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  loginButton: {
    backgroundColor: "#4B0082",
    paddingVertical: windowWidth > 600 ? 15 : 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: {
    color: "white",
    fontSize: windowWidth > 600 ? 20 : 16,
  },
  signupButton: {
    alignItems: "center",
  },
  signupButtonText: {
    color: "black",
    fontSize: windowWidth > 600 ? 18 : 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default AdminLogin;
