import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  KeyboardAvoidingView,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCheckMutation } from "redux/features/auth/authApi";
import { AuthScreens, AuthScreensProps } from "navigation/authNavigator";
import { Colors } from "constants/index";
import Loader from "components/ui/loader";
import { Sizes } from "constants/index";

const CheckComponent = () => {
  const navigation = useNavigation<AuthScreensProps>();
  const [errors, setErrors] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [check, { isSuccess, error, data, isLoading }] = useCheckMutation();

  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate(AuthScreens.StackForgotVerification);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        ToastAndroid.show(errorData.data.message, ToastAndroid.SHORT);
        navigation.navigate(AuthScreens.StackSignup);
      }
    }
  }, [isSuccess, error, data?.message]);

  const validateForm = () => {
    if (email === "") {
      setErrors("Email is Required");
      return false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setErrors("Email is not valid");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await check({ email });
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
            <View className="bg-white absolute  top-0 py-2 w-full">
              <View className=" flex flex-row items-center w-full p-2 ">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className=""
                >
                  <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <KeyboardAvoidingView
              className={`flex-1 ${height < 800 && "my-10"}`}
            >
              <View
                className={`flex-grow-1 justify-center h-screen gap-2 ${
                  height < 800 && Object.keys(errors).length > 0 && "my-12"
                }`}
              >
                <Text className={width> Sizes.breakpoint ? "text-lg" : "text-xs"} style={{ fontFamily: "semiBold" }}>
                  Verify your email
                </Text>
                <TextInput
                cursorColor={Colors.primary}
                  selectionColor={Colors.primary}
                  className={`rounded-md h-14 border  px-5 ${
                    errors !== "" ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                {errors !== "" && (
                  <Text
                    className={`text-red-500 ${
                      width > Sizes.breakpoint ? "text-sm" : "text-[10px]"
                    }`}
                  >
                    {errors}
                  </Text>
                )}

                <TouchableOpacity className="bg-[#264BAE] p-4 rounded-md">
                  <Text
                    className={`text-white uppercase text-center ${width< Sizes.breakpoint && "text-[10px]"}`}
                    style={{ fontFamily: "semiBold" }}
                    onPress={handleSubmit}
                  >
                    Verify
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </>
      )}
    </>
  );
};

export default CheckComponent;
