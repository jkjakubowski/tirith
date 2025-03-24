import { Text, View } from 'react-native';


export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-2">Bienvenue sur Tirith</Text>
      <Text className="text-base text-gray-600">Votre nouvelle application React Native</Text>
    </View>
  );
}