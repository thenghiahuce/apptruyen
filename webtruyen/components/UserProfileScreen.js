import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const UserProfileScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu người dùng:', error);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);

      // Đăng xuất khỏi Firebase
      const auth = getAuth();
      await signOut(auth);

      // Xóa dữ liệu local
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.clear(); // hoặc AsyncStorage.multiRemove(['userData'])

      // Reset navigation và chuyển đến màn hình Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng xuất');
    } finally {
      setLoading(false);
    }
  };
  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hồ sơ người dùng</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.infoBox}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={80} color="#333" />
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>ID:</Text>
              <Text style={styles.value}>{userData?.id || 'Không có ID'}</Text>

              <Text style={styles.label}>Tên tài khoản:</Text>
              <Text style={styles.value}>{userData?.username || 'Không có tên'}</Text>

              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{userData?.email || 'Chưa có email'}</Text>
              <Text style={styles.value}>{userData?.role}</Text>
            </View>
            {
              userData?.role === 'admin' &&(
                <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#0000ff',
                      padding: 15,
                      borderRadius: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 10,
                    }}
                    onPress={() => navigation.navigate('UserManagerScreen')}
                >
                  <Ionicons name="people" size={24} color="#fff" />
                  <Text style={styles.logoutText}>
                    {'Quản lý user'}
                  </Text>
                </TouchableOpacity>

                )
            }

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                disabled={loading}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
              <Text style={styles.logoutText}>
                {loading ? 'Đang xử lý...' : 'Đăng xuất'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default UserProfileScreen;