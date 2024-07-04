import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTokens = () => {
  const [tokens, setTokens] = useState({ accessToken: '', refreshToken: '' });

  useEffect(() => {
    const fetchTokens = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      setTokens({ accessToken, refreshToken });
    };

    fetchTokens();
  }, []);

  return tokens;
};