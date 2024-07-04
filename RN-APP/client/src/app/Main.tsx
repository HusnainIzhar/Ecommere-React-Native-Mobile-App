import React, { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AuthNavigator from "navigation/authNavigator";
import AdminNavigator from "navigation/adminNavigator";
import { LogBox} from "react-native";
import Provider from "../redux/provider";
import { useSelector } from "react-redux";
import { useLoadUserQuery } from "redux/features/api/apiSlice";
import Loader from "../components/ui/loader";
import MainNavigator from "navigation/mainNavigator";
import { useGetAllProductsQuery } from "redux/features/product/productApi";
import { useTokens } from "hooks/tokens";

LogBox.ignoreAllLogs();

function App() {
  return (
    <Provider>
      <AppStack />
    </Provider>
  );
}

const AppStack = () => {
  const [fontLoaded] = useFonts({
    regular: require("../../assets/fonts/Poppins-Regular.ttf"),
    bold: require("../../assets/fonts/Poppins-Bold.ttf"),
    extraBold: require("../../assets/fonts/Poppins-ExtraBold.ttf"),
    light: require("../../assets/fonts/Poppins-Light.ttf"),
    medium: require("../../assets/fonts/Poppins-Medium.ttf"),
    semiBold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
  });
  const { accessToken, refreshToken } = useTokens();
  const { user } = useSelector((state: any) => state.auth);
  const { isLoading } = useLoadUserQuery({ accessToken, refreshToken });
  const { isLoading: updateProducts } = useGetAllProductsQuery({});

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!fontLoaded) {
    return null;
  }

  const isAuthenticated = user;

  return (
    <>
      {isLoading && updateProducts ? (
        <Loader />
      ) : (
        <NavigationContainer>
          {isAuthenticated.accountType === "Admin" ? (
            <AdminNavigator />
          ) : isAuthenticated.accountType === "User" ? (
            <MainNavigator />
          ) : (
            <AuthNavigator />
          )}
        </NavigationContainer>
      )}
    </>
  );
};

export default App;
