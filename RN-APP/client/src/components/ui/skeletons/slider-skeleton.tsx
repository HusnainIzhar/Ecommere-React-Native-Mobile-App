import { View, useWindowDimensions } from "react-native";
import React from "react";
import { Colors } from "constants/index";

const SliderSkeleton = () => {
  const width = useWindowDimensions().width;
  return (
    <View
      style={{
        height: width > 400 ? 115 : 90,
        width: 700,
        backgroundColor: Colors.secondary,
      }}
    ></View>
  );
};

export default SliderSkeleton;
