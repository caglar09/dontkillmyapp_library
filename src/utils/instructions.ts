import deviceData, { DeviceData } from '../data/deviceData';
import { getDeviceManufacturer } from './deviceInfo';

/**
 * Retrieves the instructions for a specific device manufacturer.
 * 
 * @param manufacturer The normalized manufacturer name (lowercase, hyphenated)
 * @returns The DeviceData object containing instructions, or null if not found.
 */
export const getDeviceInstructions = (manufacturer: string): DeviceData | null => {
  // Find the manufacturer key in the data
  // The API uses the lowercase hyphenated name as the key
  const manufacturerKey = manufacturer.toLowerCase().replace(/\s+/g, '-');

  if (deviceData[manufacturerKey]) {
    return deviceData[manufacturerKey];
  }

  // Fallback: Check if the manufacturer name is listed in the 'manufacturer_raw' array of any entry
  // This handles cases where the primary key might differ slightly but the raw name matches
  for (const key in deviceData) {
    if (deviceData[key].manufacturer_raw?.includes(manufacturerKey)) {
      return deviceData[key];
    }
  }

  return null;
};

/**
 * Retrieves the instructions for the current device.
 * 
 * @returns The DeviceData object for the current device, or null if not applicable or not found.
 */
export const getCurrentDeviceInstructions = (): DeviceData | null => {
  const manufacturer = getDeviceManufacturer();
  if (!manufacturer) {
    return null; // Not an Android device or manufacturer unknown
  }
  return getDeviceInstructions(manufacturer);
};

