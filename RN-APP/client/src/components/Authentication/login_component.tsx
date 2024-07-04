import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ILogin } from "types/data";
import {
  useLoginMutation,
  useSocialAuthMutation,
} from "redux/features/auth/authApi";
import { AuthScreens, AuthScreensProps } from "navigation/authNavigator";
import { Colors, Sizes } from "constants/index";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Loader from "components/ui/loader";

const initialForm = {
  email: "",
  password: "",
};

const LoginComponent = () => {
  const navigation = useNavigation<AuthScreensProps>();
  const [form, setForm] = React.useState<Partial<ILogin>>(initialForm);
  const [errors, setErrors] = React.useState<Partial<ILogin>>({});
  const [login, { isSuccess, error, data, isLoading }] = useLoginMutation();
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  WebBrowser.maybeCompleteAuthSession();
  const [userInfo, setUserInfo] = useState(null);

  const config = {
    androidClientId:
      "667080398782-slft513btg67qs4lv93a70g4424v4p5v.apps.googleusercontent.com",
    webClientId:
      "667080398782-719hveqrniblhjvau4dresqq6h63rpgr.apps.googleusercontent.com",
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      console.error("Failed to fetch user data:");
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (response?.type === "success") {
        getUserInfo(response.authentication.accessToken);
      } else {
        await promptAsync();
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  //add it to a useEffect with response as a dependency
  useEffect(() => {
    if (response?.type === "success") {
      getUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  //log the userInfo to see user details
  console.log(JSON.stringify(userInfo));

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Logged in !";
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        ToastAndroid.show(errorData.data.message, ToastAndroid.SHORT);
      }
    }
  }, [isSuccess, error, data?.message]);

  const validateForm = () => {
    let error: Partial<ILogin> = {};

    if (form.email === "") {
      error.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(form.email)) {
      error.email = "Invalid email address";
    }

    if (form.password === "") {
      error.password = "Password is required";
    }

    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await login(form);
      setForm(initialForm);
      setErrors({});
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <SafeAreaView className="flex-1 px-5 bg-white">
            <StatusBar hidden />
            <KeyboardAvoidingView className="flex-1">
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  className={`flex-grow-1 justify-evenly h-screen ${height < 800 && Object.keys(errors).length > 0 && "my-12"
                    }`}
                >
                  <View>
                    <Text
                      className={`${width > Sizes.breakpoint ? "text-xl" : "text-xs"}`}
                      style={{ fontFamily: "bold" }}
                    >
                      Welcome!
                    </Text>
                    <Text
                      className={`text-gray-500 mt-5 ${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"
                        }`}
                      style={{ fontFamily: "regular" }}
                    >
                      Unlock a healthier future with Pocket Pharma{" "}
                    </Text>
                  </View>
                  <View className="flex justify-between gap-5">
                    <TextInput
                      selectionColor={Colors.primary}
                      className={`rounded-md h-14 border  px-5 ${errors.email ? "border-red-500" : "border-gray-200"
                        }`}
                      placeholder="Enter your email"
                      value={form.email}
                      textContentType="emailAddress"
                      onChangeText={(text) =>
                        setForm({ ...form, email: text.trim() })
                      }
                      autoComplete="off"
                      autoCorrect={false}
                    />
                    {errors.email && (
                      <Text
                        className={`text-red-500 ${width > Sizes.breakpoint ? "text-sm" : "text-xs"
                          }`}
                      >
                        {errors.email}
                      </Text>
                    )}
                    <TextInput
                      selectionColor={Colors.primary}
                      className={`rounded-md h-14 border  px-5 ${errors.password ? "border-red-500" : "border-gray-200"
                        }`}
                      placeholder="Confirm password"
                      textContentType="password"
                      secureTextEntry
                      value={form.password}
                      autoComplete="off"
                      autoCorrect={false}
                      onChangeText={(text) =>
                        setForm({ ...form, password: text.trim() })
                      }
                    />
                    {errors.password && (
                      <Text className="text-red-500 text-xs">
                        {errors.password}
                      </Text>
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate(AuthScreens.StackCheck);
                      }}
                    >
                      <Text
                        className={`text-right ${width > Sizes.breakpoint ? "text-sm" : "text-[10px]"
                          } `}
                        style={{ fontFamily: "semiBold" }}
                      >
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-[#264BAE] p-4 rounded-md"
                      onPress={handleSubmit}
                    >
                      <Text
                        className={`text-white uppercase text-center ${width < Sizes.breakpoint && "text-xs"}`}
                        style={{ fontFamily: "semiBold" }}
                      >
                        Sign In
                      </Text>
                    </TouchableOpacity>
                    <Text
                      className={`text-center ${width > Sizes.breakpoint ? "text-sm" : "text-[10px]"
                        }`}
                      style={{ fontFamily: "semiBold" }}
                    >
                      Or Continue with
                    </Text>
                    <TouchableOpacity
                      className="flex flex-row justify-center items-center gap-2 p-2 border rounded-md border-gray-200"
                      onPress={signInWithGoogle}
                    >
                      <Image
                        style={{ height: 30, width: 30 }}
                        source={require("../../../assets/google.png")}
                      />
                      <Text
                        className={`text-center ${width < Sizes.breakpoint && "text-xs"}`}
                        style={{ fontFamily: "semiBold" }}
                      >
                        Signin with Google
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <View className="flex flex-row items-center justify-center gap-2">
                      <Text
                        style={{ fontFamily: "regular" }}
                        className={`${width > Sizes.breakpoint ? "text-sm" : "text-[10px]"}`}
                      >
                        Don't have an account ?
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(AuthScreens.StackSignup)
                        }
                        className=""
                      >
                        <Text
                          className={`${width > Sizes.breakpoint ? "text-sm" : "text-[10px]"}`}
                          style={{ fontFamily: "bold" }}
                        >
                          Sign Up
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </>
      )}
    </>
  );
};

export default LoginComponent;
