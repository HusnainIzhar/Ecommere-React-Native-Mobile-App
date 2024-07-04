import React, { FC } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { storeData } from "../../hooks/asyncStore";
import { IProducts } from "types/data";
import { MainScreenProps, MainScreens } from "navigation/mainNavigator";
import { Colors ,Sizes} from "constants/index";

type Props = {
  products: IProducts;
  reloadFn?: () => void;
};

const ProductCard: FC<Props> = ({ products, reloadFn }) => {
  const navigation = useNavigation<MainScreenProps>();
  const width = useWindowDimensions().width;
  return (
    <>
      <TouchableOpacity
        className={`relative ${width > Sizes.breakpoint ? "w-[120px] h-[160px]" : "w-[90px] h-[140px]"
          }   rounded-md mt-5 bg-[#E9F6FF]`}
        onPress={() =>
          navigation.push(MainScreens.StackProduct, { param: products._id })
        }
      >
        <View
          className={`flex-1 ${width > Sizes.breakpoint ? "w-[108px]" : "w-[77px]"
            }  rounded-md overflow-hidden ml-[6px] mt-[6px]`}
        >
          <Image
            source={{ uri: products.image.url }}
            style={{ aspectRatio: 1, resizeMode: "cover" }}
            className="rounded-md overflow-hidden"
          />
        </View>
        <View className=" flex-1 flex justify-center mx-2">
          <Text
            numberOfLines={1}
            style={{ fontFamily: "semiBold" }}
            className={`${width > Sizes.breakpoint ? "" : "text-[10px]"} mt-1`}
          >
            {products.title}
          </Text>
          <Text
            numberOfLines={1}
            style={{ fontFamily: "regular" }}
            className={`${width > Sizes.breakpoint ? "text-xs" : "text-[8px]"
              } text-gray-500`}
          >
            {products.category}
          </Text>
          <Text
            numberOfLines={1}
            style={{ fontFamily: "semiBold" }}
            className={`${width > Sizes.breakpoint ? "text-sm" : "text-[8px]"}`}
          >{`Rs.${products.price}`}</Text>
        </View>
        {products.stockQuantity > 0 && (
          <TouchableOpacity
            className="absolute bottom-1.5 right-2"
            onPress={() => {
              storeData(`Cart_${products._id}`, {
                title: products.title,
                image: products.image.url,
                quantity: 1,
                category: products.category,
                price: products.price,
                id: products._id,
                total: products.price,
              });
              reloadFn && reloadFn();
            }}
          >
            <Entypo
              name="circle-with-plus"
              size={width > 500 ? 24 : 20}
              color={Colors.primary}
            />
          </TouchableOpacity>
        )}

      </TouchableOpacity>
    </>
  );
};

export default ProductCard;
