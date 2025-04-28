// This file contains the device data extracted from dontkillmyapp.com API
// The data is embedded directly in the library for offline use

export interface DeviceData {
  name: string;
  manufacturer_raw: string[];
  url?: string;
  award?: number;
  position?: number;
  explanation?: string;
  user_solution?: string;
  developer_solution?: string;
}

export interface DeviceDataMap {
  [key: string]: DeviceData;
}

// Use a path that works both before and after building
// For source: Path is relative to src/data/deviceData.ts
// For build: Path is relative to lib/data/deviceData.js
let deviceData: DeviceDataMap;

try {
  // First try the path that works in the built version
  deviceData = require('../../data/dontkillmyapp_data.json');
} catch (e) {
  try {
    // If that fails, try the path that works in development
    deviceData = require('../../data/dontkillmyapp_data.json');
  } catch (e2) {
    // If both fail, provide a helpful error message
    console.error('Failed to load device data. Path resolution issue detected.');
    console.error('Original error:', e);
    console.error('Secondary error:', e2);
    // Provide an empty object as fallback to prevent crashes
    deviceData = {};
  }
}

export default deviceData;
