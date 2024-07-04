import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, Text, useWindowDimensions } from "react-native";
import { useEffect, useState, useCallback, Suspense, lazy } from "react";
import SearchTop from "components/ui/searchHeader";
import CategoryHeading from "./categoryheading";
import ProductCardSkeleton from "../ui/skeletons/productCard-skeleton";
import { getAllCart } from "hooks/asyncStore";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import CarousalSkeleton from "../ui/skeletons/slider-skeleton";
import ProductsWrap from "components/ui/productCardsWrap";
import Carousal from "./carousal";
import { useGetAllProductsQuery } from "redux/features/product/productApi";
import { IProducts } from "types/data";
import {Sizes} from "../../constants/index"

export default function Main() {
  const [cartTotal, setCartTotal] = useState(0);
  const allProducts: IProducts[] = useSelector(
    (state: any) => state.allProducts
  );
  const { refetch } = useGetAllProductsQuery({});

  const slides = [
    require("../../../assets/1.png"),
    require("../../../assets/2.png"),
    require("../../../assets/3.png"),
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      refetch();
      return () => {};
    }, [])
  );
  const width = useWindowDimensions().width;

  const fetchData = async () => {
    const data = await getAllCart("Cart");
    setCartTotal(data.length);
  };
  return (
    <>
      <SafeAreaView>
        <View className="px-5 bg-white h-screen">
          <SearchTop cartTotal={cartTotal} home />
          <ScrollView
            className="mt-5 mb-16 flex-1"
            showsVerticalScrollIndicator={false}
          >
            <View className="rounded-md overflow-hidden">
              <Suspense fallback={<CarousalSkeleton />}>
                <Carousal slides={slides} />
              </Suspense>
            </View>
            {/* <CategoryHeading tags={["medicine", "fever", "pain"]} /> */}
            <Text
              style={{ fontFamily: "semiBold" }}
              className={`mt-5 ${width > Sizes.breakpoint ? "text-lg" : "text-xs"}`}
            >
              Featured Products
            </Text>
            <Suspense fallback={<ProductCardSkeleton />}>
              <ProductsWrap
                reloadFn={fetchData}
                products={allProducts
                  .filter((e) => e.sold > 10)
                  .sort((a, b) => b.sold - a.sold)
                  .slice(0, 12)}
              />
            </Suspense>
            {/* <CategoryHeading tags={["medicine", "fever", "pain"]} /> */}
            <Text
              style={{ fontFamily: "semiBold" }}
              className={`mt-5 ${width > Sizes.breakpoint ? "text-lg" : "text-xs"}`}
            >
              All Products
            </Text>
            <Suspense fallback={<ProductCardSkeleton />}>
              <ProductsWrap reloadFn={fetchData} products={allProducts} />
            </Suspense>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}
