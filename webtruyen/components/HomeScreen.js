import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  TextInput,
  Modal,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './Hearder';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
const HomeScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');


  const [stories, setStories] = useState([
    {
      id: '1',
      title: 'Đại Chúa Tể',
      genre: 'Huyền Huyễn, Truyện Ngắn',
      rating: 5,
      image: require('../assets/dai-chua-te-3280-1.jpg'),
    },
    {
      id: '2',
      title: 'Phàm Nhân Tu Tiên',
      genre: 'Tiên Hiệp, Truyện Ngắn',
      rating: 4.8,
      image: require('../assets/phamnhantutien.jpg'),
    },
    {
      id: '3',
      title: 'Xuyên Không',
      genre: 'Xuyên Không, Truyện Ngắn',
      rating: 4.6,
      image: require('../assets/xuyenkhong.jpg'),
    },
    {
      id: '4',
      title: 'Mục Thần Ký',
      genre: 'Thần Thoại, Truyện Dài Tập',
      rating: 4.9,
      image: require('../assets/mucthanky.jpg'),
    },
    {
      id: '5',
      title: 'Bảo bối của ngài Tống',
      genre: 'Tình Cảm, Truyện Ngắn',
      rating: 4.9,
      image: require('../assets/baoboicuangaitong.jpg'),
    },
    {
      id: '6',
      title: 'Đập nồi bán sắt đi học',
      genre: 'Tương Lai, Truyện Ngắn',
      rating: 4.8,
      image: require('../assets/dapnoibansatdihoc.jpg'),
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState(null);

  const openEditModal = (story) => {
    setNewTitle(story.title);
    setNewDesc(story.description);
    setEditingId(story.id);
    setModalVisible(true);
  };

  const saveStory = () => {
    if (!newTitle.trim()) return;

    if (editingId) {
      setStories(prev =>
        prev.map(story => story.id === editingId
          ? { ...story, title: newTitle, description: newDesc }
          : story)
      );
    } else {
      const newStory = {
        id: (Date.now()).toString(),
        title: newTitle,
        genre: 'Mới',
        rating: 5,
        image: require('../assets/snack-icon.png'),
      };
      setStories(prev => [newStory, ...prev]);
    }

    setModalVisible(false);
  };

  const deleteStory = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá truyện này?', [
      { text: 'Huỷ' },
      { text: 'Xoá', style: 'destructive', onPress: () => setStories(prev => prev.filter(s => s.id !== id)) }
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('StoryDetail', { story: item })}
      style={styles.gridCard}
    >
      <Image source={item.image} style={styles.gridImage} />
      <Text style={styles.gridTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.gridGenre}>{item.genre}</Text>
      <View style={styles.ratingRow}>
        <Text style={styles.star}>⭐️⭐️⭐️⭐️⭐️</Text>
        <Text style={styles.rating}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        username={username}
        onLogout={async () => {
          await signOut(getAuth());
          setUsername('');
          navigation.navigate('Login');
        }}
        onProfilePress={() => navigation.navigate('Profile',{
          username: "Nguyẽn thế Nghia ",
          email: "nguyenthnghiag@gmail",
        })} // thay đổi theo màn hình bạn có
      />

      <FlatList
        data={stories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput placeholder="Tiêu đề" value={newTitle} onChangeText={setNewTitle} style={styles.input} />
            <TextInput placeholder="Mô tả" value={newDesc} onChangeText={setNewDesc} style={styles.input} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Huỷ" onPress={() => setModalVisible(false)} />
              <Button title="Lưu" onPress={saveStory} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 12,
  },
  gridCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 16,
    width: '48%',
    elevation: 2,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 6,
    marginHorizontal: 8,
  },
  gridGenre: {
    fontSize: 12,
    color: '#aaa',
    marginHorizontal: 8,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  star: {
    color: '#FFD700',
    fontSize: 12,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    color: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 12,
    fontSize: 16,
    padding: 4,
  },
  fab: {
    position: 'absolute',
    width: 48,
    height: 48,
    bottom: 32,
    right: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: '#5A5FCE',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.13)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  }
});

export default HomeScreen;
