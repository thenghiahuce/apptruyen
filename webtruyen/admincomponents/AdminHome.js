import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminHeader from './AdminHearder';
import { db, storage } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerOptions} from "expo-image-picker/src/ImagePicker.types";

const AdminHome = () => {
  const navigation = useNavigation();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: '',
    rating: 5,
    imageUrl: null,
    chapter: [],
    status: 'Đang cập nhật'
  });






  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const q = query(collection(db, "stories"), orderBy("createAt", "desc"));
      const querySnapshot = await getDocs(q);
      const storiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStories(storiesData);
    } catch (error) {
      console.error("Error loading stories:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách truyện");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
        base64: true
      });
      console.log('result',result)
      if (!result.canceled) {
        console.log('result', result.assets[0].uri)
        // const uploadUrl = await uploadImage(result.assets[0].imageUri);
        setFormData(prev => ({ ...prev, imageUrl: result.assets[0].uri }));
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải ảnh lên");
      setLoading(false);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `stories/${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleAddStory = async () => {
    if (!formData.title || !formData.genre || !formData.imageUrl) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "stories"), {
        ...formData,
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString()
      });

      Alert.alert("Thành công", "Thêm truyện mới thành công");
      setModalVisible(false);
      resetForm();
      loadStories();
    } catch (error) {
      console.error("Error adding story:", error);
      Alert.alert("Lỗi", "Không thể thêm truyện mới");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStory = async () => {
    if (!formData.title || !formData.genre) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const storyRef = doc(db, "stories", selectedStory.id);
      await updateDoc(storyRef, {
        ...formData,
        updateAt: new Date().toISOString()
      });

      Alert.alert("Thành công", "Cập nhật truyện thành công");
      setModalVisible(false);
      resetForm();
      loadStories();
    } catch (error) {
      console.error("Error updating story:", error);
      Alert.alert("Lỗi", "Không thể cập nhật truyện");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (story) => {
    Alert.alert(
        "Xác nhận",
        "Bạn có chắc chắn muốn xóa truyện này?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xóa",
            style: "destructive",
            onPress: async () => {
              try {
                setLoading(true);
                await deleteDoc(doc(db, "stories", story.id));

                if (story.imageUrl) {
                  const imageRef = ref(storage, story.imageUrl);
                  await deleteObject(imageRef);
                }

                Alert.alert("Thành công", "Xóa truyện thành công");
                loadStories();
              } catch (error) {
                console.error("Error deleting story:", error);
                Alert.alert("Lỗi", "Không thể xóa truyện");
              } finally {
                setLoading(false);
              }
            }
          }
        ]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      genre: '',
      description: '',
      rating: 5,
      imageUrl: '',
      chapter: [],
      status: 'Đang cập nhật'
    });
    setSelectedStory(null);
  };

  const renderStoryItem = ({ item }) => (
      <View style={styles.storyItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.storyImage} />
        <View style={styles.storyInfo}>
          <Text style={styles.storyTitle}>{item.title}</Text>
          <Text style={styles.storyGenre}>{item.genre}</Text>
          <Text style={styles.storyStatus}>{item.status}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => {
                setSelectedStory(item);
                setFormData(item);
                setModalVisible(true);
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
      </View>
  );

  return (
      <View style={styles.container}>
        <AdminHeader />

        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : (
            <FlatList
                data={stories}
                renderItem={renderStoryItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
        )}

        <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setModalVisible(true);
            }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedStory ? 'Cập nhật truyện' : 'Thêm truyện mới'}
              </Text>

              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {formData.imageUrl ? (
                    <Image source={{ uri: formData.imageUrl }} style={styles.previewImage} />
                ) : (
                    <Text style={styles.imagePickerText}>Chọn ảnh</Text>
                )}
              </TouchableOpacity>

              <TextInput
                  style={styles.input}
                  placeholder="Tiêu đề"
                  value={formData.title}
                  onChangeText={text => setFormData(prev => ({ ...prev, title: text }))}
              />

              <TextInput
                  style={styles.input}
                  placeholder="Thể loại"
                  value={formData.genre}
                  onChangeText={text => setFormData(prev => ({ ...prev, genre: text }))}
              />

              <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Mô tả"
                  value={formData.description}
                  onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
                  multiline
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
                >
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={selectedStory ? handleUpdateStory : handleAddStory}
                >
                  <Text style={styles.buttonText}>
                    {selectedStory ? 'Cập nhật' : 'Thêm mới'}
                  </Text>
                </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 10,
  },
  storyItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
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
});

export default AdminHome;