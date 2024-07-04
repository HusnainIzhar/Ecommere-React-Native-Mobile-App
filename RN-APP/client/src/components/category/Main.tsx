import React, { useEffect, Suspense, lazy } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sizes } from "constants/index";
import ProductCardSkeleton from "components/ui/skeletons/productCard-skeleton";
import SearchTop from "components/ui/searchHeader";
import { useSelector } from "react-redux";
import { IProducts } from "types/data";
import ProductsWrap from "components/ui/productCardsWrap";

export default function Main() {
  const [search, setSearch] = React.useState("");

  const allProducts: IProducts[] = useSelector(
    (state: any) => state.allProducts
  );
  const [products, setProducts] = React.useState(allProducts);
  const images = [
    { src: require("../../../assets/categories/az.png"), title: "A to Z" },
    {
      src: require("../../../assets/categories/bc.png"),
      title: "Baby & Mother Care",
    },
    { src: require("../../../assets/categories/med.png"), title: "Medicines" },
    {
      src: require("../../../assets/categories/mul.png"),
      title: "Multi Vitamins",
    },
    {
      src: require("../../../assets/categories/ns.png"),
      title: "Nutritions & Supplements",
    },
    {
      src: require("../../../assets/categories/otc.png"),
      title: "OTC And Health Needs",
    },
    {
      src: require("../../../assets/categories/per.png"),
      title: "Personal Care",
    },
  ];
  const [selected, setSelected] = React.useState("A to Z");
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;

  useEffect(() => {
    if (search !== "") {
      setProducts(
        allProducts.filter((product) =>
          product.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setProducts(allProducts);
      setSelected("A to Z");
    }
  }, [search, allProducts]);

  useEffect(() => {
    if (selected === "A to Z") {
      setProducts(allProducts);
    } else {
      setProducts(
        allProducts.filter(
          (product) => product.category.toLowerCase() === selected.toLowerCase()
        )
      );
    }
  }, [selected, allProducts]);

  return (
    <SafeAreaView className="flex-1 px-1 bg-white">
      <SearchTop noCart search={search} setSearch={setSearch} />
      <View className="flex flex-row overflow-auto min-h-full mt-5">
        <View
          className={`${height > 800 ? "h-[75%]" : "h-[70%]"} ${
            width > Sizes.breakpoint ? "w-[25%]" : "w-[35%]"
          } pt-5 overflow-auto bg-white border border-gray-200 rounded`}
        >
          <Text
            className={` ${
              width > Sizes.breakpoint ? "text-sm" : "text-xs"
            } text-center pb-1`}
            style={{ fontFamily: "regular" }}
          >
            All Categories
          </Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={images}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelected(item.title);
                    setSearch("");
                  }}
                  className={`rounded-md mb-8 p-2  ${
                    item.title === selected
                      ? "border-b-[#264BAE] border-b-4"
                      : "border-b-gray-200 border-b"
                  } flex items-center`}
                >
                  <Suspense
                    fallback={
                      <View
                        className="bg-[#E9F6FF]"
                        style={{ width: 70, height: 70 }}
                      ></View>
                    }
                  >
                    <Image
                      source={item.src}
                      style={{ width: 70, height: 70 }}
                    />
                  </Suspense>

                  <Text className={width > Sizes.breakpoint ? "text-xs" :"text-[10px]"} style={{ fontFamily: "regular" }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          className="flex-1 px-2 overflow-y mb-48"
        >
          <Text
            className={`text-center ${
              width > Sizes.breakpoint ? "text-lg" : "text-xs"
            } mt-5`}
            style={{ fontFamily: "semiBold" }}
          >
            {selected}
          </Text>
          <View className="p-5">
            <Suspense fallback={<ProductCardSkeleton />}>
              <ProductsWrap products={products} />
            </Suspense>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
