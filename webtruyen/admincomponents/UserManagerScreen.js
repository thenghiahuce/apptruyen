import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, RefreshControl} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {collection, deleteDoc, doc, getDocs, orderBy, query} from "firebase/firestore";
import {db} from "../firebaseConfig";

const initialUsers = [
    {
        id: 'C5qZlBnkEKRHADwDQAuPdijNkRs1',
        username: 'Chinh',
        email: 'Chinh@gmail.com',
        role: 'user',
        created_at: '2025-04-22T06:26:24.088Z',
    },
    // Có thể thêm các user khác vào đây
];

const UserManagerScreen = () => {
    const navigation = useNavigation();
    const [users, setUsers] = useState(initialUsers);
    const loadUsers = async () => {
        try {
            const q = query(collection(db, "users"), orderBy("created_at", "desc"));

            // Lấy dữ liệu từ Firestore
            const querySnapshot = await getDocs(q);

            // Map dữ liệu từ snapshot thành mảng
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Cập nhật state
            setUsers(usersData);
        } catch (error) {
            console.error("Error loading stories:", error);
            Alert.alert("Lỗi", "Không thể tải danh sách truyện");
        }
    };
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh =()=>{
        setUsers([])
        loadUsers().then(r => {});
    }
    useEffect(()=>{
        loadUsers().then(r => {});
    },[])
    const deleteUser = async (userId) => {
        console.log('userId',userId.id)
        try {
            await deleteDoc(doc(db, "users", userId.id));
            Alert.alert("Thành công", "Đã xóa người dùng!");
            onRefresh();
        } catch (error) {
            console.error("Error deleting user:", error);
            Alert.alert("Lỗi", "Không thể xóa người dùng");
        }
    };

    const renderUser = ({ item }) => (
        <View style={styles.userContainer}>
            <View style={styles.userInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Text style={styles.role}>{item.role}</Text>
                <Text style={styles.createdAt}>
                    {new Date(item.created_at).toLocaleString()}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteUser(item)}
            >
                <Text style={styles.deleteButtonText}>Xóa</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#242424" />
                </TouchableOpacity>

            </View>
            <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 16,
            }}>Quản lý Users</Text>
            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={renderUser}
                ListEmptyComponent={<Text style={styles.emptyText}
                                          refreshControl={
                                              <RefreshControl
                                                  refreshing={refreshing}
                                                  onRefresh={onRefresh}
                                                  colors={['#0000ff']} // Màu của indicator trên Android
                                                  tintColor="#0000ff" // Màu của indicator trên iOS
                                              />
                                          }
                                          nestedScrollEnabled={true}


                >Không có user nào</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    userContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    role: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    createdAt: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
    header: {
        height: 60,
        flexDirection: 'row',
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
        color: '#242424',
        marginLeft: 4,
    },
});

export default UserManagerScreen;