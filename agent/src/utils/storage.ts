import AsyncStorage from '@react-native-async-storage/async-storage';
import { Agent } from '../types';

const AGENT_KEY = 'kattanx_agent';
const TOKEN_KEY = 'kattanx_agent_token';
const TEMP_AGENT_ID_KEY = 'kattanx_temp_agent_id';
const TEMP_OTP_KEY = 'kattanx_temp_otp';
const SERVICE_STATUS_KEY = 'kattanx_service_status';

export const storage = {
  async saveAgent(agent: Agent): Promise<void> {
    await AsyncStorage.setItem(AGENT_KEY, JSON.stringify(agent));
  },

  async getAgent(): Promise<Agent | null> {
    const agentData = await AsyncStorage.getItem(AGENT_KEY);
    return agentData ? JSON.parse(agentData) : null;
  },

  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([
      AGENT_KEY,
      TOKEN_KEY,
      TEMP_AGENT_ID_KEY,
      TEMP_OTP_KEY,
      SERVICE_STATUS_KEY,
    ]);
  },

  async saveTempAgentId(agentId: string): Promise<void> {
    await AsyncStorage.setItem(TEMP_AGENT_ID_KEY, agentId);
  },

  async getTempAgentId(): Promise<string | null> {
    return await AsyncStorage.getItem(TEMP_AGENT_ID_KEY);
  },

  async saveTempOTP(otp: string): Promise<void> {
    await AsyncStorage.setItem(TEMP_OTP_KEY, otp);
  },

  async getTempOTP(): Promise<string | null> {
    return await AsyncStorage.getItem(TEMP_OTP_KEY);
  },

  async clearTemp(): Promise<void> {
    await AsyncStorage.multiRemove([TEMP_AGENT_ID_KEY, TEMP_OTP_KEY]);
  },

  async saveServiceStatus(enService: boolean): Promise<void> {
    await AsyncStorage.setItem(SERVICE_STATUS_KEY, JSON.stringify(enService));
  },

  async getServiceStatus(): Promise<boolean> {
    const status = await AsyncStorage.getItem(SERVICE_STATUS_KEY);
    return status ? JSON.parse(status) : false;
  },
};
