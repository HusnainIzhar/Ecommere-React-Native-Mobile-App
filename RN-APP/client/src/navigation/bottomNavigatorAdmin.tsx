import {
  Overview,
  Products,
  Orders,
  Accounts,
  Analytics,
} from "../screens/adminScreens/index";
import { Colors } from "../constants/index";
import {
  OverviewIcon,
  ProductIcon,
  AnalyticIcon,
  UserIcon,
  CartIcon,
} from "components/icons/index";
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import React from "react";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { StyleSheet } from "react-native";

export enum AdminNavigator {
  NavigatorOverview = "Overview",
  NavigatorProducts = "Products",
  NavigatorOrders = "Orders",
  NavigatorAnalytics = "Analytics",
  NavigatorAccounts = "Accounts",
}

export type AdminNavigatorParams = {
  [AdminNavigator.NavigatorOverview]: undefined;
  [AdminNavigator.NavigatorProducts]: undefined;
  [AdminNavigator.NavigatorOrders]: undefined;
  [AdminNavigator.NavigatorAnalytics]: undefined;
  [AdminNavigator.NavigatorAccounts]: undefined;
};

export type AdminNavigatorProps<
  RouteName extends keyof AdminNavigatorParams = keyof AdminNavigatorParams
> = NativeStackNavigationProp<AdminNavigatorParams, RouteName>;

export type BottomNavigatorRouteProps<
  RouteName extends keyof AdminNavigatorParams = keyof AdminNavigatorParams
> = RouteProp<AdminNavigatorParams, RouteName>;

export type BottomNavigatorNavigationProp<
  RouteName extends keyof AdminNavigatorParams = keyof AdminNavigatorParams
> = BottomTabNavigationProp<AdminNavigatorParams, RouteName>;

const BottomNavigationAdmin = () => {
  const Tab = createBottomTabNavigator();

  const screenOptions = {
    tabBarShowLabel: true,
    tabBarHideOnKeyboard: true,
    headerShown: false,
    tabBarStyle: styles.tabBar,
    tabBarLabelPosition: "below-icon" as "below-icon",
    tabBarActiveTintColor: Colors.primary,
    tabBarInactiveTintColor: Colors.gray2,
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          left: 0,
          right: 0,
          bottom: 0,
          height: 60,
          position: "absolute",
          alignContent: "center",
          alignItems: "center",
          paddingVertical: 10,
          paddingBottom: 10,
        },
        tabBarLabelPosition: "below-icon",
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray2,
      }}
    >
      <Tab.Screen
        name={AdminNavigator.NavigatorOverview}
        component={Overview}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <OverviewIcon color={focused ? Colors.primary : Colors.gray2} />
            );
          },
        }}
      />
      <Tab.Screen
        name={AdminNavigator.NavigatorProducts}
        component={Products}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <ProductIcon color={focused ? Colors.primary : Colors.gray2} />
            );
          },
        }}
      />

      <Tab.Screen
        name={AdminNavigator.NavigatorOrders}
        component={Orders}
        options={{
          tabBarIcon: ({ focused }) => {
            return <CartIcon color={focused ? Colors.primary : Colors.gray2} />;
          },
        }}
      />
      <Tab.Screen
        name={AdminNavigator.NavigatorAnalytics}
        component={Analytics}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <AnalyticIcon color={focused ? Colors.primary : Colors.gray2} />
            );
          },
        }}
      />
      <Tab.Screen
        name={AdminNavigator.NavigatorAccounts}
        component={Accounts}
        options={{
          tabBarIcon: ({ focused }) => {
            return <UserIcon color={focused ? Colors.primary : Colors.gray2} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    position: "absolute",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 10,
  },
});

export default BottomNavigationAdmin;
