import React from "react";
import {
  View,
  useWindowDimensions,
  Image,
  Text,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackHeader from "components/ui/backHeader";
import { Colors ,Sizes} from "constants/index";
import { useSelector } from "react-redux";
import { User } from "types/data";
import { useLoadUserQuery } from "redux/features/api/apiSlice";

const Main = () => {
  const width = useWindowDimensions().width;
  const { user }: { user: User } = useSelector((state: any) => state.auth);
  const { refetch } = useLoadUserQuery({});
  React.useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <StatusBar backgroundColor={"white"} />
      <SafeAreaView className="flex-1">
        <View className=" flex-1 bg-white">
          <BackHeader title="Orders" />
          {user && user.orders && user.orders.length === 0 && (
            <View className="flex-1 flex flex-row items-center justify-center">
              <Text className="" style={{ fontFamily: "semiBold" }}>
                Nothing in Orders
              </Text>
            </View>
          )}
          {user && user.orders && user.orders.length > 0 && (
            <ScrollView className="mt-12">
              {[...user.orders]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((e, i) => (
                  <View className="" key={i}>
                    {e &&
                      e.product &&
                      e.product.length > 0 &&
                      e.product.map(
                        (item, j) =>
                          item.product &&
                          item.product.category &&
                          item.product.title &&
                          item.product.image.url && (
                            <View
                              key={j}
                              className="flex flex-row items-center w-full px-4 bg-white gap-2 mt-1 border-b border-gray-200 py-2"
                            >
                              <View>
                                {item && item.product && item.product.image && (
                                  <Image
                                    height={80}
                                    width={80}
                                    className="rounded"
                                    style={{ resizeMode: "cover" }}
                                    source={{ uri: item.product.image.url }}
                                  />
                                )}
                              </View>
                              <View className="flex-1">
                                <View className="flex flex-row justify-between">
                                  <View>
                                    <Text
                                      className={` ${
                                        width > Sizes.breakpoint ? "text-lg" : "text-[10px]"
                                      }`}
                                      numberOfLines={1}
                                      style={{ fontFamily: "bold" }}
                                    >
                                      {item &&
                                        item.product &&
                                        item.product.title}
                                    </Text>
                                  </View>
                                </View>
                                <Text
                                  className={`${width > Sizes.breakpoint ? "text-xs" :"text-[10px]"} text-gray-500`}
                                  style={{ fontFamily: "regular" }}
                                >
                                  {item &&
                                    item.product &&
                                    item.product.category}
                                </Text>
                                <View className="flex flex-row justify-between">
                                  <Text
                                    className={` ${
                                      width > Sizes.breakpoint ? "text-md" : "text-xs"
                                    }`}
                                    style={{
                                      fontFamily: "semiBold",
                                      color: Colors.gray,
                                    }}
                                  >{`Rs.${item.price} * ${item.quantity}`}</Text>
                                  <View className="flex flex-row gap-4 items-center"></View>
                                </View>
                              </View>
                              <View className="flex gap-2 items-center">
                                <View className="w-16 p-1 rounded-md bg-[#264BAE] ">
                                  <Text
                                    className={`text-white text-center ${
                                      width > Sizes.breakpoint ? "text-lg" : "text-xs"
                                    }`}
                                    style={{ fontFamily: "semiBold" }}
                                  >
                                    {e.paymentInfo}
                                  </Text>
                                </View>
                                <View className="flex flex-row gap-1 items-center ">
                                  <MaterialCommunityIcons
                                    name="truck-fast-outline"
                                    size={15}
                                    color={`${
                                      e.status === "Delivered" ||
                                      e.status === "Shipped"
                                        ? "#16A34A"
                                        : e.status === "Pending" ||
                                          e.status === "Processing"
                                        ? "#DD761C"
                                        : `${Colors.gray2}`
                                    }`}
                                  />
                                  <Text
                                    className={`${
                                      e.status === "Delivered" ||
                                      e.status === "Shipped"
                                        ? "text-green-600"
                                        : e.status === "Pending" ||
                                          e.status === "Processing"
                                        ? "text-[#DD761C]"
                                        : `text-${Colors.gray2}`
                                    } text-[10px]`}
                                    style={{
                                      fontFamily: "regular",
                                    }}
                                  >
                                    {e.status}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          )
                      )}
                  </View>
                ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default Main;
