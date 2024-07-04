import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignIn } from "../screens/login"; 
import Signup from "../screens/signup"; 
import { Verification } from "screens/verification";
import Check from "../screens/check";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import ForgotVerification from "screens/forgotVerfication";
import ForgotPassword from "screens/forgotPassword";

const Stack = createNativeStackNavigator();

export enum AuthScreens {
  StackLogin = "Login",
  StackSignup = "Signup",
  StackVerification = "Verification",
  StackCheck = "Check",
  StackForgotVerification = "ForgotVerification",
  StackForgotPassword = "ForgotPassword",
}

export type AuthScreensParams = {
  [AuthScreens.StackLogin]: undefined;
  [AuthScreens.StackSignup]: undefined;
  [AuthScreens.StackVerification]: undefined;
  [AuthScreens.StackCheck]: undefined;
  [AuthScreens.StackForgotVerification]: undefined;
  [AuthScreens.StackForgotPassword]: undefined;
};

export type AuthScreensProps<
  RouteName extends keyof AuthScreensParams = AuthScreens
> = NativeStackNavigationProp<AuthScreensParams, RouteName>;

export type AuthScreensRouteProps<
  RouteName extends keyof AuthScreensParams = AuthScreens
> = RouteProp<AuthScreensParams, RouteName>;

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={AuthScreens.StackLogin}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={AuthScreens.StackLogin} component={SignIn} />
      <Stack.Screen name={AuthScreens.StackSignup} component={Signup} />
      <Stack.Screen
        name={AuthScreens.StackVerification}
        component={Verification}
      />
      <Stack.Screen name={AuthScreens.StackCheck} component={Check} />
      <Stack.Screen
        name={AuthScreens.StackForgotVerification}
        component={ForgotVerification}
      />
      <Stack.Screen
        name={AuthScreens.StackForgotPassword}
        component={ForgotPassword}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
