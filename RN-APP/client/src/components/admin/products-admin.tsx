import {
  View,
  Text,
  StatusBar,
  TextInput,
  FlatList,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState, FC, useCallback } from "react";
import { IProducts } from "types/data";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDeleteProductMutation } from "redux/features/product/productApi";
import { useGetAllProductsQuery } from "redux/features/product/productApi";
import { AdminScreens, AdminScreensProps } from "navigation/adminNavigator";
import { Colors ,Sizes} from "constants/index";

export const ProductsAdmin = () => {
  const navigation = useNavigation<AdminScreensProps<AdminScreens>>();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Partial<IProducts[]>>([]);
  const [delProduct, { isSuccess, error, data, isLoading }] =
    useDeleteProductMutation();

  const {
    refetch,
    isLoading: isLoadingProducts,
    data: allProducts,
  } = useGetAllProductsQuery({});
  const width = useWindowDimensions().width;

  useEffect(() => {
    if (allProducts) {
      let filteredProducts = allProducts.products;

      if (search !== "") {
        filteredProducts = allProducts.products.filter((product) =>
          product.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      setProducts(filteredProducts);
    }
  }, [allProducts, search]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Product Removed!";
      ToastAndroid.show(message, ToastAndroid.SHORT);
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        ToastAndroid.show(errorData.data.message, ToastAndroid.SHORT);
      }
    }
  }, [isSuccess, error, data?.message]);

  const handleRemove = async (id: string) => {
    const updatedData = { id: id };
    await delProduct(updatedData);
  };

  const deleteProduct = (id: string) => {
    Alert.alert(
      "Are you Sure ?",
      "This will remove the product from the list.",
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Product Not Removed"),
          style: "destructive",
        },
        { text: "delete", onPress: () => handleRemove(id) },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-3">
      <StatusBar barStyle="dark-content" backgroundColor={"transparent"} />
      <View className="flex gap-5 justify-around">
        <View className="flex flex-row justify-between items-center px-5">
          <Text className={width > Sizes.breakpoint ? "text-lg" : "text-md"} style={{ fontFamily: "semiBold" }}>
            Product List
          </Text>
          <FontAwesome
            onPress={() => navigation.navigate(AdminScreens.StackAddProduct)}
            name="plus-square-o"
            size={width > Sizes.breakpoint ? 24 : 20}
            color="black"
          />
        </View>
        <View className="relative px-3 bg-[#E9F6FF] rounded-xl flex flex-row items-center justify-between gap-2">
          {search !== "" && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              className="absolute right-5 z-30 bg-white p-1 rounded-full"
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          )}
          <Ionicons name="search-outline" size={24} color="black" />
          <TextInput
            value={search}
            onChangeText={(text) => setSearch(text)}
            placeholder="Search"
            className="w-full h-10"
            cursorColor={Colors.primary}
          />
        </View>
        {allProducts && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={products}
            renderItem={({ item }) => (
              <View className="flex flex-row py-5 border-b border-gray-200 items-center">
                <View className="w-[15%] ">
                  {item.image && (
                    <Image
                      style={{ height: 50, width: 50, borderRadius: 3 }}
                      source={{ uri: item.image.url }}
                    />
                  )}
                </View>
                <View className="flex items-start ml-2">
                  <Text
                    className={width > Sizes.breakpoint ? "text-sm" :"text-[12px]"}
                    style={{ fontFamily: "semiBold" }}
                  >
                    {item.title}
                  </Text>
                  <View className="flex flex-row gap-2 items-center">
                    <Text
                      style={{ fontFamily: "semiBold" }}
                      className="text-[10px] text-gray-500"
                    >{`Rs.${item.price}`}</Text>
                    <View className="h-1 w-1 rounded-full bg-gray-500"></View>
                    <Text
                      style={{ fontFamily: "semiBold" }}
                      className={`text-[10px]  ${
                        item.stockQuantity < 5
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >{`${item.stockQuantity} in stock`}</Text>
                  </View>
                </View>
                <View className="w-[30%] flex flex-row justify-end gap-4 flex-1">
                  <Feather
                    onPress={() =>
                      navigation.navigate(AdminScreens.StackEditProduct, {
                        param: item._id,
                      })
                    }
                    name="edit"
                    size={width > Sizes.breakpoint ? 24 : 20}
                    color="black"
                  />
                  <AntDesign
                    onPress={() => deleteProduct(item._id)}
                    name="delete"
                    size={width > Sizes.breakpoint ? 24 : 20}
                    color="black"
                  />
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
