import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    RefreshControl,
    TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminHeader from '../admincomponents/AdminHearder';
import { db } from '../firebaseConfig';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    updateDoc,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { getCategory, isAdmin } from '../utility/plugin';

const Home = () => {
    const navigation = useNavigation();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const flatListRef = useRef(null);
    const [check, setCheck] = useState(false);
    const [filteredStories, setFilteredStories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSelect = (item, index) => {
        setSelectedId(item.id);
        flatListRef.current?.scrollToIndex({ index, animated: true });
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadStories();
    };

    useEffect(() => {
        const checkAdmin = async () => {
            const a = await isAdmin();
            setCheck(a);
        };
        checkAdmin();
        loadStories();
    }, []);

    const loadStories = async () => {
        try {
            const q = query(collection(db, 'stories'), orderBy('createAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const storiesData = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                if (!Array.isArray(data.chapter)) {
                    console.warn(`Invalid chapter for ${doc.id}, fixing to []`);
                    updateDoc(doc.ref, { chapter: [] });
                }
                if (!data.genre || typeof data.genre !== 'object') {
                    console.warn(`Invalid genre for ${doc.id}, fixing to { id: 0, value: 'Tất cả' }`);
                    updateDoc(doc.ref, { genre: { id: '0', value: 'Tất cả' } });
                }
                return { id: doc.id, ...data };
            });
            console.log('Loaded stories:', storiesData);
            setStories(storiesData);
            setFilteredStories(storiesData);
        } catch (error) {
            console.error('Error loading stories:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách truyện');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text) {
            const filtered = stories.filter(
                (story) =>
                    story.title.toLowerCase().includes(text.toLowerCase()) ||
                    story.description.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredStories(filtered);
        } else {
            setFilteredStories(stories);
        }
    };

    const handleDeleteStory = async (story) => {
        Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa truyện này?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa',
                style: 'destructive',
                onPress: async () => {
                    try {
                        setLoading(true);
                        await deleteDoc(doc(db, 'stories', story.id));
                        Alert.alert('Thành công', 'Xóa truyện thành công');
                        await loadStories();
                    } catch (error) {
                        console.error('Error deleting story:', error);
                        Alert.alert('Lỗi', 'Không thể xóa truyện');
                    } finally {
                        setLoading(false);
                    }
                },
            },
        ]);
    };

    const renderStoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.storyItem}
            onPress={() => {
                navigation.navigate('StoryDetailScreen', { story: item });
            }}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.storyImage} />
            <View style={styles.storyInfo}>
                <Text style={styles.storyTitle}>{item.title}</Text>
                <Text style={styles.storyGenre}>
                    {item.genre && item.genre.value ? item.genre.value : 'Không xác định'}
                </Text>
                <Text style={styles.storyStatus} numberOfLines={1}>
                    {item.description}
                </Text>
            </View>
            {check && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => {
                            navigation.navigate('EditStoryScreen', { story: item });
                        }}
                    >
                        <Text style={styles.buttonText}>Sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteStory(item)}
                    >
                        <Text style={styles.buttonText}>Xóa</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderItem = ({ item, index }) => {
        const isSelected = item.id === selectedId;
        return (
            <TouchableOpacity
                style={[
                    {
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        backgroundColor: '#1c1c1e',
                    },
                    { backgroundColor: isSelected ? '#1c1c1e' : '#eee' },
                ]}
                onPress={() => handleSelect(item, index)}
            >
                <Text style={{ color: isSelected ? '#fff' : '#333' }}>{item.value}</Text>
            </TouchableOpacity>
        );
    };

    const renderHeader = () => (
        <View>
            <View style={{ backgroundColor: '#1c1c1e', paddingBottom: 4 }}>
                <AdminHeader />
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Tìm kiếm..."
                        placeholderTextColor="#ccc"
                        value={searchQuery}
                        onChangeText={handleSearch}
                        style={styles.searchInput}
                    />
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                ref={flatListRef}
                data={getCategory()}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
                <FlatList
                    data={
                        selectedId === 0
                            ? filteredStories
                            : filteredStories.filter((story) => story.genre?.id === selectedId)
                    }
                    renderItem={renderStoryItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#0000ff']}
                            tintColor="#0000ff"
                        />
                    }
                    ListHeaderComponent={renderHeader}
                />
            )}
            {check && (
                <View style={styles.floatingButtonContainer}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            navigation.navigate('AddStoryScreen');
                        }}
                    >
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        padding: 10,
        flexGrow: 1,
    },
    storyItem: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    storyImage: {
        width: 80,
        height: 120,
        borderRadius: 4,
    },
    storyInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    storyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    storyGenre: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    storyStatus: {
        fontSize: 14,
        color: '#888',
    },
    actionButtons: {
        justifyContent: 'center',
        gap: 10,
    },
    actionButton: {
        padding: 8,
        borderRadius: 4,
        minWidth: 60,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#4CAF50',
    },
    deleteButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 999,
    },
    addButtonText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    imagePicker: {
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 20,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    imagePickerText: {
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#666',
    },
    saveButton: {
        backgroundColor: '#2196F3',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1000,
        elevation: 10,
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
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#2c2e2e',
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
});

export default Home;