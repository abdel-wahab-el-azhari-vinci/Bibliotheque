import { Platform } from 'react-native';

const getApiUrl = () => {
  // Dev web local
  if (Platform.OS === 'web') {
    return 'http://localhost:8083/api';
  }

  // Mobile: IP locale personnelle (Wi-Fi - 192.168.129.6)
  // Ne pas utiliser 5G - utiliser votre IP personnelle
  return 'http://192.168.129.6:8083/api';
};

export const CONFIG = {
  API_URL: getApiUrl(),
  IS_DEV: __DEV__,
};

export default CONFIG;
