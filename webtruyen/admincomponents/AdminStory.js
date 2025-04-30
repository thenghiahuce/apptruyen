import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const AdminStory = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri, fileName) => {
    const storage = getStorage();
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${fileName}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleAddStory = async () => {
    if (!title || !category || !rating || !image) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImage(image, `${Date.now()}.jpg`);
      await addDoc(collection(db, 'story'), {
        title,
        category,
        rating: parseFloat(rating),
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setTitle('');
      setCategory('');
      setRating('');
      setImage(null);
      alert('Đã thêm truyện thành công!');
    } catch (error) {
      alert('Lỗi khi thêm truyện: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
              <Image source={{ uri: image }} style={styles.image} />
          ) : (
              <Text>Chọn ảnh</Text>
          )}
        </TouchableOpacity>
        <TextInput
            style={styles.input}
            placeholder="Tên truyện"
            value={title}
            onChangeText={setTitle}
        />
        <TextInput
            style={styles.input}
            placeholder="Thể loại"
            value={category}
            onChangeText={setCategory}
        />
        <TextInput
            style={styles.input}
            placeholder="Số sao (VD: 4.5)"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
        />
        <Button
            title={uploading ? 'Đang tải...' : 'Thêm truyện'}
            onPress={handleAddStory}
            disabled={uploading}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#121212' },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  imagePicker: {
    height: 200,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default AdminStory;
