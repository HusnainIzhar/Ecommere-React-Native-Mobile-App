import { View, Text, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { BottomNavigator, BottomNavigatorProps } from 'navigation/bottomNavigator';

const Main = () => {
  const navigation = useNavigation<BottomNavigatorProps>();
  return (
    <>
      <StatusBar hidden />
      <SafeAreaView className='flex-1'>
        <View className='flex-1 justify-center items-center'>
          <LottieView
            source={require('../../../assets/animation.json')}
            autoPlay
            loop={false}
            style={{ width: 200, height: 200 }}
          />
          <Text className='text-xl' style={{ fontFamily: "bold" }}>Order Placed</Text>
          <View className='flex flex-row gap-2' ><Text style={{ fontFamily: "regular" }}>Thankyou for purchasing with us!</Text ></View>
          <TouchableOpacity className=' flex flex-row gap-1 items-center mt-5' onPress={() => navigation.navigate(BottomNavigator.NavigatorHome)}><Ionicons name="arrow-back-sharp" size={20} color="black" /><Text className='' style={{ fontFamily: "regular" }}>Home</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};



export default Main;
