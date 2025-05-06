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
    Modal, ActivityIndicator, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import {
    collection,
    addDoc,
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerOptions} from "expo-image-picker/src/ImagePicker.types";
import {Ionicons} from "@expo/vector-icons";
import {getCategory, getRandomInt} from "../utility/plugin";

const AddStoryScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        genre: '',
        description: '',
        rating: 5,
        imageUrl: null,
        chapter: [],
        // id: getRandomInt(1,10000),
    });

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

    const handleAddStory = async () => {
        setLoading(true);
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
            navigation.goBack()
        } catch (error) {
            console.error("Error adding story:", error);
            Alert.alert("Lỗi", "Không thể thêm truyện mới");
        } finally {
            setLoading(false);
        }
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={()=>{
            setFormData(prev => ({ ...prev, genre: item }));
            setModalVisible(false);
        }}>

        <View style={styles.item}>
            <Text style={styles.title}>{item.value}</Text>
        </View>
        </TouchableOpacity>

    );

    return (
        <View style={styles.container}>

                <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Thêm Mới Truyện</Text>
                </View>
            {/*<TouchableWithoutFeedback onPress={Keyboard.dismiss}>*/}
            <View style={{
                flex:1,
                padding: 15,

            }}>
                {loading && (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                )}
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
                            placeholderTextColor={"#242424"}
                            value={formData.title}
                            onChangeText={text => setFormData(prev => ({ ...prev, title: text }))}
                        />
                <TouchableOpacity
                    style={{
                        padding:10,
                        borderWidth: 1,
                        borderColor:"#ddd",
                        borderRadius:4,
                        marginBottom:8
                    }}
                    onPress={()=>{
                    setModalVisible(true);

                }}>
                    {
                        formData && formData.genre && formData.genre.value ? (
                            <Text style={{
                                fontSize: 16,
                                color:"#242424"
                            }}>
                                {formData.genre.value}
                            </Text>
                        ):(
                            <Text style={{
                                fontSize: 16,
                                color:"#242424"
                            }}>
                                Danh mục/Thể loại
                            </Text>
                        )
                    }
                </TouchableOpacity>


                        <TextInput
                            placeholderTextColor={"#242424"}
                            style={[styles.input, styles.textArea]}
                            placeholder="Nội dung"
                            value={formData.description}
                            onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
                            multiline
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleAddStory}
                            >
                                <Text style={styles.buttonText}>
                                    {'Thêm mới'}
                                </Text>
                            </TouchableOpacity>
                        </View>
            </View>
            {/*</TouchableWithoutFeedback>*/}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{
                            padding:12,
                            alignItems: 'left',
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={{
                                    textAlign: 'end',
                                }}>
                                    <Ionicons name="close" size={20} color="#242424" />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    <FlatList
                        data={getCategory()} // Dữ liệu từ hàm getCategory
                        renderItem={renderItem} // Hàm render từng item
                        keyExtractor={(item) => item.id.toString()} // Key duy nhất cho mỗi item
                    />
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
        flex:1,
        zIndex: 1, // Đặt zIndex thấp hơn addButton
        overflow: 'visible',
    },
    storyItem: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 1, // Giảm elevation (thấp hơn addButton)
        zIndex: 1, // Đặt zIndex thấp hơn addButton
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
        fontSize: 18,
        textAlign:'right'
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
        color:"#242424"
    },
    textArea: {
        height: 150,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalButton: {
        // flex: 1,
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
    header: {
        backgroundColor: '#007AFF',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 5,
        marginRight: 15,
    },
    headerText:{
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    item: {
        backgroundColor: '#c4d8ed',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
    },
});

export default AddStoryScreen;