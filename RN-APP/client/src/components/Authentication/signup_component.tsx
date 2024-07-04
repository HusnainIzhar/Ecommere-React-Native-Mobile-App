import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Keyboard,
  KeyboardAvoidingView,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sizes } from "constants/index";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ISignup } from "types/data";
import { useRegisterMutation } from "redux/features/auth/authApi";
import { AuthScreens, AuthScreensProps } from "navigation/authNavigator";
import { Colors } from "constants/index";
import Loader from "components/ui/loader";

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  password: "",
};
const SignupComponent = () => {
  const navigation = useNavigation<AuthScreensProps>();
  const [errors, setErrors] = useState<Partial<ISignup>>({});
  const [form, setForm] = useState<Partial<ISignup>>(initialForm);
  const [register, { data, isSuccess, error, isLoading }] =
    useRegisterMutation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "OTP sent on your email !";
      navigation.navigate(AuthScreens.StackVerification);
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
    let error: Partial<ISignup> = {};
    if (form.name === "") {
      error.name = "Name is required";
    }
    if (form.email === "") {
      error.email = "Email is Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(form.email)) {
      error.email = "Email is not valid";
    }
    if (form.password === "") {
      error.password = "Password is required";
    } else if (form.password.length < 8) {
      error.password = "Password must be of 8 characters";
    }
    if (!form.mobile) {
      error.mobile = "Contact number is required";
    } else if (form.mobile.length !== 11) {
      error.mobile = "Please enter a valid 11-digit number";
    }
    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      register(form);
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
            {!isKeyboardVisible && Object.keys(errors).length === 0 && (
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
            )}
            <KeyboardAvoidingView
              className={`flex-1 ${height < 800 && "my-10"}`}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  className={`flex-grow-1 justify-evenly h-screen ${
                    height < 800 && Object.keys(errors).length > 0 && "my-12"
                  }`}
                >
                  {Object.keys(errors).length === 0 && height < 800 && (
                    <>
                      <Text
                        className={`${width > Sizes.breakpoint ? "text-xl" : "text-xs"}`}
                        style={{ fontFamily: "bold" }}
                      >
                        Create a New Account
                      </Text>
                      <Text
                        className={`text-gray-500 ${
                          width > Sizes.breakpoint ? "text-lg" : "text-xs"
                        }`}
                        style={{ fontFamily: "regular" }}
                      >
                        Seize control of your health journey with Pocket Pharma
                      </Text>
                    </>
                  )}
                  {height > 800 && (
                    <>
                      <Text
                        className={`${width > Sizes.breakpoint ? "text-xl" : "text-lg"}`}
                        style={{ fontFamily: "bold" }}
                      >
                        Create a New Account
                      </Text>
                      <Text
                        className={`text-gray-500 ${
                          width > Sizes.breakpoint ? "text-lg" : "text-xs"
                        }`}
                        style={{ fontFamily: "regular" }}
                      >
                        Seize control of your health journey with Pocket Pharma
                      </Text>
                    </>
                  )}

                  <View className="flex justify-between gap-5">
                    <TextInput
                      selectionColor={Colors.primary}
                      className={`rounded-md h-14 border  px-5 ${
                        errors.name ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter your Name"
                      value={form.name}
                      onChangeText={(text) => setForm({ ...form, name: text })}
                    />
                    {errors.name && (
                      <Text
                        className={`text-red-500 ${
                          width > Sizes.breakpoint ? "text-sm" : "text-xs"
                        }`}
                      >
                        {errors.name}
                      </Text>
                    )}
                    <TextInput
                      selectionColor={Colors.primary}
                      className={`rounded-md h-14 border  px-5 ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter your Email"
                      value={form.email}
                      onChangeText={(text) => setForm({ ...form, email: text })}
                    />
                    {errors.email && (
                      <Text
                        className={`text-red-500 ${
                          width > Sizes.breakpoint ? "text-sm" : "text-xs"
                        }`}
                      >
                        {errors.email}
                      </Text>
                    )}
                    <TextInput
                      selectionColor={Colors.primary}
                      textContentType="telephoneNumber"
                      className={`rounded-md h-14 border px-5 ${
                        errors.mobile ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter your Mobile"
                      value={form.mobile}
                      onChangeText={(text) =>
                        setForm({ ...form, mobile: text })
                      }
                    />
                    {errors.mobile && (
                      <Text
                        className={`text-red-500 ${
                          width > Sizes.breakpoint ? "text-sm" : "text-xs"
                        }`}
                      >
                        {errors.mobile}
                      </Text>
                    )}
                    <TextInput
                      selectionColor={Colors.primary}
                      className={`rounded-md h-14 border  px-5 ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Confirm Password"
                      value={form.password}
                      onChangeText={(text) =>
                        setForm({ ...form, password: text })
                      }
                      textContentType="password"
                      secureTextEntry
                    />
                    {errors.password && (
                      <Text
                        className={`text-red-500 ${
                          width > Sizes.breakpoint ? "text-sm" : "text-xs"
                        }`}
                      >
                        {errors.password}
                      </Text>
                    )}
                    <TouchableOpacity className="bg-[#264BAE] p-4 rounded-md">
                      <Text
                        className={`text-white uppercase text-center ${width > Sizes.breakpoint ? "text-xs": "text-[10px]"}`}
                        style={{ fontFamily: "semiBold" }}
                        onPress={handleSubmit}
                      >
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                    <Text
                      className={`text-center ${
                        width > Sizes.breakpoint ? "text-sm" : "text-[10px]"
                      }`}
                      style={{ fontFamily: "semiBold" }}
                    >
                      Or Continue with
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(AuthScreens.StackVerification)
                      }
                      className="flex flex-row justify-center items-center gap-2 p-2 border rounded-md border-gray-200"
                    >
                      <Image
                        style={{ height: 30, width: 30 }}
                        source={require("../../../assets/google.png")}
                      />
                      <Text
                        className={`text-center ${width > Sizes.breakpoint ? "text-xs" : "text-[10px]"}`}
                        style={{ fontFamily: "semiBold" }}
                      >
                        Signin with Google
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <View className="flex flex-row items-center justify-center gap-2 mt-2">
                      <Text
                        className={`${width > Sizes.breakpoint ? "text-sm" : "text-[10px]"}`}
                        style={{ fontFamily: "regular" }}
                      >
                        Already have an account ?
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(AuthScreens.StackLogin)
                        }
                        className=""
                      >
                        <Text
                          className={`${width > Sizes.breakpoint ? "text-sm" : "text-[10px]"}`}
                          style={{ fontFamily: "semiBold" }}
                        >
                          Sign In
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

export default SignupComponent;
