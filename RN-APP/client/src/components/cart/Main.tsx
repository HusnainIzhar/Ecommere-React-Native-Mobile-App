import { View, TouchableOpacity, Image, Text, FlatList, StatusBar ,useWindowDimensions} from 'react-native'
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { ICart } from 'types/data';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteCart, getAllCart, storeData } from "../../hooks/asyncStore";
import { MainScreenProps, MainScreens } from 'navigation/mainNavigator';
import { Sizes } from 'constants/index';

const Main = () => {
    const [cartData, setCartData] = useState([] as ICart[]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigation = useNavigation<MainScreenProps>();
    const width = useWindowDimensions().width;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const data = await getAllCart("Cart");
        setCartData(data);
    };

    useEffect(() => {
        let total = 0;
        const totalCart = () => {
            cartData.forEach((e) => {
                total += e.total
            })
        };
        totalCart();
        setTotalPrice(total);

    }, [cartData])




    return (
        <>
            <StatusBar backgroundColor={"white"}></StatusBar>
            <SafeAreaView className='flex-1'>
                <View className='relative flex-1 bg-white'>
                    <View className="absolute z-20 top-2 flex flex-row items-center w-full px-5 ">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-[#264BAE] p-2 rounded-full">
                            <Ionicons name="chevron-back" size={20} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: "semiBold" }} className={`mx-5 ${width > Sizes.breakpoint ? "text-lg" : "text-xs"}`}>My Cart</Text>
                    </View>
                    {cartData.length === 0 &&
                        <View className='flex-1 flex flex-row items-center justify-center'>
                            <Text className='text-xs' style={{ fontFamily: "semiBold" }}>Nothing in Cart</Text>
                        </View>}
                    {cartData.length > 0 &&
                        <>
                            <FlatList showsVerticalScrollIndicator={false} className='mt-12 mb-64' data={cartData} renderItem={({ item }) => (
                                <View className='flex flex-row items-center w-full px-4 bg-white gap-2 mt-1 border-b border-gray-200 py-2'>
                                    <View>
                                        <Image height={80} width={80} className='rounded' style={{ resizeMode: "cover" }} source={{ uri: item.image }} />
                                    </View>
                                    <View className='flex-1'>
                                        <View className='flex flex-row justify-between'>
                                            <View><Text className={` ${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"}`} numberOfLines={1} style={{ fontFamily: "bold" }}>{item.title}</Text></View>
                                            <TouchableOpacity onPress={() => { deleteCart(`Cart_${item.id}`); fetchData() }}><AntDesign name="delete" size={24} color="black" /></TouchableOpacity>
                                        </View>
                                        <Text className='text-[10px] text-gray-500' style={{ fontFamily: "regular" }}>{item.category}</Text>
                                        <View className='flex flex-row justify-between'>
                                            <Text className={`${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"}`} style={{ fontFamily: "semiBold" }}>{`Rs.${item.price}/-`}</Text>
                                            <View className="flex flex-row gap-4 items-center">
                                                <TouchableOpacity onPressIn={() => { storeData(`Cart_${item.id}`, { title: item.title, image: item.image, category: item.category, price: item.price, quantity: item.quantity === 10 ? item.quantity : item.quantity + 1, id: item.id }); fetchData() }}>
                                                    <AntDesign name="pluscircleo" size={20} color="black" />
                                                </TouchableOpacity>
                                                <Text className="font-semibold">{item.quantity}</Text>
                                                <TouchableOpacity onPressIn={() => { storeData(`Cart_${item.id}`, { title: item.title, image: item.image, category: item.category, price: item.price, quantity: item.quantity === 1 ? item.quantity : item.quantity - 1, id: item.id }); fetchData() }}>
                                                    <AntDesign name="minuscircleo" size={20} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )} />
                            {cartData.length > 0 && <View className='absolute bottom-0  bg-[#E9F6FF] w-full px-4 py-5  '>
                                <View className='flex gap-4'>
                                <Text className={`${width > Sizes.breakpoint ? "text-lg" :"text-xs"}`} style={{ fontFamily: "semiBold" }}>Order Info</Text>
                                <View className='flex flex-row justify-between'>
                                    <Text className={`${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"}`} style={{ fontFamily: "regular" }}>Subtotal</Text>
                                    <Text className={`${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"}`} style={{ fontFamily: "bold" }}>{totalPrice}</Text>
                                </View>
                                <View className='flex flex-row justify-between'>
                                    <Text className={`${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"}`} style={{ fontFamily: "regular" }}>Delivery Chrgs</Text>
                                    <Text className={`${width > Sizes.breakpoint ? "text-lg" : "text-[10px]"}`} style={{ fontFamily: "bold" }}>200</Text>
                                </View>
                                <View className='border-b border-gray-200'></View>
                                <TouchableOpacity className='flex-1 bg-[#264BAE] rounded' onPress={() => navigation.navigate(MainScreens.StackCheckout)}>
                                    <Text className={`text-white text-center  ${width > Sizes.breakpoint ? "text-lg p-4" : "text-xs p-2"}`} style={{ fontFamily: "semiBold" }}>Checkout {` Rs.${totalPrice + 200}`}</Text>
                                </TouchableOpacity>
                                </View>
                            </View>}

                        </>
                    }

                </View>
            </SafeAreaView>
        </>

    )
}

export default Main