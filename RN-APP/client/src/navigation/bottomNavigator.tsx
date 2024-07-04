import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { Home, Categories, Account } from "../screens/index";
import { Colors } from "../constants/index";
import React from "react";
import { RouteProp } from "@react-navigation/native";
import { HomeIcon, CategoryIcon, UserIcon } from "components/icons/index";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum BottomNavigator {
  NavigatorHome = "Home",
  NavigatorCategory = "Category",
  NavigatorAccount = "Account",
}

export type BottomNavigatorParams = {
  [BottomNavigator.NavigatorAccount]: undefined;
  [BottomNavigator.NavigatorCategory]: undefined;
  [BottomNavigator.NavigatorHome]: undefined;
};

export type BottomNavigatorProps<
  RouteName extends keyof BottomNavigatorParams = BottomNavigator
> = NativeStackNavigationProp<BottomNavigatorParams, RouteName>;

export type BottomNavigatorRouteProps<
  RouteName extends keyof BottomNavigatorParams = BottomNavigator
> = RouteProp<BottomNavigatorParams, RouteName>;

export type BottomNavigatorNavigationProp<
  RouteName extends keyof BottomNavigatorParams = BottomNavigator
> = BottomTabNavigationProp<BottomNavigatorParams, RouteName>;

const BottomNavigation = () => {
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
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={BottomNavigator.NavigatorHome}
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => {
            return <HomeIcon color={focused ? Colors.primary : Colors.gray2} />;
          },
        }}
      />
      <Tab.Screen
        name={BottomNavigator.NavigatorCategory}
        component={Categories}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <CategoryIcon color={focused ? Colors.primary : Colors.gray2} />
            );
          },
        }}
      />

      <Tab.Screen
        name={BottomNavigator.NavigatorAccount}
        component={Account}
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

export default BottomNavigation;
