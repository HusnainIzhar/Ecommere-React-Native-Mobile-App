import { Text, View, StatusBar, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLogoutQuery } from "redux/features/auth/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { MainScreenProps, MainScreens } from "navigation/mainNavigator";
import { IUser } from "types/data";

export default function Main() {
  const navigation = useNavigation<MainScreenProps<MainScreens>>();
  const [logout, setLogout] = useState(false);
  const {} = useLogoutQuery(undefined, { skip: !logout ? true : false });
  const { user }: { user: IUser } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const removeTokens = async () => {
      return await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
    };
    removeTokens();
  }, [logout]);

  return (
    <SafeAreaView className="flex-1">
      <StatusBar backgroundColor={"transparent"}></StatusBar>
      <View className="flex-1">
        <Image
          style={{ height: 100, resizeMode: "cover" }}
          source={{
            uri: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
        ></Image>
        <View className="flex-1 relative bg-white">
          <View className="absolute top-[-30px] left-[50%] transform translate-x-[-36px]">
            <View className="flex flex-row items-center justify-center bg-white p-1 rounded-full">
              <Image
                style={{ height: 60, width: 60 }}
                className="rounded-full"
                source={{ uri: `${user.avatar}` }}
              />
            </View>
          </View>
          <View className="flex flex-row justify-center items-center mt-10">
            <View>
              <Text style={{ fontFamily: "regular" }} className="text-center">
                {user.name}
              </Text>
              <Text style={{ fontFamily: "regular" }} className="text-center">
                {user.email}
              </Text>
            </View>
          </View>
          <View className="px-5 mt-5">
            <TouchableOpacity
              onPress={() => navigation.navigate(MainScreens.StackFavourite)}
              className="flex flex-row items-center gap-5 border-b border-gray-200 py-4"
            >
              <AntDesign name="hearto" size={24} color="black" />
              <Text style={{ fontFamily: "regular" }} className=" ">
                Favourite
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(MainScreens.StackOrders)}
              className="flex flex-row items-center gap-5 border-b border-gray-200 py-4"
            >
              <Feather name="truck" size={24} color="black" />
              <Text style={{ fontFamily: "regular" }} className=" ">
                Orders
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(MainScreens.StackCart)}
              className="flex flex-row items-center gap-5 border-b border-gray-200 py-4"
            >
              <Feather name="shopping-cart" size={24} color="black" />
              <Text style={{ fontFamily: "regular" }} className=" ">
                Cart
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-row items-center gap-5 border-b border-gray-200 py-4">
              <MaterialIcons name="cached" size={24} color="black" />
              <Text style={{ fontFamily: "regular" }} className=" ">
                Clear Cache
              </Text>
            </TouchableOpacity>
            {user.socialProfile !== true && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(MainScreens.StackUpdatePassword)
                }
                className="flex flex-row items-center gap-5 border-b border-gray-200 py-4"
              >
                <MaterialIcons name="password" size={24} color="black" />
                <Text style={{ fontFamily: "regular" }} className=" ">
                  Change Password
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setLogout(true)}
              className="flex flex-row items-center gap-5  border-gray-200 py-4"
            >
              <MaterialIcons name="logout" size={24} color="black" />
              <Text style={{ fontFamily: "regular" }} className=" ">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
