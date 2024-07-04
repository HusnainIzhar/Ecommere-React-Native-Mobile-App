import { View, useWindowDimensions } from "react-native";
import React from "react";

const ProductCardSkeleton = () => {
  const width = useWindowDimensions().width;
  return (
    <View className="flex flex-row flex-wrap justify-between">
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
      <View
        className={`relative animate-pulse ${
          width > 400 ? "w-[120px] h-[150px]" : "w-[90px] h-[140px]"
        }   rounded-md mt-5 bg-[#E9F6FF]`}
      ></View>
    </View>
  );
};

export default ProductCardSkeleton;
