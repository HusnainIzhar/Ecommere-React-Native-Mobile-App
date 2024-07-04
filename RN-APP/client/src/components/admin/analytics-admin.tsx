import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback } from "react";
import { BarChart } from "react-native-gifted-charts";
import { Chart } from "components/ui/lineChart";
import { useSelector } from "react-redux";
import { useGetAnalyticsQuery, useGetOrderAnalyticsQuery } from "redux/features/analytics/analyticsApi";
import { IProducts } from "types/data";
import { useFocusEffect } from "@react-navigation/native";
import { Sizes } from "constants/index";

export const AnalyticsAdmin = () => {
  const { isLoading, data, refetch } = useGetOrderAnalyticsQuery({});
  const analytics = useSelector((state: any) => state.analytics);
  const allProducts: IProducts[] = useSelector(
    (state: any) => state.allProducts
  );
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const [selected, setSelected] = React.useState("Today");
  const width = useWindowDimensions().width;
  const barData = [
    { value: 250, label: "M" },
    { value: 500, label: "T", frontColor: "#177AD5" },
    { value: 745, label: "W", frontColor: "#177AD5" },
    { value: 320, label: "T" },
    { value: 600, label: "F", frontColor: "#177AD5" },
    { value: 256, label: "S" },
    { value: 300, label: "S" },
    { value: 745, label: "W", frontColor: "#177AD5" },
    { value: 320, label: "T" },
    { value: 600, label: "F", frontColor: "#177AD5" },
    { value: 256, label: "S" },
    { value: 300, label: "S" },
  ];

  return (
    <>
      <StatusBar backgroundColor={"white"}></StatusBar>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="relative flex-1 flex gap-5  mt-5 px-5">
          <Text className={width > Sizes.breakpoint ? "text-lg" : "text-xs"} style={{ fontFamily: "bold" }}>
            Orders Analytics
          </Text>
          <View className="flex flex-row justify-end items-center">
            <View className="flex flex-row items-center bg-[#E9F6FF] rounded-2xl p-1">
              <TouchableOpacity
                onPress={() => setSelected("Today")}
                className={`p-2 rounded-2xl ${
                  selected === "Today" && "bg-[#264BAE]"
                }`}
              >
                <Text
                  className={`${width > Sizes.breakpoint ? "text-lg" : "text-xs"} ${
                    selected === "Today" && "text-white"
                  }`}
                  style={{ fontFamily: "regular" }}
                >
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelected("Weekly")}
                className={`p-2 rounded-2xl ${
                  selected === "Weekly" && "bg-[#264BAE]"
                }`}
              >
                <Text
                  className={`${width > Sizes.breakpoint ? "text-lg" : "text-xs"} ${
                    selected === "Weekly" && "text-white"
                  }`}
                  style={{ fontFamily: "regular" }}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelected("Monthly")}
                className={`p-2 rounded-2xl ${
                  selected === "Monthly" && "bg-[#264BAE]"
                }`}
              >
                <Text
                  className={`${width > Sizes.breakpoint ? "text-lg" : "text-xs"} ${
                    selected === "Monthly" && "text-white"
                  }`}
                  style={{ fontFamily: "regular" }}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <BarChart
            barWidth={width > Sizes.breakpoint ? 16 : 4}
            noOfSections={3}
            barBorderRadius={4}
            frontColor="lightgray"
            data={barData}
            yAxisThickness={0}
            xAxisThickness={0}
          />
          <Text className="" style={{ fontFamily: "bold" }}>
            Sales
          </Text>
          <View className="flex flex-row justify-end items-center ">
            <View className="flex flex-row items-center bg-[#E9F6FF] rounded-2xl p-1">
              <TouchableOpacity
                onPress={() => setSelected("Today")}
                className={`p-2 rounded-2xl ${
                  selected === "Today" && "bg-[#264BAE]"
                }`}
              >
                <Text
                  className={`${width > Sizes.breakpoint ? "text-lg" : "text-xs"} ${
                    selected === "Today" && "text-white"
                  }`}
                  style={{ fontFamily: "regular" }}
                >
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelected("Weekly")}
                className={`p-2 rounded-2xl ${
                  selected === "Weekly" && "bg-[#264BAE]"
                }`}
              >
                <Text
                  className={`${width > Sizes.breakpoint ? "text-lg" : "text-xs"} ${
                    selected === "Weekly" && "text-white"
                  }`}
                  style={{ fontFamily: "regular" }}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelected("Monthly")}
                className={`p-2 rounded-2xl ${
                  selected === "Monthly" && "bg-[#264BAE]"
                }`}
              >
                <Text
                  className={`${width > Sizes.breakpoint ? "text-lg" : "text-xs"} ${
                    selected === "Monthly" && "text-white"
                  }`}
                  style={{ fontFamily: "regular" }}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Chart />
          <View className="mb-16">
            <Text className=" mb-5" style={{ fontFamily: "semiBold" }}>
              Sales this week
            </Text>
            <View className="flex flex-row border-b border-t border-gray-200 py-5">
              <View className="w-[15%]">
                <Text
                  style={{ fontFamily: "semiBold" }}
                  className={`text-center ${width > 500 && "text-xs"}`}
                >
                  No
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  style={{ fontFamily: "semiBold" }}
                  className={`${width > 500 && "text-xs"}`}
                >
                  Product Name
                </Text>
              </View>
              <View className="w-[15%]">
                <Text
                  style={{ fontFamily: "semiBold" }}
                  className={`${width > 500 && "text-xs"}`}
                >
                  Sold
                </Text>
              </View>
            </View>
            <FlatList
              data={[...allProducts].sort((a, b) => b.sold - a.sold)}
              renderItem={({ item, index }) => (
                <View className="flex flex-row py-5 border-b border-gray-200 items-center">
                  <View className="w-[15%] ">
                    <Text
                      style={{ fontFamily: "regular" }}
                      className={`text-center ${width > Sizes.breakpoint && "text-lg"}`}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <View className="flex-1 flex-row gap-2 items-center">
                    <Image
                      style={{ height: 30, width: 30, borderRadius: 3 }}
                      source={{ uri: item.image.url }}
                    />
                    <Text
                      className={width > Sizes.breakpoint ? "text-lg" :"text-[12px]"}
                      style={{ fontFamily: "regular" }}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <View className="w-[15%]">
                    <Text
                      className={`${width > 400 && "text-lg"}`}
                      style={{ fontFamily: "regular" }}
                    >
                      {item.sold}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
