import { View } from "react-native";
import React from "react";

const ProductSkeleton = () => {
  return (
    <View className="flex-1">
      <View className="h-[40%] bg-[#E9F6FF]"></View>
      <View className="flex-1 bg-white p-5 flex gap-5">
        <View className="flex flex-row justify-between">
          <View className="bg-[#E9F6FF] w-48 h-8 rounded-md"></View>
          <View className="bg-[#E9F6FF] w-16 h-8 rounded-md"></View>
        </View>
        <View className="flex flex-row justify-between">
          <View className="bg-[#E9F6FF] w-20 h-5 rounded-md"></View>
          <View className="bg-[#E9F6FF] w-36 h-5 rounded-md"></View>
        </View>
        <View className="h-5 w-24 bg-[#E9F6FF] rounded-md"></View>
        <View className="h-48 bg-[#E9F6FF] rounded-md"></View>
        <View className="flex flex-row gap-2">
          <View className="w-24 h-8 bg-[#E9F6FF] rounded-md"></View>
          <View className="w-24 h-8 bg-[#E9F6FF] rounded-md"></View>
          <View className="w-24 h-8 bg-[#E9F6FF] rounded-md"></View>
          <View className="w-24 h-8 bg-[#E9F6FF] rounded-md"></View>
        </View>
        <View className="h-48 bg-[#E9F6FF] rounded-md"></View>
      </View>
    </View>
  );
};

export default ProductSkeleton;
