import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StoryDetailScreen = ({ route }) => {
  const { story } = route.params;
  const [darkMode, setDarkMode] = useState(true);
  const navigation = useNavigation();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const themeStyles = darkMode ? darkStyles : lightStyles;

  return (
    <ScrollView style={themeStyles.container}>
      {/* Nút quay lại */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={themeStyles.topIcon}>⬅</Text>
        </TouchableOpacity>

        {/* Nút đổi chủ đề */}
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Text style={themeStyles.topIcon}>{darkMode ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={  { uri: story.imageUrl }}
        style={styles.image}
      />

      <Text style={themeStyles.title}>{story.title}</Text>

      {story.description  ? (
        <>
          <Text style={themeStyles.chapterTitle}>{story.title}</Text>
          <Text style={themeStyles.content}>{story.description}</Text>

          <View style={styles.navButtons}>
          </View>
        </>
      ) : (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
          Chưa có nội dung nào cho truyện này.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 16,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 4,
  },
  themeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  topIcon: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#eee',
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: '#ddd',
    textAlign: 'justify',
  },
});

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  topIcon: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#111',
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#444',
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    textAlign: 'justify',
  },
});

export default StoryDetailScreen;
