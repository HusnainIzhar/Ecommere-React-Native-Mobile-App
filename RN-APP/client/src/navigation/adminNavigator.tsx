import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavigationAdmin from "./bottomNavigatorAdmin";
import { AddProduct } from "../screens/adminScreens/addProduct";
import EditProduct from "screens/adminScreens/editProduct";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RouteProp } from "@react-navigation/native";
import ManageOrders from "screens/adminScreens/manageOrders";
import UpdatePassword from "screens/updatePassword";

const Stack = createNativeStackNavigator();

export enum AdminScreens {
  StackOverview = "Overview",
  StackAddProduct = "AddProduct",
  StackEditProduct = "EditProduct",
  StackManageOrders = "ManageOrders",
  StackUpdatePassword = "UpdatePassword",
}

export type AdminScreensParams = {
  [AdminScreens.StackAddProduct]: undefined;
  [AdminScreens.StackEditProduct]: { param: string };
  [AdminScreens.StackOverview]: undefined;
  [AdminScreens.StackManageOrders]: { param: string };
  [AdminScreens.StackUpdatePassword]: undefined;
};

export type AdminScreensProps<
  RouteName extends keyof AdminScreensParams = keyof AdminScreensParams
> = NativeStackNavigationProp<AdminScreensParams, RouteName>;

export type AdminScreensRouteProps<
  RouteName extends keyof AdminScreensParams = AdminScreens
> = RouteProp<AdminScreensParams, RouteName>;

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={AdminScreens.StackOverview}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={AdminScreens.StackOverview}
        component={BottomNavigationAdmin}
      />
      <Stack.Screen
        name={AdminScreens.StackAddProduct}
        component={AddProduct}
      />
      <Stack.Screen
        name={AdminScreens.StackEditProduct}
        component={EditProduct}
      />
      <Stack.Screen
        name={AdminScreens.StackManageOrders}
        component={ManageOrders}
      />
      <Stack.Screen
        name={AdminScreens.StackUpdatePassword}
        component={UpdatePassword}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
