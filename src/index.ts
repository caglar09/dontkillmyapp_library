// Update the main index.ts to export the new testing functions

export { default as InstructionModal } from './components/InstructionModal';
export { default as InstructionsHelper } from './components/InstructionsHelper';
export { useDeviceInstructions } from './hooks/useDeviceInstructions';
export { getDeviceInstructions, getCurrentDeviceInstructions } from './utils/instructions';
export { 
  getDeviceManufacturer, 
  isKnownManufacturer,
  // Export the new testing functions
  setTestManufacturer,
  clearTestManufacturer,
  getTestManufacturer,
  isInTestMode
} from './utils/deviceInfo';
export { getBackgroundInstructions } from './utils/helpers';

// Export types
export type { DeviceData } from './data/deviceData';
