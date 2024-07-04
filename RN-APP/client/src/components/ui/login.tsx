import React from "react";
import { View, Text, TextInput, Button, Pressable } from "react-native";

type Props = {};

const Login = (props: Props) => {
  return (
    <View className="py-24 mx-5 font-poppins-bold">
      <Text className="text-center text-xl">Login</Text>
      <TextInput className=" rounded border-zinc-400 border-[.5px]"></TextInput>
      <Pressable className="bg-[#5755FE] py-2 rounded">
        <Text className="text-center text-white">Login/Signup</Text>
      </Pressable>
    </View>
  );
};

export default Login;
