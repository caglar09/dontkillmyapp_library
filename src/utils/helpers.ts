import { DeviceData } from '../data/deviceData';
import { getDeviceManufacturer, isInTestMode, getTestManufacturer } from './deviceInfo';
import { getCurrentDeviceInstructions } from './instructions';

/**
 * Helper function that returns the HTML instructions for the current device
 * or a specified manufacturer.
 * 
 * @param options Configuration options
 * @returns An object containing the instructions HTML and device information
 */
export const getBackgroundInstructions = (options?: {
  /**
   * Optional manufacturer name to override automatic detection
   */
  manufacturer?: string;
  
  /**
   * Optional app name to replace placeholders in instructions
   * @default "your app"
   */
  appName?: string;
}) => {
  const { manufacturer, appName = "your app" } = options || {};
  
  // Get device data based on provided manufacturer or current device
  let deviceData: DeviceData | null = null;
  
  if (manufacturer) {
    // Use the specified manufacturer
    deviceData = getCurrentDeviceInstructions();
  } else {
    // Auto-detect the current device
    deviceData = getCurrentDeviceInstructions();
  }
  
  // Get the actual manufacturer name being used (real or test)
  const actualManufacturer = isInTestMode() 
    ? getTestManufacturer() 
    : getDeviceManufacturer();
  
  if (!deviceData) {
    return {
      found: false,
      manufacturerName: manufacturer || actualManufacturer || null,
      instructionsHtml: null,
      developerInstructionsHtml: null,
      testMode: isInTestMode(),
    };
  }
  
  // Replace app name placeholders in the instructions
  let userInstructions = deviceData.user_solution || null;
  let developerInstructions = deviceData.developer_solution || null;
  
  if (userInstructions) {
    // Replace app name placeholders with the provided app name
    userInstructions = userInstructions.replace(/\\\[\[Yy\]our app\\\]/g, appName);
  }
  
  if (developerInstructions) {
    // Replace app name placeholders with the provided app name
    developerInstructions = developerInstructions.replace(/\\\[\[Yy\]our app\\\]/g, appName);
  }
  
  return {
    found: true,
    manufacturerName: deviceData.name,
    instructionsHtml: userInstructions,
    developerInstructionsHtml: developerInstructions,
    award: deviceData.award,
    position: deviceData.position,
    explanation: deviceData.explanation,
    testMode: isInTestMode(),
  };
};
