import React, { Component } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import {
  Cart,
  Product,
  Checkout,
  OrderPlace,
  Orders,
  Favourite,
} from "../screens";
import BottomNavigation, { BottomNavigator } from "./bottomNavigator";
import { RouteProp } from "@react-navigation/native";
import UpdatePassword from "screens/updatePassword";

const Stack = createNativeStackNavigator();

export enum MainScreens {
  StackCart = "Cart",
  StackProduct = "Product",
  StackCheckout = "Checkout",
  StackOrderPlace = "OrderPlace",
  StackOrders = "Orders",
  StackFavourite = "Favourite",
  StackUpdatePassword = "UpdatePassword",
}

export type MainScreensParams = {
  [MainScreens.StackCart]: undefined;
  [MainScreens.StackProduct]: { param: string };
  [MainScreens.StackCheckout]: undefined;
  [MainScreens.StackOrderPlace]: undefined;
  [MainScreens.StackOrders]: undefined;
  [MainScreens.StackFavourite]: undefined;
  [MainScreens.StackUpdatePassword]: undefined;
};

export type MainScreenProps<
  RouteName extends keyof MainScreensParams = MainScreens
> = NativeStackNavigationProp<MainScreensParams, RouteName>;

export type MainScreensRouteProps<
  RouteName extends keyof MainScreensParams = MainScreens
> = RouteProp<MainScreensParams, RouteName>;

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={BottomNavigator.NavigatorHome}
        component={BottomNavigation}
      />
      <Stack.Screen name={MainScreens.StackProduct} component={Product} />
      <Stack.Screen name={MainScreens.StackCart} component={Cart} />
      <Stack.Screen name={MainScreens.StackCheckout} component={Checkout} />
      <Stack.Screen name={MainScreens.StackOrderPlace} component={OrderPlace} />
      <Stack.Screen name={MainScreens.StackOrders} component={Orders} />
      <Stack.Screen name={MainScreens.StackFavourite} component={Favourite} />
      <Stack.Screen
        name={MainScreens.StackUpdatePassword}
        component={UpdatePassword}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
