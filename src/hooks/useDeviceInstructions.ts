import { useState, useEffect } from 'react';
import { DeviceData } from '../data/deviceData';
import { getCurrentDeviceInstructions } from '../utils/instructions';

/**
 * A hook that provides device-specific instructions for keeping an app running in the background.
 * 
 * @param options Optional configuration options
 * @returns An object containing the device instructions and loading state
 */
export const useDeviceInstructions = (options?: {
  /**
   * Whether to automatically fetch instructions on mount
   * @default true
   */
  autoFetch?: boolean;
  
  /**
   * Optional callback when instructions are successfully fetched
   */
  onSuccess?: (data: DeviceData) => void;
  
  /**
   * Optional callback when no instructions are found for the device
   */
  onNotFound?: () => void;
}) => {
  const { 
    autoFetch = true, 
    onSuccess, 
    onNotFound 
  } = options || {};
  
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructions = () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = getCurrentDeviceInstructions();
      setDeviceData(data);
      
      if (data && onSuccess) {
        onSuccess(data);
      } else if (!data && onNotFound) {
        onNotFound();
      }
    } catch (err) {
      setError('Failed to get device instructions');
      console.error('Error in useDeviceInstructions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchInstructions();
    }
  }, []);

  return {
    /**
     * The device-specific instructions data, or null if not found
     */
    deviceData,
    
    /**
     * Whether instructions are currently being fetched
     */
    loading,
    
    /**
     * Error message if fetching instructions failed
     */
    error,
    
    /**
     * Function to manually fetch instructions
     */
    fetchInstructions,
    
    /**
     * Whether instructions are available for the current device
     */
    hasInstructions: !!deviceData?.user_solution,
    
    /**
     * The name of the device manufacturer
     */
    manufacturerName: deviceData?.name || null,
  };
};
