import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';

const TabRoot = () => {
  return (
    <Tabs>
        <Tabs.Screen name="index" 
        options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          }}/>
        <Tabs.Screen name="about"/>
        <Tabs.Screen name="profile"/>
    </Tabs>
  )
}

export default TabRoot;