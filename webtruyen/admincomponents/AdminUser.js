import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AdminUser = ({ route, navigation }) => {
  const { username, email = 'Chưa có email', id = 'Không rõ ID' } = route.params || {};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>⬅️</Text>
      </TouchableOpacity>
      <Text style={styles.header}>👤 Thông Tin Người Dùng</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Tên tài khoản:</Text>
        <Text style={styles.value}>{username}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email}</Text>

        <Text style={styles.label}>ID Firebase:</Text>
        <Text style={styles.value}>{id}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60, paddingHorizontal: 20 },
  backButton: { position: 'absolute', top: 30, left: 20, zIndex: 10, padding: 8 },
  backButtonText: { color: '#fff', fontSize: 24 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 30, textAlign: 'center' },
  infoBox: { backgroundColor: '#1e1e1e', borderRadius: 10, padding: 20 },
  label: { color: '#aaa', fontSize: 14, marginTop: 12 },
  value: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default AdminUser;
