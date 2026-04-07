jest.mock('expo-secure-store');
jest.mock('expo-barcode-scanner');
jest.mock('expo-camera');

global.fetch = jest.fn();
