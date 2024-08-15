import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from "expo-linear-gradient";
import theme from '../themes/theme';
import images from '../images/images';
import { fetchUsers, addUser, deleteUser } from '../redux/actions/usermaiActions'; // Import actions

const UserMaintenance = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.usermai); // Use useSelector to access state
  const [modalVisible, setModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    user_id: "",
    password: "",
    emailid: "",
    mobile_no: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    dispatch(fetchUsers()); // Fetch users when the component mounts
  }, [dispatch]);

  
  const handleAddUser = async () => {
    try {
      await dispatch(addUser(newUser));
      Alert.alert('Success', 'User added successfully');
      setModalVisible(false);
      setNewUser({
        name: "",
        user_id: "",
        password: "",
        emailid: "",
        mobile_no: "",
        role: "",
        status: "",
      });
      dispatch(fetchUsers()); // Refresh the user list
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Failed to add user');
    }
  };
  
  const handleDeleteUser = (userId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await dispatch(deleteUser(userId));
            } catch (error) {
              console.error('Error deleting user:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditUser = (user) => {
    navigation.navigate('EditUser', { user, refreshUsers: () => dispatch(fetchUsers()) });
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userDetails}>
        <Text style={styles.userText}>
          <Text style={styles.userLabel}>Name: </Text>
          {item.name}
        </Text>
        <Text style={styles.userText}>
          <Text style={styles.userLabel}>Email: </Text>
          {item.emailid}
        </Text>
        <Text style={styles.userText}>
          <Text style={styles.userLabel}>Role: </Text>
          {item.role}
        </Text>
        <Text style={styles.userText}>
          <Text style={styles.userLabel}>Status: </Text>
          {item.status}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditUser(item)}
        >
          <Icon name="edit" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteUser(item.user_id)}
        >
          <Icon name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={theme.gradients.lightBluePurple}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Image 
            source={images.logo} 
            style={styles.logo} 
          />
          <Text style={styles.name}>{route.params?.Name || "Admin"}</Text>
        </View>
        <Text style={styles.title}>User Maintenance</Text>
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.user_id ? item.user_id.toString() : item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add User</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newUser.name}
              onChangeText={(text) => setNewUser({ ...newUser, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="User ID"
              value={newUser.user_id}
              onChangeText={(text) => setNewUser({ ...newUser, user_id: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={newUser.password}
              onChangeText={(text) => setNewUser({ ...newUser, password: text })}
              secureTextEntry={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Email ID"
              value={newUser.emailid}
              onChangeText={(text) => setNewUser({ ...newUser, emailid: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile No"
              value={newUser.mobile_no}
              onChangeText={(text) => setNewUser({ ...newUser, mobile_no: text })}
              keyboardType="phone-pad"
            />
            <Picker
              selectedValue={newUser.role}
              style={styles.picker}
              onValueChange={(itemValue) =>
                setNewUser({ ...newUser, role: itemValue })
              }
            >
              <Picker.Item label="Select Role" value="" />
              <Picker.Item label="Admin" value="Admin" />
              <Picker.Item label="User" value="User" />
            </Picker>
            <Picker
              selectedValue={newUser.status}
              style={styles.picker}
              onValueChange={(itemValue) =>
                setNewUser({ ...newUser, status: itemValue })
              }
            >
              <Picker.Item label="Select Status" value="" />
              <Picker.Item label="Active" value="Active" />
              <Picker.Item label="Inactive" value="Inactive" />
            </Picker>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddUser}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "transparent", // Transparent to show gradient background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  Name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B0082",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#4B0082", // Dark purple color
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  userItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  userDetails: {
    flex: 1,
  },
  userLabel: {
    color: "#4B0082",
  },
  userText: {
    fontSize: 16,
    color: "#333",
  },
  actionContainer: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#4B0082",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  addButton: {  
    backgroundColor: "#4B0082", // Blue color
    padding: 8,
    borderRadius: 5,
    margin: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 40,
    marginBottom: 30,
  },
  input: {
    height: 30,
    borderColor: "#4B0082",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#fff",
  },
  picker: {
    height: 40,
    width: "100%",
    marginBottom: 2,
    borderColor: "#4B0082", // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 1,
  },
  saveButton: {
    backgroundColor: "#4B0082",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
  },
});

export default UserMaintenance;
