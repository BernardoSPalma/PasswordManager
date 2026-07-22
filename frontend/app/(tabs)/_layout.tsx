import { MAIN_LIGHT_BLUE } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: MAIN_LIGHT_BLUE,
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: styles.floatingTabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarBackground: () => (
          <BlurView
            tint="light" // "light", "dark" ou "systemChromeMaterial"
            intensity={80} // Intensidade do desfoque (0 a 100)
            experimentalBlurMethod="dimezisBlurView" // Suporte para Android
            style={StyleSheet.absoluteFill}
          />
        ),

      }}
    >
      <Tabs.Screen
        name="entries"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "key" : "key-outline"} size={24} color={color} />
          ),
        }}
      />


      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
          ),
        }}
      />


      <Tabs.Screen
        name="create-placeholder"
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/create-entry')}
            >
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="generator"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "dice" : "dice-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    marginHorizontal: 30,
    bottom: 50,
    height: 65,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor:'rgba(255, 255, 255, 0.65)',
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    paddingBottom: 0,
  },
  createButton: {
    width: 45,
    height: 45,
    borderRadius: 28,
    backgroundColor: MAIN_LIGHT_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarItem: {
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0
  },
  tabBarIcon: {
    marginTop: 12,
    marginBottom: 0,
  },
  tabBarItemActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 20,
  }
});
