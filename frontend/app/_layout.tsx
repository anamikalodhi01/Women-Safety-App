// import { Stack } from "expo-router";
// import Settings from "./settings";

// const RootLayout = () => {
//   return (
//     <Stack>
//       <Stack.Screen name="index" options={{ headerShown: false }}/>
//       <Stack.Screen name="login" options={{ headerShown: false }}/>
//       <Stack.Screen name="HomeScreen" options={{ headerShown: false }}/>
//       <Stack.Screen name="editProfile" options={{ headerShown: false }}/>
//       <Stack.Screen name="signup" options={{ headerShown: false }}/>
//       <Stack.Screen name="AddFriend" options={{ headerShown: false }}/>
//       <Stack.Screen name="LiveLocationMap" options={{ headerShown: false }}/>
//       <Stack.Screen name="FakeCallScreen" options={{ headerShown: false }}/>
      
      


//     </Stack>
//   );
// };

// export default RootLayout;
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const RootLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const router = useRouter();

  // Check if the user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token); // If token exists, user is logged in
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    // Show a loading spinner while checking login status
    return null; 
  }

  return (
    <Stack>
      {isLoggedIn ? (
        // If logged in, go straight to HomeScreen
        <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
      ) : (
        // If not logged in, show the slider screens
        <>
          <Stack.Screen name="SliderScreen1" options={{ headerShown: false }} />
          <Stack.Screen name="SliderScreen2" options={{ headerShown: false }} />
          <Stack.Screen name="SliderScreen3" options={{ headerShown: false }} />
        </>
      )}

      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="editProfile" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="AddFriend" options={{ headerShown: false }} />
      <Stack.Screen name="LiveLocationMap" options={{ headerShown: false }} />
      <Stack.Screen name="FakeCallScreen" options={{ headerShown: false }} />
      <Stack.Screen name="SliderScreen1" options={{ headerShown: false }} />
      <Stack.Screen name="SliderScreen2" options={{ headerShown: false }} />
      <Stack.Screen name="SliderScreen3" options={{ headerShown: false }} />
      
    </Stack>
  );
};

export default RootLayout;
