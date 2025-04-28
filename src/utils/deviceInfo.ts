import { Platform, NativeModules } from 'react-native';

// Store the overridden manufacturer for testing
let overriddenManufacturer: string | null = null;

/**
 * Override the device manufacturer for testing purposes.
 * This is useful in development environments to test different device instructions.
 * 
 * @param manufacturer The manufacturer name to use for testing (e.g., 'samsung', 'xiaomi', 'huawei')
 */
export const setTestManufacturer = (manufacturer: string | null): void => {
  // If null is passed, clear the override
  if (manufacturer === null) {
    overriddenManufacturer = null;
    return;
  }
  
  // Normalize the manufacturer name to match the format used by dontkillmyapp.com API
  overriddenManufacturer = manufacturer.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Clear any manufacturer override that was set for testing.
 * This restores the actual device manufacturer detection.
 */
export const clearTestManufacturer = (): void => {
  overriddenManufacturer = null;
};

/**
 * Gets the current test manufacturer if set, or null if not in test mode.
 * 
 * @returns The currently set test manufacturer or null
 */
export const getTestManufacturer = (): string | null => {
  return overriddenManufacturer;
};

/**
 * Checks if the library is currently in test mode with an overridden manufacturer.
 * 
 * @returns True if a test manufacturer is set
 */
export const isInTestMode = (): boolean => {
  return overriddenManufacturer !== null;
};

/**
 * Gets the device manufacturer name in lowercase with spaces replaced by hyphens
 * to match the format used by dontkillmyapp.com API
 * 
 * @returns The normalized device manufacturer name
 */
export const getDeviceManufacturer = (): string => {
  // If a test manufacturer is set, return that instead of the actual device manufacturer
  if (overriddenManufacturer !== null) {
    return overriddenManufacturer;
  }
  
  if (Platform.OS !== 'android') {
    return '';
  }

  // Get the manufacturer from the native modules
  const { brand, manufacturer } = NativeModules.PlatformConstants || {};
  
  // Use manufacturer if available, otherwise fall back to brand
  const deviceMaker = (manufacturer || brand || '').toLowerCase();
  
  // Replace spaces with hyphens to match dontkillmyapp.com API format
  return deviceMaker.replace(/\s+/g, '-');
};

/**
 * Checks if the current device is in the list of known manufacturers
 * 
 * @param knownManufacturers List of manufacturer keys from the data
 * @returns True if the current device manufacturer is in the list
 */
export const isKnownManufacturer = (knownManufacturers: string[]): boolean => {
  const manufacturer = getDeviceManufacturer();
  return knownManufacturers.includes(manufacturer);
};
