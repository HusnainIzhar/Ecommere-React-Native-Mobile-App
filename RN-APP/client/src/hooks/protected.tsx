import { ProtectedRoute } from "./authHook";
import { useNavigation } from "@react-navigation/native";
import React, { FC } from "react";

type ProtectedProps = {
  children: React.ReactNode;
};

export const Protected: FC<ProtectedProps> = ({ children }) => {
  const navigation = useNavigation();
  const isAuthenticated = ProtectedRoute();
  if (isAuthenticated) {
    return children;
  } else {
    navigation.navigate("Login" as never);
  }
};
