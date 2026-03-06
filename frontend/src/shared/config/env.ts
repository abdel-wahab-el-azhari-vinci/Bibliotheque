import { Platform } from 'react-native';

const getApiUrl = () => {
  // Dev local web
  if (Platform.OS === 'web') {
    return 'http://localhost:8083/api';
  }

  // Mobile: IP locale du PC (192.168.129.6 = Wi-Fi actif)
  return 'http://192.168.129.6:8083/api';
};

export const CONFIG = {
  API_URL: getApiUrl(),
  IS_DEV: __DEV__,
};

export default CONFIG;
