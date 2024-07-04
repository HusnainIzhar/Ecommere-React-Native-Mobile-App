import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Colors } from "constants/index";
import { UserIcon } from "components/icons";
import { useGetOrdersQuery } from "redux/features/orders/orderApi";
import { useSelector } from "react-redux";
import Loader from "components/ui/loader";
import { useNavigation } from "@react-navigation/native";
import { AdminScreens, AdminScreensProps } from "navigation/adminNavigator";
import { useFocusEffect } from "@react-navigation/native";
import formatTimestamp from "utils/timeFormat";
import { Sizes } from "constants/index";

interface IData {
  name: string;
  city: string;
  total: number;
}

export const OrdersAdmin = () => {
  const [selected, setSelected] = React.useState("Pending");
  const { isLoading, refetch } = useGetOrdersQuery({});
  const width = useWindowDimensions().width;
  const navigation = useNavigation<AdminScreensProps>();
  const orders = useSelector((state: any) => state.orders);
  useFocusEffect(
    React.useCallback(() => {
      const fetchOrders = async () => {
        await refetch();
      };
      fetchOrders();
    }, [])
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <StatusBar backgroundColor={"white"}></StatusBar>
          <SafeAreaView className="flex-1 bg-white">
            <View className="relative flex-1  mt-5 mb-16">
              <View className="flex flex-row justify-center items-center px-5">
                <View className="flex flex-row items-center bg-[#E9F6FF] rounded-2xl p-1">
                  <TouchableOpacity
                    onPress={() => setSelected("Pending")}
                    className={`py-2 px-3 rounded-2xl ${
                      selected === "Pending" && "bg-[#264BAE]"
                    }`}
                  >
                    <Text
                      className={`${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"} ${
                        selected === "Pending" && "text-white"
                      }`}
                      style={{ fontFamily: "regular" }}
                    >
                      Pending
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelected("Processing")}
                    className={`py-2 px-3 rounded-2xl ${
                      selected === "Processing" && "bg-[#264BAE]"
                    }`}
                  >
                    <Text
                      className={`${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"} ${
                        selected === "Processing" && "text-white"
                      }`}
                      style={{ fontFamily: "regular" }}
                    >
                      Processing
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelected("Shipped")}
                    className={`py-2 px-3 rounded-2xl ${
                      selected === "Shipped" && "bg-[#264BAE]"
                    }`}
                  >
                    <Text
                      className={`${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"} ${
                        selected === "Shipped" && "text-white"
                      }`}
                      style={{ fontFamily: "regular" }}
                    >
                      Shipped
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelected("Delivered")}
                    className={`py-2 px-3 rounded-2xl ${
                      selected === "Delivered" && "bg-[#264BAE]"
                    }`}
                  >
                    <Text
                      className={`${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"} ${
                        selected === "Delivered" && "text-white"
                      }`}
                      style={{ fontFamily: "regular" }}
                    >
                      Delivered
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {orders.length === 0 && (
                <View className="flex-1 flex flex-row items-center justify-center">
                  <Text className="text-xs" style={{ fontFamily: "semiBold" }}>
                    Nothing in Orders
                  </Text>
                </View>
              )}
              {orders.length > 0 && (
                <>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    className="mt-12 "
                    data={[...orders]
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .filter((e) => e.status === selected)}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(AdminScreens.StackManageOrders, {
                            param: item._id,
                          })
                        }
                        className="flex flex-row items-center w-full px-4 bg-white gap-2 mt-1 border-b border-gray-200 py-2"
                      >
                        <View>
                          <UserIcon size={width > Sizes.breakpoint ? 40 : 30} color="black" />
                        </View>
                        <View className="flex-1">
                          <View className="flex flex-row justify-between">
                            <View>
                              <Text className={width > Sizes.breakpoint ? "text-sm":"text-xs"} style={{ fontFamily: "bold" }}>
                                {item.customer.name}
                              </Text>
                            </View>
                          </View>
                          <Text
                            className={`${width > Sizes.breakpoint ? "text-xs" : "text-[10px]"} text-gray-500`}
                            style={{ fontFamily: "regular" }}
                          >
                            {item.deliveryAddress.city}
                          </Text>
                          <View className="flex flex-row justify-between">
                            <Text
                              className={width > Sizes.breakpoint ? "text-xs" : "text-[10px]"}
                              style={{
                                fontFamily: "semiBold",
                                color: Colors.gray,
                              }}
                            >{`Rs.${item.totalPrice}/-`}</Text>
                          </View>
                          <Text className={`${width > Sizes.breakpoint ? "text-xs" : "text-[10px]"} text-gray-500`} style={{fontFamily:"regular"}}>{formatTimestamp(item.createdAt)}</Text>
                        </View>
                        <View className="flex gap-2 items-center">
                          <View className=" px-2 py-1 rounded-xl bg-[#264BAE] ">
                            <Text
                              className={`p-1 text-white text-center ${width > Sizes.breakpoint ? "text-xs" : "text-[10px]"}`}
                              style={{ fontFamily: "semiBold" }}
                            >
                              {item.paymentInfo ? item.paymentInfo : "COD"}
                            </Text>
                          </View>
                          <View className="flex flex-row gap-1 items-center ">
                            <Feather name="truck" size={15} color="#FB923C" />
                            <Text
                              className=" text-orange-400 text-[10px]"
                              style={{ fontFamily: "semiBold" }}
                            >
                              {item.status}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </>
              )}
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
};
