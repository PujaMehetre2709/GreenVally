import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Button,
} from "react-native";
import { updateUser } from "../redux/actions/usermaiActions";

const EditUser = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { user } = route.params;
  const [userData, setUserData] = useState({ ...user });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = () => {
    if (!userData.user_id) {
      Alert.alert('Error', 'User ID is missing.');
      return;
    }
 
    console.log('Updating User:', userData);
    setLoading(true);
    setError(null);
    dispatch(updateUser(userData))
      .then(() => {
        setLoading(false);
        Alert.alert('Update Successful', 'User updated successfully.');
        navigation.goBack();
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response ? error.response.data.message : error.message);
        Alert.alert('Update Failed', error.response ? error.response.data.message : error.message);
      });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={handleUpdate}
          title="Update"
          color="#000"
        />
      ),
    });
  }, [navigation, userData]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={userData.name}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email ID"
          value={userData.emailid}
          onChangeText={(text) => setUserData({ ...userData, emailid: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile No."
          value={userData.mobile_no}
          onChangeText={(text) => setUserData({ ...userData, mobile_no: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Role"
          value={userData.role}
          onChangeText={(text) => setUserData({ ...userData, role: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Status"
          value={userData.status}
          onChangeText={(text) => setUserData({ ...userData, status: text })}
        />
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdate}
        >
          <Text style={styles.updateButtonText}>Update User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditUser;
