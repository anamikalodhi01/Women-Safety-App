import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

const About = () => {
    const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl font-bold">Hii Mukti , About Page</Text>
      <TouchableOpacity className="mt-5 bg-pink-700 p-4 rounded-2xl"
        onPress={() => router.back()}>
            <Text className="text-white font-bold text-lg">Go Back</Text>
        </TouchableOpacity>
    </View>
  );
};

export default About;
