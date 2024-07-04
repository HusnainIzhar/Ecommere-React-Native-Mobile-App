import React, { FC } from "react";
import { FlatList } from "react-native";
import { IProducts } from "types/data";
import ProductCard from "./productCard";

type Props = {
  products: IProducts[];
};

const ProductCarousal: FC<Props> = ({ products }) => {
  return (
    <>
      <FlatList
        data={products}
        horizontal
        renderItem={({ item }) => <ProductCard products={item} />}
      />
    </>
  );
};

export default ProductCarousal;
