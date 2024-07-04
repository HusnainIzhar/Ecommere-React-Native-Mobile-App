import {
  View,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { IForm, IProducts } from "types/data";
import { DropDown } from "components/ui/dropDown";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "constants/index";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "redux/features/product/productApi";
import * as ImagePicker from "expo-image-picker";
import { convertImageToDataUri } from "utils/imageURI";
import Loader from "components/ui/loader";
import { useGetAllProductsQuery } from "redux/features/product/productApi";
import { useSelector } from "react-redux";
import {
  AdminNavigator,
  AdminNavigatorProps,
} from "navigation/bottomNavigatorAdmin";

const initialForm: IForm = {
  title: "",
  description: "",
  category: "",
  price: null,
  image: "",
  stockQuantity: null,
  manufacturer: "",
  ingredients: "",
  strength: "",
  dosageForm: "",
  directions: "",
  warnings: "",
  storageCondition: "",
  shelfLife: "",
};
type Props = {
  id?: string;
};
export const AddProductAdmin: React.FC<Props> = ({ id }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<IForm>>({});
  const navigation = useNavigation<AdminNavigatorProps>();
  const [
    updateProduct,
    {
      data: updateData,
      isSuccess: updateSuccess,
      error: updateError,
      isLoading: updateLoading,
    },
  ] = useUpdateProductMutation({});
  const allProducts: IProducts[] = useSelector(
    (state: any) => state.allProducts
  );
  const [addProduct, { data, isSuccess, error, isLoading }] =
    useAddProductMutation();
  const { refetch } = useGetAllProductsQuery({});

  useEffect(() => {
    if (id) {
      const data = allProducts.find((e) => e._id === id);
      console.log("EEE", data);
      if (data) {
        setForm({
          title: data.title,
          description: data.description,
          category: data.category,
          price: data.price,
          image: data.image?.url,
          stockQuantity: data.stockQuantity,
          manufacturer: data.manufacturer || "",
          ingredients: data.ingredients || "",
          strength: data.strength || "",
          dosageForm: data.dosageForm || "",
          directions: data.directions || "",
          warnings: data.warnings || "",
          storageCondition: data.storageCondition || "",
          shelfLife: data.shelfLife || "",
        });
        console.log("form is ", form);
      }
    }
  }, [id, allProducts]);

  useEffect(() => {
    if (isSuccess || updateSuccess) {
      const message = data?.message || "Product Added!";
      refetch();
      ToastAndroid.show(message, ToastAndroid.SHORT);
      navigation.navigate(AdminNavigator.NavigatorProducts);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        ToastAndroid.show(errorData.data.message, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Error from Server", ToastAndroid.SHORT);
      }
    }
    if (updateError) {
      if ("data" in updateError) {
        const errorData = updateError as any;
        ToastAndroid.show(errorData.data.message, ToastAndroid.SHORT);
      }
    }
  }, [
    isSuccess,
    error,
    data?.message,
    updateData?.message,
    updateSuccess,
    updateError,
  ]);

  const validateForm = () => {
    let error: Partial<IForm> = {};

    if (form.title === "") {
      error.title = "Title is required";
    }
    if (form.description === "") {
      error.description = "Description is required";
    }
    if (form.category === "") {
      error.category = "Category is required";
    }
    if (form.price === null || form.price === 0) {
      error.price = "Price can't be 0";
    }
    if (form.image === "") {
      error.image = "Image is required";
    }
    if (form.stockQuantity === null || form.stockQuantity === 0) {
      error.stockQuantity = "Stock Quantity can't be 0";
    }

    setErrors(error);

    return Object.keys(error).length === 0;
  };
  const handleSubmit = () => {
    if (validateForm()) {
      if (id) {
        updateProduct({ form: form, id: id });
        // console.log(allData,form,id)
      }
      if (!id) {
        addProduct({  form });
      }
      setForm(initialForm);
      setErrors({});
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const img = await convertImageToDataUri(result.assets[0].uri);
      setForm((prevForm) => ({ ...prevForm, image: img }));
    }
  };

  const handleCategory = (category) => {
    setForm((prevForm) => ({ ...prevForm, category: category }));
  };
  return (
    <>
      {isLoading || updateLoading ? (
        <Loader />
      ) : (
        <>
          <StatusBar barStyle="dark-content" backgroundColor={"transparent"} />
          <SafeAreaView className="flex-1">
            <View className="bg-white absolute z-20 top-0 py-2 w-full">
              <View className=" flex flex-row items-center w-full px-5 ">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="bg-[#264BAE] p-2 rounded-full"
                >
                  <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>
                <Text
                  style={{ fontFamily: "semiBold" }}
                  className="mx-5"
                >
                  Add Product
                </Text>
              </View>
            </View>
            <View className="flex-1 px-2 mt-10 bg-white">
              <KeyboardAvoidingView
                behavior="height"
                className="flex-1 py-5"
                keyboardVerticalOffset={30}
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View className="px-4 flex gap-4">
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Product title
                      </Text>
                      <TextInput
                      cursorColor={Colors.primary}
                        value={form.title}
                        placeholderTextColor={Colors.gray2}
                        onChangeText={(text) =>
                          setForm((prevForm) => ({ ...prevForm, title: text }))
                        }
                        textContentType="name"
                        placeholder="xyz"
                        className={`px-2 bg-[#E9F6FF] rounded h-10 ${
                          errors.title && "border-red-500 border"
                        }`}
                      />
                      {errors.title && (
                        <Text className="text-red-500 text-xs">
                          {errors.title}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Description
                      </Text>
                      <TextInput
                       cursorColor={Colors.primary}
                        textContentType="name"
                        multiline
                        style={{ textAlignVertical: "top" }}
                        placeholderTextColor={Colors.gray2}
                        value={form.description}
                        onChangeText={(text) =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            description: text,
                          }))
                        }
                        placeholder="Useful for ..."
                        className={`p-2 bg-[#E9F6FF] rounded h-20 ${
                          errors.description && "border-red-500 border"
                        }`}
                      ></TextInput>
                      {errors.description && (
                        <Text className="text-red-500 text-xs">
                          {errors.description}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Category
                      </Text>
                      <DropDown
                        errors={errors}
                        data={[
                          "Baby & Mother Care",
                          "Medicines",
                          "Multi Vitamins",
                          "Nutritions & Supplements",
                          "OTC and Health Needs",
                          "Personal Care",
                        ]}
                        setData={handleCategory}
                        value={form.category}
                      />
                      {errors.category && (
                        <Text className="text-red-500 text-xs">
                          {errors.category}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Price
                      </Text>
                      <TextInput
                       cursorColor={Colors.primary}
                        keyboardType="phone-pad"
                        placeholderTextColor={Colors.gray2}
                        textContentType="telephoneNumber"
                        value={form.price === null ? "" : form.price.toString()}
                        onChangeText={(text) => {
                          if (text === "") {
                            setForm((prevForm) => ({
                              ...prevForm,
                              price: null,
                            }));
                          } else if (!isNaN(Number(text))) {
                            setForm((prevForm) => ({
                              ...prevForm,
                              price: parseInt(text),
                            }));
                          }
                        }}
                        placeholder="9500/-"
                        className={`px-2 bg-[#E9F6FF] rounded h-10  ${
                          errors.price && "border-red-500 border"
                        }`}
                      ></TextInput>
                      {errors.price && (
                        <Text className="text-red-500 text-xs">
                          {errors.price}
                        </Text>
                      )}
                    </View>
                    <Text
                      className="text-xs text-gray-500 mb-2"
                      style={{ fontFamily: "regular" }}
                    >
                      Image
                    </Text>
                    <TouchableOpacity
                      style={{
                        borderStyle: "dashed",
                        borderWidth: 1,
                        borderColor: errors.image ? "#EF4444" : Colors.gray,
                      }}
                      className={` rounded-md p-2 flex flex-row items-center justify-center`}
                      onPress={() => pickImage()}
                    >
                      <View className="flex items-center gap-1">
                        <Ionicons
                          name="cloud-upload-outline"
                          size={24}
                          color={Colors.gray}
                        />
                        <Text
                          style={{ fontFamily: "regular", color: Colors.gray }}
                        >
                          Upload Single Image
                        </Text>
                        <Text
                          style={{ fontFamily: "regular", color: Colors.gray }}
                        >
                          Upto 1 MB
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {errors.image && (
                      <Text className="text-red-500 text-xs">
                        {errors.image}
                      </Text>
                    )}
                    {form.image && (
                      <View className="relative w-[100px]">
                        <TouchableOpacity
                          onPress={() =>
                            setForm((prevForm) => ({ ...prevForm, image: "" }))
                          }
                          className="z-30 absolute top-1 right-2 p-1 bg-white/50 rounded-full"
                        >
                          <Entypo name="cross" size={15} color="black" />
                        </TouchableOpacity>
                        <Image
                          source={{ uri: form.image }}
                          style={{ height: 100, width: 100 }}
                          className="rounded-md"
                        />
                      </View>
                    )}
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Stock Quantity
                      </Text>
                      <TextInput
                       cursorColor={Colors.primary}
                        placeholderTextColor={Colors.gray2}
                        value={
                          form.stockQuantity === null
                            ? ""
                            : form.stockQuantity.toString()
                        }
                        onChangeText={(text) => {
                          if (text === "") {
                            setForm((prevForm) => ({
                              ...prevForm,
                              stockQuantity: null,
                            }));
                          } else if (!isNaN(Number(text))) {
                            setForm((prevForm) => ({
                              ...prevForm,
                              stockQuantity: parseInt(text),
                            }));
                          }
                        }}
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        placeholder="450"
                        className={`px-2 bg-[#E9F6FF] rounded h-10 ${
                          errors.stockQuantity && "border-red-500 border"
                        }`}
                      />
                      {errors.stockQuantity && (
                        <Text className="text-red-500 text-xs">
                          {errors.stockQuantity}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Manufacturer
                      </Text>
                      <TextInput
                       cursorColor={Colors.primary}
                        placeholderTextColor={Colors.gray2}
                        value={form.manufacturer}
                        onChangeText={(text) =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            manufacturer: text,
                          }))
                        }
                        textContentType="name"
                        placeholder="Pfizer Inc."
                        className="px-2 bg-[#E9F6FF] rounded h-10"
                      />
                    </View>
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Ingredients
                      </Text>
                      <TextInput
                       cursorColor={Colors.primary}
                        placeholderTextColor={Colors.gray2}
                        value={form.ingredients}
                        onChangeText={(text) =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            ingredients: text,
                          }))
                        }
                        textContentType="name"
                        placeholder="amoxicillin, aspirin, cetirizine"
                        className="px-2 bg-[#E9F6FF] h-10 rounded"
                      />
                    </View>
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Strenght
                      </Text>
                      <TextInput
                       cursorColor={Colors.primary}
                        placeholderTextColor={Colors.gray2}
                        value={form.strength}
                        onChangeText={(text) =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            strength: text,
                          }))
                        }
                        textContentType="name"
                        placeholder="40 mg"
                        className="px-2 bg-[#E9F6FF] rounded h-10"
                      />
                    </View>
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Dosage Form
                      </Text>
                      <TextInput
                       cursorColor={Colors.primary}
                        placeholderTextColor={Colors.gray2}
                        value={form.dosageForm}
                        onChangeText={(text) =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            dosageForm: text,
                          }))
                        }
                        textContentType="name"
                        placeholder="Syrup"
                        className="px-2 bg-[#E9F6FF] rounded h-10"
                      />
                    </View>
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Directions
                      </Text>
                      <TextInput
                       cursorColor={Colors.primary}
                        placeholderTextColor={Colors.gray2}
                        value={form.directions}
                        onChangeText={(text) =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            directions: text,
                          }))
                        }
                        textContentType="name"
                        placeholder="External Use Only"
                        className="px-2 bg-[#E9F6FF] rounded h-10"
                      />
                    </View>
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Warnings
                      </Text>
                      <TextInput
                       cursorColor={Colors.primary}
                        placeholderTextColor={Colors.gray2}
                        value={form.warnings}
                        onChangeText={(text) =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            warnings: text,
                          }))
                        }
                        textContentType="name"
                        placeholder="Dizziness may occur"
                        className="px-2 bg-[#E9F6FF] rounded h-10"
                      />
                    </View>
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Storage Condition
                      </Text>
                      <TextInput
                       cursorColor={Colors.primary}
                        placeholderTextColor={Colors.gray2}
                        value={form.storageCondition}
                        onChangeText={(text) =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            storageCondition: text,
                          }))
                        }
                        textContentType="name"
                        placeholder="Cool and Dry Place"
                        className="px-2 bg-[#E9F6FF] rounded h-10"
                      />
                    </View>
                    <View>
                      <Text
                        className="text-xs text-gray-500 mb-2"
                        style={{ fontFamily: "regular" }}
                      >
                        Shelf Life
                      </Text>
                      <TextInput
                       cursorColor={Colors.primary}
                        placeholderTextColor={Colors.gray2}
                        value={form.shelfLife}
                        onChangeText={(text) =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            shelfLife: text,
                          }))
                        }
                        textContentType="name"
                        placeholder="1 year"
                        className="px-2 bg-[#E9F6FF] rounded h-10"
                      />
                    </View>
                    <TouchableOpacity
                      className="bg-[#264BAE] p-3 rounded "
                      onPress={handleSubmit}
                    >
                      <Text
                        className="text-white text-center"
                        style={{ fontFamily: "semiBold" }}
                      >
                        {id ? "Update" : "Submit"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
};
