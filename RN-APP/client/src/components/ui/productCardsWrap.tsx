import { View, Text } from "react-native";
import React, { FC } from "react";
import { IProducts } from "types/data";
import ProductCard from "./productCard";

type Props = {
  products: IProducts[];
  reloadFn?: () => void;
};
const ProductsWrap: FC<Props> = ({ products, reloadFn }) => {
  return (
    <View className="flex flex-row flex-wrap justify-between">
      {products.length === 0 && (
        <Text
          className="text-xs text-center mt-5"
          style={{ fontFamily: "regular" }}
        >
          No Products Found
        </Text>
      )}
      {products.map((e, i) => (
        <ProductCard key={i} products={e} reloadFn={reloadFn} />
      ))}
    </View>
  );
};

export default ProductsWrap;
