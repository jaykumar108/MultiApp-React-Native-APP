import AsyncStorage from '@react-native-async-storage/async-storage';

// Fallback storage for development/testing
const fallbackStorage = new Map<string, string>();

class StorageService {
  private static instance: StorageService;
  private useFallback: boolean = false;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (!this.useFallback) {
        await AsyncStorage.setItem(key, value);
      } else {
        fallbackStorage.set(key, value);
      }
    } catch (error) {
      console.warn('AsyncStorage failed, using fallback:', error);
      this.useFallback = true;
      fallbackStorage.set(key, value);
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (!this.useFallback) {
        return await AsyncStorage.getItem(key);
      } else {
        return fallbackStorage.get(key) || null;
      }
    } catch (error) {
      console.warn('AsyncStorage failed, using fallback:', error);
      this.useFallback = true;
      return fallbackStorage.get(key) || null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (!this.useFallback) {
        await AsyncStorage.removeItem(key);
      } else {
        fallbackStorage.delete(key);
      }
    } catch (error) {
      console.warn('AsyncStorage failed, using fallback:', error);
      this.useFallback = true;
      fallbackStorage.delete(key);
    }
  }

  async clear(): Promise<void> {
    try {
      if (!this.useFallback) {
        await AsyncStorage.clear();
      } else {
        fallbackStorage.clear();
      }
    } catch (error) {
      console.warn('AsyncStorage failed, using fallback:', error);
      this.useFallback = true;
      fallbackStorage.clear();
    }
  }
}

export default StorageService.getInstance(); 