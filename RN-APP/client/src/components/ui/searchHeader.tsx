import React, { FC } from "react";
import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import { SimpleLineIcons, Feather, Ionicons } from "@expo/vector-icons";
import { Colors } from "constants/index";
import { useNavigation } from "@react-navigation/native";
import {
  BottomNavigator,
  BottomNavigatorProps,
} from "navigation/bottomNavigator";
import CartIcon from "../icons/cart-icon";

type Props = {
  home?: boolean;
  cartTotal?: number;
  noCart?: boolean;
  search?: string;
  setSearch?: (value: string) => void;
};

const SearchTop: FC<Props> = ({
  home,
  cartTotal,
  noCart,
  search,
  setSearch,
}) => {
  const navigation = useNavigation<BottomNavigatorProps>();

  return (
    <>
      <View className="flex justify-between flex-row items-center mt-5">
        {home && (
          <Image
            source={require("../../../assets/logo.png")}
            style={{ height: 30, width: 30 }}
          />
        )}
        {!home && (
          <TouchableOpacity
            onPressIn={() => navigation.goBack()}
            className="flex flex-row items-center"
          >
            <Ionicons name="chevron-back" size={24} color="black" />
            <Text style={{fontFamily:"semiBold"}}>Back</Text>
          </TouchableOpacity>
        )}
        {!noCart && (
          <TouchableOpacity
            style={{
              position: "relative",
              borderRadius: 999,
              padding: 8,
              backgroundColor: Colors.secondary,
            }}
            onPress={() => navigation.navigate("Cart" as never)}
          >
            <View className="absolute bg-[#264BAE] h-5 w-5 flex items-center justify-center rounded-full right-[-8px] top-[-4px] ">
              <Text className="text-white text-[10px]">{cartTotal}</Text>
            </View>
            <SimpleLineIcons name="handbag" size={15} color={"black"} />
          </TouchableOpacity>
        )}
      </View>
      <View className="w-full h-10 rounded-lg bg-[#EEF7FF] mt-5 px-4 flex flex-row items-center">
        {!home && (
          <TextInput
            placeholder="Search"
            className="w-[95%]"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        )}
        {home && (
          <TextInput
            placeholder="Search"
            className="w-[95%]"
            onPressIn={() =>
              navigation.navigate(BottomNavigator.NavigatorCategory)
            }
          ></TextInput>
        )}
        <Feather name="search" size={20} color="black" />
      </View>
    </>
  );
};

export default SearchTop;
