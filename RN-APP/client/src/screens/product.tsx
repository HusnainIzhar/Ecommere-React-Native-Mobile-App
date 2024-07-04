import React, { Suspense, lazy } from "react";
import Main from "../components/product/Main"
import { useRoute } from "@react-navigation/native";
import { MainScreens, MainScreensRouteProps } from "navigation/mainNavigator";
import ProductSkeleton from "../components/ui/skeletons/product-skeleton";

export const Product = () => {
  const id = useRoute<MainScreensRouteProps<MainScreens.StackProduct>>();
  return (
    <>
      <Suspense fallback={<ProductSkeleton />}>
        <Main id={id.params.param} />
      </Suspense>
    </>
  );
};
