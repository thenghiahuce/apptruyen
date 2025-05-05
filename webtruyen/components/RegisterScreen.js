import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  Alert, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    setLoading(true);
    console.log('🚀 Bắt đầu đăng ký');

    try {
      // 🔍 Kiểm tra username đã tồn tại trong collection 'users'
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setLoading(false);
        Alert.alert('Lỗi', 'Tên người dùng đã được sử dụng');
        return;
      }

      // ✅ Tạo tài khoản Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Tạo user Firebase thành công:', user.uid);

      // ✅ Thêm thông tin user vào Firestore (collection 'users')
      await addDoc(collection(db, 'users'), {
        id: user.uid,
        username,
        email,
        role: 'user',
        created_at: new Date().toISOString(),
      });

      setLoading(false);
      Alert.alert('Thành công', 'Tài khoản đã được tạo.');
      navigation.goBack();
    } catch (error) {
      console.error('❌ Đăng ký thất bại:', error);
      setLoading(false);
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi, vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      <TextInput
        placeholder="Tên tài khoản"
        placeholderTextColor="#999"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mật khẩu"
        placeholderTextColor="#999"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Nhập lại mật khẩu"
        placeholderTextColor="#999"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerButtonText}>ĐĂNG KÝ</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Đã có tài khoản? Quay lại đăng nhập</Text>
      </TouchableOpacity>
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
  registerButton: {
    backgroundColor: '#3498db', paddingVertical: 12,
    borderRadius: 8, alignItems: 'center', marginTop: 8, marginBottom: 12,
  },
  registerButtonText: {
    color: '#fff', fontWeight: 'bold',
    fontSize: 16, textTransform: 'uppercase',
  },
  link: { marginTop: 8, textAlign: 'center', color: '#3498db', fontSize: 14 },
});

export default RegisterScreen;
