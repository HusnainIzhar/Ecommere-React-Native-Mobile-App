import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

export const Colors = {
  primary: "#264BAE",
  secondary: "#E9F6FF",
  tertiary: "#FF7754",
  gray: "#83829a",
  gray2: "#c1c0c8",
  offWhite: "#f3f4f8",
  lightWhite: "#fafafc",
};

export const Sizes = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 44,
  breakpoint:400,
  height,
  width,
};

export const Shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};
