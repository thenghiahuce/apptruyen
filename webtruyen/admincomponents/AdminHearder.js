import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";

const AdminHeader = ({  onSearch }) => {
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState('');
  const [searchText, setSearchText] = React.useState('');
  const navigation = useNavigation();
  useEffect(() => {
    // Hàm lấy dữ liệu user từ AsyncStorage
    const getUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          setUserName(parsedUserData.username);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu user:', error);
      }
    };

    getUserData();
  }, []);
  const onProfilePress=()=>{
    navigation.navigate('Profile', { userData });
  }
  const handleLogout = async () => {
    try {
      // Hiển thị alert xác nhận đăng xuất
      Alert.alert(
          "Xác nhận",
          "Bạn có chắc chắn muốn đăng xuất?",
          [
            {
              text: "Hủy",
              style: "cancel"
            },
            {
              text: "Đăng xuất",
              onPress: async () => {
                try {
                  // Xóa tất cả dữ liệu người dùng khỏi AsyncStorage
                  await AsyncStorage.multiRemove([
                    'userData',
                    // Thêm các key khác nếu cần
                  ]);

                  // Reset state
                  setUserData(null);
                  setUserName('');

                  // Chuyển hướng về màn hình đăng nhập
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });

                  // Thông báo đăng xuất thành công
                  Alert.alert('Thông báo', 'Đăng xuất thành công');

                } catch (error) {
                  console.error('Lỗi khi đăng xuất:', error);
                  Alert.alert(
                      'Lỗi',
                      'Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại!'
                  );
                }
              },
              style: "destructive"
            }
          ]
      );
    } catch (error) {
      console.error('Lỗi:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi không mong muốn');
    }
  };



  return (
      <View style={styles.container}>
        {/* Thanh trên cùng */}
        <View style={styles.topSection}>
          <Text style={styles.title}>📚 Mê Truyện</Text>

          <View style={styles.iconsRight}>
            <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
              <Ionicons name="person-circle" size={22} color="#fff" />
              <Text style={styles.username}>{userName}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1c1c1e',
    paddingBottom: 4,
  },
  topSection: {
    paddingHorizontal: 10,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  iconsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#f44',
    borderRadius: 6,
    padding: 6,
  },

  navTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#1c1c1e',
  },
  tab: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AdminHeader;