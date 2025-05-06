import React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkAdminRole, isAdmin, isLogin} from "../utility/plugin";

// Gọi hàm:
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Thêm loading state

  // Hàm validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Hàm lấy thông tin user từ Firestore
  const getUserByEmail = async (email) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
      throw error;
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Thông báo', 'Email không đúng định dạng');
      return;
    }

    try {
      setLoading(true);
      console.log('Auth module before login:', auth); // Debug
      const userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password.trim()
      );

//       // Kiểm tra admin trước
//       const adminQuery = query(
//           collection(db, 'admin'),
//           where('email', '==', email.trim())
//       );
//       const adminSnapshot = await getDocs(adminQuery);
//       // Kiểm tra admin
//       const isAdmin = await checkAdminRole(email.trim());
//       console.log('Admin check:', email.trim(), isAdmin);
//
// // Lấy thông tin user từ Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = {
          ...querySnapshot.docs[0].data(),
          // role: isAdmin ? 'admin' : 'user'  // gán role dựa trên kết quả kiểm tra
        };

        // Log để debug
        console.log('Final userData:', userData);

        // Lưu vào AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        // Chuyển hướng
        navigation.reset({
          index: 0,
          routes: [{
            name: 'Home',
          }],
        });
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      }

    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      Alert.alert('Lỗi đăng nhập', 'Email hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };  useEffect(()=>{
    const checkRule= async () => {
      const check = await isLogin()
      if (check) {
        navigation.navigate('Home')
      }
    }
    checkRule().then(r => {})

  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>

      <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={[
            styles.input,
            !validateEmail(email) && email.length > 0 && { borderColor: 'red' },
          ]}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          autoCompleteType="email"
      />



      <TextInput
          placeholder="Mật khẩu"
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
      />


      <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
        </Text>
      </TouchableOpacity>


      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
        </TouchableOpacity>
        <Text style={styles.link}>Quên mật khẩu?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 12, marginBottom: 16,
    borderRadius: 6, fontSize: 16, color: '#000',
  },
  loginButton: {
    backgroundColor: '#3498db', paddingVertical: 12,
    borderRadius: 8, alignItems: 'center', marginTop: 8,
  },
  loginButtonText: {
    color: '#fff', fontWeight: 'bold',
    fontSize: 16, textTransform: 'uppercase',
  },
  linkContainer: { marginTop: 20, alignItems: 'center' },
  link: { fontSize: 14, color: '#3498db', marginTop: 10 },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },

});

export default LoginScreen;
