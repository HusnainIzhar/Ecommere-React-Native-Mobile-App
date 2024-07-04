import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import BackHeader from "components/ui/backHeader";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { ICart } from "types/data";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteCart, getAllCart, storeData } from "../../hooks/asyncStore";
import { MainScreenProps, MainScreens } from "../../navigation/mainNavigator";
import { Sizes } from "constants/index";

const Main = () => {
  const [cartData, setCartData] = useState([] as ICart[]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigation = useNavigation<MainScreenProps>();

  const width = useWindowDimensions().width;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getAllCart("Favourite");
    setCartData(data);
  };

  useEffect(() => {
    let total = 0;
    const totalCart = () => {
      cartData.forEach((e) => {
        total += e.total;
      });
    };
    totalCart();
    setTotalPrice(total);
  }, [cartData]);

  return (
    <>
      <StatusBar backgroundColor={"white"}></StatusBar>
      <SafeAreaView className="flex-1">
        <View className=" flex-1 bg-white">
          <BackHeader title="Favourites" />
          {cartData.length === 0 && (
            <View className="flex-1 flex flex-row items-center justify-center">
              <Text className="" style={{ fontFamily: "semiBold" }}>
                Nothing in Favourites
              </Text>
            </View>
          )}
          {cartData.length > 0 && (
            <>
              <FlatList
                showsVerticalScrollIndicator={false}
                className="mt-12 mb-36"
                data={cartData}
                renderItem={({ item }) => (
                  <View className="flex flex-row items-center w-full px-4 bg-white gap-2 mt-1 border-b border-gray-200 py-2">
                    <View>
                      <Image
                        height={80}
                        width={80}
                        className="rounded"
                        style={{ resizeMode: "cover" }}
                        source={{ uri: item.image }}
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex flex-row justify-between items-center">
                        <View>
                          <Text
                            numberOfLines={1}
                            className={` ${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"
                              }`}
                            style={{ fontFamily: "semiBold" }}
                          >
                            {item.title}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            deleteCart(`Favourite${item.id}`);
                            fetchData();
                          }}
                        >
                          <AntDesign name="delete" size={20} color="black" />
                        </TouchableOpacity>
                      </View>
                      <Text
                        className={`text-gray-500 ${width > Sizes.breakpoint ? "text-sm" : "text-[10px]"
                          }`}
                        style={{ fontFamily: "regular" }}
                      >
                        {item.category}
                      </Text>
                      <View className="flex flex-row justify-between">
                        <Text
                          className={`${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"}`}
                          style={{ fontFamily: "semiBold" }}
                        >{`Rs.${item.price}`}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            storeData(`Cart_${item.id}`, {
                              title: item.title,
                              image: item.image,
                              quantity: 1,
                              category: item.category,
                              price: item.price,
                              id: item.id,
                              total: 1 * item.price,
                            });
                            deleteCart(`Favourite${item.id}`);
                            navigation.navigate(MainScreens.StackCart);
                          }}
                        >
                          <Entypo
                            name="circle-with-plus"
                            size={20}
                            color="black"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default Main;
