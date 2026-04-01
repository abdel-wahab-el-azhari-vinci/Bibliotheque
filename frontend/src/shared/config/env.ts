import { Platform } from 'react-native';

const getApiUrl = () => {
  // Dev local web
  if (Platform.OS === 'web') {
    return 'http://localhost:8083/api';
  }

  // Mobile: IP locale du PC (10.179.194.62 = 5G actif)
  return 'http://10.179.194.62:8083/api';
};

export const CONFIG = {
  API_URL: getApiUrl(),
  IS_DEV: __DEV__,
};

export default CONFIG;
