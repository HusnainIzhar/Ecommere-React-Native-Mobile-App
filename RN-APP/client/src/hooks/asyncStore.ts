import AsyncStorage from '@react-native-async-storage/async-storage';
import { ICart } from 'types/data';

export const storeData = async (key: string, value: ICart) => {
    const cart: ICart = {
        id:value.id,
        image: value.image,
        title: value.title,
        category: value.category,
        price: value.price,
        quantity: value.quantity,
        total:value.price * value.quantity
    };
    try {
        const jsonValue = JSON.stringify(cart);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error('Error saving cart data:', error);
    }
};



export const deleteCart = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (error) {
        console.error('Error deleting cart data:', error);
    }
}

export const getAllCart = async (value:string) => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const cartItems = keys.filter((key) => key.startsWith(value))
        const carts = await AsyncStorage.multiGet(cartItems)
        const decryptedCarts = carts.map(([_, value]) => JSON.parse(value));
        return decryptedCarts;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const removeAllCart = async (value: string) => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cartKeys = keys.filter((key) => key.startsWith(value));
      await AsyncStorage.multiRemove(cartKeys);
    } catch (error) {
      console.error('Error removing cart data:', error);
      throw error;
    }
  };
