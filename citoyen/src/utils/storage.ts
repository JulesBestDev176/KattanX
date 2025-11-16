import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const USER_KEY = 'kattanx_user';
const TOKEN_KEY = 'kattanx_token';
const TEMP_USER_ID_KEY = 'kattanx_temp_user_id';
const TEMP_OTP_KEY = 'kattanx_temp_otp';

export const storage = {
  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY, TEMP_USER_ID_KEY, TEMP_OTP_KEY]);
  },

  async saveTempUserId(userId: string): Promise<void> {
    await AsyncStorage.setItem(TEMP_USER_ID_KEY, userId);
  },

  async getTempUserId(): Promise<string | null> {
    return await AsyncStorage.getItem(TEMP_USER_ID_KEY);
  },

  async saveTempOTP(otp: string): Promise<void> {
    await AsyncStorage.setItem(TEMP_OTP_KEY, otp);
  },

  async getTempOTP(): Promise<string | null> {
    return await AsyncStorage.getItem(TEMP_OTP_KEY);
  },

  async clearTemp(): Promise<void> {
    await AsyncStorage.multiRemove([TEMP_USER_ID_KEY, TEMP_OTP_KEY]);
  },
};



