import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { getAllCart, removeAllCart } from "hooks/asyncStore";
import { ICart, User } from "types/data";
import { MainScreenProps, MainScreens } from "navigation/mainNavigator";
import { useAddOrderMutation } from "redux/features/orders/orderApi";
import { useSelector } from "react-redux";
import Loader from "components/ui/loader";
import { useLoadUserQuery } from "redux/features/api/apiSlice";
import { Colors } from "constants/index";

interface IForm {
  name: string;
  street: string;
  city: string;
  mobile: string;
}

interface IInitialForm {
  data: {
    _id: string;
    customer: string;
    deliveryAddress: {
      name: string;
      city: string;
      street: string;
      mobile: string;
    };
    product: any[]; // Assuming product can be any type of array
    totalPrice: number | null;
  };
}

let initialForm: IInitialForm = {
  data: {
    _id: "",
    customer: "",
    deliveryAddress: {
      name: "",
      city: "",
      street: "",
      mobile: "",
    },
    product: [],
    totalPrice: null,
  },
};

const Main = () => {
  const [errors, setErrors] = useState<Partial<IForm>>({});
  const navigation = useNavigation<MainScreenProps>();
  const [addOrder, { isSuccess, error, data, isLoading }] = useAddOrderMutation(
    {}
  );
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
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
  const [orderForm, setOrderForm] = useState<IInitialForm>(initialForm);
  const { user }: { user: User } = useSelector((state: any) => state.auth);
  const { refetch } = useLoadUserQuery({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data: ICart[] = await getAllCart("Cart");

    await refetch();
    let tp = 0;

    data.forEach((e) => (tp += e.total));

    const products = data.map((e) => ({
      product: e.id,
      price: e.price,
      quantity: e.quantity,
    }));

    setOrderForm((prevForm) => ({
      ...prevForm,
      data: {
        ...prevForm.data,
        product: products,
        totalPrice: tp,
        customer: user._id,
        deliveryAddress: {
          ...prevForm.data.deliveryAddress,
        },
      },
    }));
  };

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Order Placed!";
      ToastAndroid.show(message, ToastAndroid.SHORT);
      removeAllCart("Cart");
      navigation.navigate(MainScreens.StackOrderPlace);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        ToastAndroid.show(errorData.data.message, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Error from Server", ToastAndroid.SHORT);
      }
    }
  }, [isSuccess, error, data?.message]);

  const validateForm = () => {
    let error: Partial<IForm> = {};
    if (orderForm.data.deliveryAddress.name === "") {
      error.name = "Name is required";
    }
    if (orderForm.data.deliveryAddress.street === "") {
      error.street = "Street is required";
    }
    if (orderForm.data.deliveryAddress.city === "") {
      error.city = "City is required";
    }
    if (orderForm.data.deliveryAddress.mobile === "") {
      error.mobile = "Enter Mobile no";
    } else if (orderForm.data.deliveryAddress.mobile.length < 11) {
      error.mobile = "Enter valid Mobile no (03xx-xxxxxxx)";
    }
    setErrors(error);

    return Object.keys(error).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addOrder(orderForm);
      setOrderForm(initialForm);
      setErrors({});
    }
  };

  return (
    <>
      {isLoading || orderForm === undefined ? (
        <Loader />
      ) : (
        <>
          <StatusBar backgroundColor={"white"}></StatusBar>
          <SafeAreaView className="flex-1 bg-white">
            <View className="relative  ">
              {!isKeyboardVisible && <View className="absolute z-20 top-2 flex flex-row items-center w-full px-5 ">
                <TouchableOpacity onPress={() => navigation.goBack()} className="bg-[#264BAE] p-2 rounded-full">
                  <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>
                <Text  style={{ fontFamily: "semiBold" }} className='mx-5 text-lg'>Checkout</Text>
              </View>}
            </View>
            <KeyboardAvoidingView
              behavior="height"
              className="flex-1"
              keyboardVerticalOffset={30}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-grow-1 justify-evenly h-screen px-5">
                  <View className="mt-12">
                    <Text
                      className="text-center text-lg text-gray-500"
                      style={{ fontFamily: "semiBold" }}
                    >
                      Total
                    </Text>
                    {orderForm.data !== undefined && (
                      <Text
                        className="text-center text-2xl"
                        style={{ fontFamily: "bold" }}
                      >{`Rs.${orderForm.data.totalPrice + 200}/-`}</Text>
                    )}
                  </View>
                  <View>
                    <Text
                      className="text-xs text-gray-500 mb-2"
                      style={{ fontFamily: "regular" }}
                    >
                      Name
                    </Text>
                    <TextInput
                      selectionColor={Colors.primary}
                      value={orderForm.data.deliveryAddress.name || ""}
                      onChangeText={(text) =>
                        setOrderForm((prevForm) => ({
                          ...prevForm,
                          data: {
                            ...prevForm.data,
                            deliveryAddress: {
                              ...prevForm.data.deliveryAddress,
                              name: text,
                            },
                          },
                        }))
                      }
                      textContentType="name"
                      placeholder="xyz"
                      className="p-2 bg-[#E9F6FF] rounded"
                    />
                    {errors.name && (
                      <Text className="text-red-500 text-xs">
                        {errors.name}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text
                      className="text-xs text-gray-500 mb-2"
                      style={{ fontFamily: "regular" }}
                    >
                      Address
                    </Text>
                    <TextInput
                      selectionColor={Colors.primary}
                      textContentType="addressCity"
                      value={orderForm.data.deliveryAddress.street || ""}
                      onChangeText={(text) =>
                        setOrderForm((prevForm) => ({
                          ...prevForm,
                          data: {
                            ...prevForm.data,
                            deliveryAddress: {
                              ...prevForm.data.deliveryAddress,
                              street: text,
                            },
                          },
                        }))
                      }
                      placeholder="H no.5 Satellite Town"
                      className="p-2 bg-[#E9F6FF] rounded"
                    ></TextInput>
                    {errors.street && (
                      <Text className="text-red-500 text-xs">
                        {errors.street}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text
                      className="text-xs text-gray-500 mb-2"
                      style={{ fontFamily: "regular" }}
                    >
                      City
                    </Text>
                    <TextInput
                      selectionColor={Colors.primary}
                      textContentType="addressCity"
                      value={orderForm.data.deliveryAddress.city || ""}
                      onChangeText={(text) =>
                        setOrderForm((prevForm) => ({
                          ...prevForm,
                          data: {
                            ...prevForm.data,
                            deliveryAddress: {
                              ...prevForm.data.deliveryAddress,
                              city: text,
                            },
                          },
                        }))
                      }
                      placeholder="Bahawalpur"
                      className="p-2 bg-[#E9F6FF] rounded "
                    ></TextInput>
                    {errors.city && (
                      <Text className="text-red-500 text-xs">
                        {errors.city}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text
                      className="text-xs text-gray-500 mb-2"
                      style={{ fontFamily: "regular" }}
                    >
                      Mobile
                    </Text>
                    <TextInput
                      selectionColor={Colors.primary}
                      keyboardType="phone-pad"
                      textContentType="telephoneNumber"
                      value={orderForm.data.deliveryAddress.mobile || ""}
                      onChangeText={(text) =>
                        setOrderForm((prevForm) => ({
                          ...prevForm,
                          data: {
                            ...prevForm.data,
                            deliveryAddress: {
                              ...prevForm.data.deliveryAddress,
                              mobile: text,
                            },
                          },
                        }))
                      }
                      placeholder="03xx-xxxxxxx"
                      className="p-2 bg-[#E9F6FF] rounded"
                    ></TextInput>
                    {errors.mobile && (
                      <Text className="text-red-500 text-xs">
                        {errors.mobile}
                      </Text>
                    )}
                  </View>
                  <Text className="" style={{ fontFamily: "semiBold" }}>
                    Payment Mode
                  </Text>
                  <View className="flex flex-row gap-2 items-center">
                    <Fontisto
                      name="radio-btn-active"
                      size={15}
                      color="#264BAE"
                    />
                    <Text>Cash on Delivery (COD)</Text>
                  </View>
                  <TouchableOpacity
                    className="bg-[#264BAE] p-2 rounded "
                    onPress={handleSubmit}
                  >
                    <Text
                      className="text-white text-lg text-center p-2"
                      style={{ fontFamily: "semiBold" }}
                    >
                      Checkout
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </>
      )}
    </>
  );
};

export default Main;
