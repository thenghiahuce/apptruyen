import { Text, SafeAreaView, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import Hearder from './webtruyen/components/Hearder';
import UserProfileScreen from './webtruyen/components/UserProfileScreen';
import HomeScreen from './webtruyen/components/HomeScreen';
import StoryDetailScreen from './webtruyen/components/StoryDetailScreen';
import LoginScreen from './webtruyen/components/LoginScreen';
import RegisterScreen from './webtruyen/components/RegisterScreen';
import AdminHome from './webtruyen/admincomponents/AdminHome';
import AdminHeader from './webtruyen/admincomponents/AdminHearder';
import AdminUser from './webtruyen/admincomponents/AdminUser';
import AdminStory from './webtruyen/admincomponents/AdminStory';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function App() {
  const [username, setUsername] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        checkUserSession();
    }, []);

    const checkUserSession = async () => {
        try {
            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
                setUsername(parsedUserData.username);
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra phiên đăng nhập:', error);
        } finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text>Đang tải...</Text>
            </SafeAreaView>
        );
    }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
          <Stack.Navigator
              initialRouteName={userData ? (userData.role === 'AdminHome' ? 'AdminHome' : 'HomeScreen') : 'Login'}
              screenOptions={{ headerShown: false }}
          >

        <Stack.Screen name="HomeScreen">
        {props => (
          <HomeScreen
            {...props}
            username={username}
            setUsername={setUsername}
          />
        )}
      </Stack.Screen>

          <Stack.Screen name="Login">
            {props => (
              <LoginScreen
                {...props}
                setUsername={setUsername}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Profile" component={UserProfileScreen} />
          <Stack.Screen name="AdminUser" component={AdminUser} />
<Stack.Screen name="AdminStory" component={AdminStory} />

          <Stack.Screen name="Hearder">
            {props => (
              <Hearder
                {...props}
                username={username}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="AdminHome">
            {props => (
              <AdminHome
                {...props}
                username={username}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />

          <Stack.Screen
            name="StoryDetail"
            component={StoryDetailScreen}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

});
