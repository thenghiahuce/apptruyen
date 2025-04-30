import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import { getAuth, signOut } from 'firebase/auth'; // Thêm import này

const Hearder = ({  onSearch, onTabPress }) => {
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

    getUserData()
  }, []);
  const onProfilePress=()=>{
    navigation.navigate('Profile', { userData });
  }


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


        </View>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Tìm kiếm..."
          placeholderTextColor="#ccc"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={() => onSearch?.(searchText)}>
          <Ionicons name="search" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Tabs truyện */}
      <View style={styles.navTabs}>
        <TouchableOpacity onPress={() => onTabPress('hot')}>
          <Text style={styles.tab}>Truyện Hot</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTabPress('short')}>
          <Text style={styles.tab}>Truyện Ngắn</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTabPress('long')}>
          <Text style={styles.tab}>Truyện Dài Tập</Text>
        </TouchableOpacity>

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
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#2c2c2e',
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  searchInput: {
    color: '#fff',
    flex: 1,
    height: 40,
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

export default Hearder;
