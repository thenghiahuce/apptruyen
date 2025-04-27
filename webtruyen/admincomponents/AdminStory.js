import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const storiesData = {
  'Đại Chúa Tể': [
    {
      id: 1,
      title: 'Chương 1: Khởi đầu',
      content: 'Lạc Thần, một thiếu niên mang dòng máu cổ xưa, từ một ngôi làng nhỏ bước vào thế giới tu luyện với khát khao trở thành Chúa Tể...'
    },
    {
      id: 2,
      title: 'Chương 2: Linh căn thức tỉnh',
      content: 'Tại lễ thức tỉnh linh căn, toàn bộ người dân sững sờ khi Lạc Thần mang linh căn biến dị – Hỗn Nguyên Linh Căn, thứ từng xuất hiện trong truyền thuyết...'
    }
  ],
  'Phàm Nhân Tu Tiên': [
    {
      id: 1,
      title: 'Chương 1: Người phàm mộng đạo',
      content: 'Hàn Lập – một thanh niên nghèo khó sống bằng nghề bốc thuốc – tình cờ cứu được một lão đạo sĩ và được truyền cho tâm pháp tu tiên sơ cấp...'
    },
    {
      id: 2,
      title: 'Chương 2: Bước chân đầu tiên',
      content: 'Với lòng kiên trì và trí tuệ, Hàn Lập dần mở ra kinh mạch và bước vào tầng luyện khí đầu tiên, đặt nền móng cho con đường tu tiên gian khổ...'
    }
  ],
  'Xuyên Không': [
    {
      id: 1,
      title: 'Chương 1: Cánh cổng thời không',
      content: 'Trần Khải – một lập trình viên 27 tuổi – vô tình bước vào cánh cổng thời không trong lúc thử nghiệm thiết bị VR và bị đưa đến thế giới phong kiến lạ lẫm...'
    },
    {
      id: 2,
      title: 'Chương 2: Thiếu gia giả danh',
      content: 'Tỉnh lại, Trần Khải phát hiện mình đang trong thân xác của thiếu gia nhà quan, từ đây bắt đầu cuộc sống mới không có Ctrl+Z...'
    }
  ],
  'Mục Thần Ký': [
    {
      id: 1,
      title: 'Chương 1: Cậu bé trong thôn Thần Bí',
      content: 'Tần Mục được các vị thần trong thôn nuôi lớn, mỗi người đều kỳ quái nhưng lại sở hữu sức mạnh vô biên. Cậu dần phát hiện bí mật thân thế của mình...'
    },
    {
      id: 2,
      title: 'Chương 2: Xuống núi',
      content: 'Rời khỏi thôn Thần Bí, Tần Mục lần đầu đặt chân đến thế giới bên ngoài và bị cuốn vào vòng xoáy tranh đoạt quyền lực giữa các thế lực thần đạo...'
    }
  ],
  'Bảo bối của ngài Tống': [
    {
      id: 1,
      title: 'Chương 1: Thức tỉnh tại thế giới mới',
      content: 'Minh – một game thủ – bất ngờ được triệu hồi sang dị giới. Trước mắt cậu là vùng đất bị chiến tranh tàn phá và những chủng tộc kỳ bí...'
    },
    {
      id: 2,
      title: 'Chương 2: Đấu trường sinh tử',
      content: 'Minh bị đưa đến một đấu trường nơi những kẻ ngoại lai buộc phải chiến đấu để sinh tồn. Chính nơi đây, cậu bắt đầu hiểu được ý nghĩa sức mạnh thật sự...'
    }
  ],
  'Đập nồi bán sắt đi học': [
    {
      id: 1,
      title: 'Chương 1: Chiến binh vô danh',
      content: 'Trong một thế giới nơi sức mạnh quyết định tất cả, Long Phi – một chiến binh bị lưu đày – quay trở lại chiến trường với thanh kiếm huyền thoại trong tay.'
    },
    {
      id: 2,
      title: 'Chương 2: Hồi sinh trong chiến tranh',
      content: 'Bị bao vây bởi kẻ thù, Long Phi không đầu hàng. Anh trỗi dậy từ đống đổ nát và trở thành cơn ác mộng đối với kẻ thù của mình...'
    }
  ]
};



const AdminStory = ({ route }) => {
  const { story } = route.params;
  const [currentChapter, setCurrentChapter] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const navigation = useNavigation();

  const chapters = storiesData[story.title] || [];
  const chapter = chapters[currentChapter];

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
        source={typeof story.image === 'number' ? story.image : { uri: story.image }}
        style={styles.image}
      />

      <Text style={themeStyles.title}>{story.title}</Text>

      {chapter ? (
        <>
          <Text style={themeStyles.chapterTitle}>{chapter.title}</Text>
          <Text style={themeStyles.content}>{chapter.content}</Text>

          <View style={styles.navButtons}>
            <TouchableOpacity
              onPress={() => setCurrentChapter(currentChapter - 1)}
              disabled={currentChapter === 0}
              style={[styles.button, currentChapter === 0 && styles.disabled]}
            >
              <Text style={styles.buttonText}>◀ Chương trước</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCurrentChapter(currentChapter + 1)}
              disabled={currentChapter === chapters.length - 1}
              style={[styles.button, currentChapter === chapters.length - 1 && styles.disabled]}
            >
              <Text style={styles.buttonText}>Chương tiếp ▶</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
          Chưa có chương nào cho truyện này.
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

export default AdminStory;
