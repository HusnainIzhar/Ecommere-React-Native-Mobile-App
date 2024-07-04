import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  useWindowDimensions,
  ToastAndroid,
} from "react-native";
import formatTimestamp from "utils/timeFormat";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { IOrders, Pdct } from "types/data";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "constants/index";
import { Sizes } from "constants/index";
import {
  useGetOrdersQuery,
  useManageOrderMutation,
} from "redux/features/orders/orderApi";
import {
  AdminNavigator,
  AdminNavigatorProps,
} from "navigation/bottomNavigatorAdmin";

type Props = {
  id: string;
};
export const ManageOrder: React.FC<Props> = ({ id }) => {
  const navigation = useNavigation<AdminNavigatorProps>();
  const orders: IOrders[] = useSelector((state: any) => state.orders);
  const { refetch } = useGetOrdersQuery({});
  const width = useWindowDimensions().width;
  const [selected, setSelected] = useState("");
  const [manageOrder, { isSuccess, error, data }] = useManageOrderMutation();
  const [errors, setErrors] = useState("");
  const exactOrders: IOrders = orders.find((e) => e._id === id);

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Status updated!";
      ToastAndroid.show(message, ToastAndroid.SHORT);
      refetch();
      navigation.navigate(AdminNavigator.NavigatorOverview);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        ToastAndroid.show(errorData.data.message, ToastAndroid.SHORT);
      }
    }
  }, [isSuccess, error, data?.message]);

  const validate = () => {
    if (selected === "") {
      setErrors("Please Select any Option");
      return false;
    } else {
      setErrors("");
      return true;
    }
  };

  useEffect(() => {
    if (selected.length > 0) {
      setErrors("");
    }
  }, [selected]);

  const handleSubmit = async () => {
    if (validate()) {
      console.log("clicked");
      const productIds = exactOrders.product.map((item) => item._id);
      await manageOrder({
        product: productIds,
        status: selected,
        orderId: id,
      });
      setSelected("");
      setErrors("");
    }
  };
  return (
    <>
      <StatusBar backgroundColor={"white"}></StatusBar>
      <SafeAreaView className="flex-1">
        <View className="relative flex-1 bg-white">
          <View className="absolute z-20 top-2 flex flex-row items-center w-full px-5 ">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-[#264BAE] p-2 rounded-full"
            >
              <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>
            <Text style={{ fontFamily: "semiBold" }} className={`mx-5 ${width < Sizes.breakpoint && "text-xs"}`}>
              Manage Order
            </Text>
          </View>
          <View className="px-5 mt-12">
            <FlatList
              showsVerticalScrollIndicator={false}
              data={exactOrders.product} 
              renderItem={({ item }) => (
                <View className="flex flex-row py-5 border-b border-gray-200 items-center">
                  <View className="w-[15%]">
                    {item && item.product && item.product.image && item.product.image.url && (
                      <Image
                        style={{ height: 50, width: 50, borderRadius: 3 }}
                        source={{ uri: item.product.image.url }}
                      />
                    )}
                  </View>
                  <View className=" gap-2 px-2">
                    {item && item.product && item.product.title && <Text
                      numberOfLines={1}
                      className={width > Sizes.breakpoint ? "text-xs": "text-[10px]"}
                      style={{ fontFamily: "semiBold" }}
                    >
                      {item.product.title}
                    </Text>}
                    <View className="flex flex-row gap-2 items-center ">
                      <Text
                        style={{ fontFamily: "semiBold" }}
                        className={`${width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"} text-gray-500`}
                      >{`Rs.${item.price}`}</Text>
                      <View className="h-1 w-1 rounded-full bg-gray-500"></View>
                      <Text
                        style={{ fontFamily: "semiBold" }}
                        className={`${width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"} ${item.quantity < 5 ? "text-red-500" : "text-gray-500" }`}
                      >{`${item.quantity} in stock`}</Text>
                    </View>
                  </View>
                  <View className="w-[30%] flex flex-row items-center gap-1 flex-1 justify-end">
                    <Text
                      style={{ fontFamily: "semiBold" }}
                      className={width > Sizes.breakpoint ? "text-xs" : "text-[8px]"}
                    >
                      Quantity:
                    </Text>
                    <Text
                      style={{ fontFamily: "semiBold" }}
                      className={width > Sizes.breakpoint ? "text-xs" : "text-[8px]"}
                    >
                      {item.quantity}
                    </Text>
                  </View>
                </View>
              )}
            />
            <Text style={{ fontFamily: "bold" }} className={`${width > Sizes.breakpoint ? "text-xs" : "text-[10px]"} mt-5`}>
              Order Details
            </Text>
            <View className="border mt-5 border-gray-200 rounded-md p-5 ">
              <View className="flex flex-row justify-between px-2">
                <Text
                  style={{ fontFamily: "semiBold" }}
                  className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"}
                >
                  Name :
                </Text>
                <Text className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"} style={{ fontFamily: "regular" }}>
                  {exactOrders.deliveryAddress.name}
                </Text>
              </View>
              <View className="flex flex-row justify-between px-2">
                <Text
                  style={{ fontFamily: "semiBold" }}
                  className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"}
                >
                  City :
                </Text>
                <Text className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"} style={{ fontFamily: "regular" }}>
                  {exactOrders.deliveryAddress.city}
                </Text>
              </View>
              <View className="flex flex-row justify-between px-2">
                <Text
                  style={{ fontFamily: "semiBold" }}
                  className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"}
                >
                  Mobile :
                </Text>
                <Text className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"} style={{ fontFamily: "regular" }}>
                  {exactOrders.deliveryAddress.mobile}
                </Text>
              </View>
              <View className="flex flex-row justify-between px-2">
                <Text
                  style={{ fontFamily: "semiBold" }}
                  className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"}
                >
                  Street :
                </Text>
                <Text className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"} style={{ fontFamily: "regular" }}>
                  {exactOrders.deliveryAddress.street}
                </Text>
              </View>
              <View className="flex flex-row justify-between px-2">
                <Text
                  style={{ fontFamily: "semiBold" }}
                  className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"}
                >
                  Payment info :
                </Text>
                <Text className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"} style={{ fontFamily: "regular" }}>
                  {exactOrders.paymentInfo}
                </Text>
              </View>
              <View className="flex flex-row justify-between px-2">
                <Text
                  style={{ fontFamily: "semiBold" }}
                  className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"}
                >
                  Order Time :
                </Text>
                <Text className={width > Sizes.breakpoint ? "text-[10px]" : "text-[8px]"} style={{ fontFamily: "regular" }}>
                  {formatTimestamp(exactOrders.createdAt)}
                </Text>
              </View>
              <View className="mt-2 flex flex-row justify-between px-5">
                <Text style={{ fontFamily: "bold" }} className={width > Sizes.breakpoint ? "text-xs" : "text-[10px]"}>
                  Total Payment :
                </Text>
                <Text
                  className={width > Sizes.breakpoint ? "text-xs" : "text-[10px]"}
                  style={{ fontFamily: "semiBold" }}
                >{`Rs.${exactOrders.totalPrice.toString()}/-`}</Text>
              </View>
            </View>
            {exactOrders.status !== "Delivered" && (
              <>
                <Text style={{ fontFamily: "bold" }} className=" mt-5 text-xs">
                  Update Order Status
                </Text>
                <View className="mt-5 flex gap-2">
                  {exactOrders.status === "Pending" && (
                    <TouchableOpacity
                      onPress={() => setSelected("Processing")}
                      className={`flex flex-row gap-3 items-center`}
                    >
                      <Ionicons
                        name="time-outline"
                        size={selected === "Processing" ? 30 : 24}
                        color={
                          selected === "Processing"
                            ? Colors.primary
                            : Colors.gray2
                        }
                      />
                      <Text
                        className={`${
                          selected === "Processing"
                            ? Colors.primary + "text-lg"
                            : Colors.gray2
                        }`}
                        style={{
                          fontFamily:
                            selected === "Processing" ? "semiBold" : "regular",
                        }}
                      >
                        Processing
                      </Text>
                    </TouchableOpacity>
                  )}
                  {exactOrders.status === "Pending" ||
                    (exactOrders.status === "Processing" && (
                      <TouchableOpacity
                        onPress={() => setSelected("Shipped")}
                        className={`flex flex-row gap-3 items-center`}
                      >
                        <MaterialCommunityIcons
                          name="truck-fast-outline"
                          size={selected === "Shipped" ? 30 : 24}
                          color={
                            selected === "Shipped"
                              ? Colors.primary
                              : Colors.gray2
                          }
                        />
                        <Text
                          className={`${
                            selected === "Shipped"
                              ? Colors.primary + "text-lg"
                              : Colors.gray2
                          }`}
                          style={{
                            fontFamily:
                              selected === "Shipped" ? "semiBold" : "regular",
                          }}
                        >
                          Shipped
                        </Text>
                      </TouchableOpacity>
                    ))}
                  {exactOrders.status === "Pending" ||
                    exactOrders.status === "Processing" ||
                    (exactOrders.status === "Shipped" && (
                      <TouchableOpacity
                        onPress={() => setSelected("Delivered")}
                        className={`flex flex-row gap-3 items-center`}
                      >
                        <Ionicons
                          name="checkmark-done-circle-outline"
                          size={selected === "Delivered" ? 30 : 24}
                          color={
                            selected === "Delivered"
                              ? Colors.primary
                              : Colors.gray2
                          }
                        />
                        <Text
                          className={`${
                            selected === "Delivered"
                              ? Colors.primary + "text-lg"
                              : Colors.gray2
                          }`}
                          style={{
                            fontFamily:
                              selected === "Delivered" ? "semiBold" : "regular",
                          }}
                        >
                          Delivered
                        </Text>
                      </TouchableOpacity>
                    ))}

                  {errors.length > 0 && (
                    <Text
                      className="text-red-500 text-xs"
                      style={{ fontFamily: "regular" }}
                    >
                      {errors}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  className="mt-5 bg-[#264BAE] p-4 rounded-md"
                >
                  <Text
                    style={{ fontFamily: "semiBold" }}
                    className="text-center text-white text-xs"
                  >
                    Update
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
