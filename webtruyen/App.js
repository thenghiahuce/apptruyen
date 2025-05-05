import {  SafeAreaView, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import UserProfileScreen from './components/UserProfileScreen';
import StoryDetailScreen from './components/StoryDetailScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Home from "./src/Home";
import AddStoryScreen from "./components/AddStoryScreen";
import EditStoryScreen from "./components/EditStoryScreen";
import UserManagerScreen from "./admincomponents/UserManagerScreen";
const Stack = createStackNavigator();

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
          <Stack.Navigator
              initialRouteName={'Login'}
              screenOptions={{ headerShown: false }}
          >

          <Stack.Screen name="Login" component={LoginScreen}/>

          <Stack.Screen name="Profile" component={UserProfileScreen} />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />

          <Stack.Screen
            name="StoryDetailScreen"
            component={StoryDetailScreen}
          />

              <Stack.Screen
                  name="Home"
                  component={Home}
              />
              <Stack.Screen
                  name="AddStoryScreen"
                  component={AddStoryScreen}
              />
              <Stack.Screen
                  name="EditStoryScreen"
                  component={EditStoryScreen}
              />
              <Stack.Screen
                  name="UserManagerScreen"
                  component={UserManagerScreen}
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
