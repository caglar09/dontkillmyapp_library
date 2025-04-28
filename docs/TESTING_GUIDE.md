# Testing Guide for React Native Don't Kill My App

This guide explains how to use the testing utilities in the React Native Don't Kill My App library to simulate different device manufacturers during development.

## Why Test Different Manufacturers?

Different Android device manufacturers implement various background processing restrictions. Testing your app's behavior with these different restrictions is important to ensure a good user experience across all devices.

## Using the Testing Utilities

The library includes several functions to help you test different manufacturer scenarios:

### Basic Testing Functions

```javascript
import { 
  setTestManufacturer, 
  clearTestManufacturer,
  getTestManufacturer,
  isInTestMode 
} from 'react-native-dontkillmyapp';

// Override the manufacturer to test Xiaomi-specific instructions
setTestManufacturer('xiaomi');

// Check if test mode is active
console.log(`Test mode active: ${isInTestMode()}`); // true

// Get the current test manufacturer
console.log(`Testing as: ${getTestManufacturer()}`); // 'xiaomi'

// Clear the override and return to actual device detection
clearTestManufacturer();

console.log(`Test mode active: ${isInTestMode()}`); // false
```

### Available Manufacturers for Testing

The following manufacturers have specific instructions in the library:

- `samsung` - Samsung devices
- `huawei` - Huawei devices
- `xiaomi` - Xiaomi devices
- `oneplus` - OnePlus devices
- `oppo` - Oppo devices
- `vivo` - Vivo devices
- `sony` - Sony devices
- `nokia` - Nokia devices
- `motorola` - Motorola devices
- `asus` - Asus devices
- `meizu` - Meizu devices
- `lenovo` - Lenovo devices
- `blackview` - Blackview devices
- `tecno` - Tecno devices
- `unihertz` - Unihertz devices
- `realme` - Realme devices
- `htc` - HTC devices
- `google` - Google devices

## Creating a Test Screen

You can create a dedicated test screen in your development builds to easily switch between different manufacturers:

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Picker } from 'react-native';
import { 
  InstructionModal, 
  setTestManufacturer, 
  clearTestManufacturer,
  isInTestMode,
  getDeviceManufacturer 
} from 'react-native-dontkillmyapp';

const TestScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  
  // List of manufacturers to test
  const manufacturers = [
    { label: 'Real Device (Clear Override)', value: '' },
    { label: 'Samsung', value: 'samsung' },
    { label: 'Huawei', value: 'huawei' },
    { label: 'Xiaomi', value: 'xiaomi' },
    // Add more manufacturers as needed
  ];
  
  // Set or clear the test manufacturer when selection changes
  useEffect(() => {
    if (selectedManufacturer) {
      setTestManufacturer(selectedManufacturer);
    } else {
      clearTestManufacturer();
    }
  }, [selectedManufacturer]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Different Manufacturers</Text>
      
      <Text>Actual Device: {getDeviceManufacturer()}</Text>
      <Text>Test Mode: {isInTestMode() ? 'Active' : 'Inactive'}</Text>
      
      <Text style={styles.label}>Select a manufacturer to simulate:</Text>
      <Picker
        selectedValue={selectedManufacturer}
        onValueChange={(value) => setSelectedManufacturer(value)}
        style={styles.picker}
      >
        {manufacturers.map((mfr) => (
          <Picker.Item key={mfr.value} label={mfr.label} value={mfr.value} />
        ))}
      </Picker>
      
      <Button
        title="Show Instructions"
        onPress={() => setModalVisible(true)}
      />
      
      <InstructionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
});

export default TestScreen;
```

## Testing with Custom Components

If you're using custom components with the library's hooks or helper functions, you can still use the testing utilities:

```jsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDeviceInstructions, setTestManufacturer } from 'react-native-dontkillmyapp';

const CustomInstructionsComponent = ({ testManufacturer }) => {
  // Set the test manufacturer when the prop changes
  useEffect(() => {
    if (testManufacturer) {
      setTestManufacturer(testManufacturer);
    } else {
      clearTestManufacturer();
    }
    
    // Clean up when component unmounts
    return () => clearTestManufacturer();
  }, [testManufacturer]);
  
  // Use the hook as normal - it will use the test manufacturer if set
  const { deviceData, loading, hasInstructions } = useDeviceInstructions();
  
  if (loading) {
    return <Text>Loading...</Text>;
  }
  
  if (!hasInstructions) {
    return <Text>No instructions available for this device</Text>;
  }
  
  return (
    <View>
      <Text>Instructions for {deviceData.name}</Text>
      {/* Render your custom UI with the instructions */}
    </View>
  );
};

export default CustomInstructionsComponent;
```

## Best Practices

1. **Development Only**: Only use these testing utilities in development builds, not in production.

2. **Reset on Unmount**: Always clear the test manufacturer when your test component unmounts to avoid affecting other parts of your app.

3. **Conditional Import**: Consider conditionally importing the testing utilities only in development builds:

```javascript
// Import testing utilities only in development
const TestUtils = __DEV__ 
  ? require('react-native-dontkillmyapp').TestUtils 
  : null;

// Use them safely
if (__DEV__ && TestUtils) {
  TestUtils.setTestManufacturer('samsung');
}
```

4. **Test All Relevant Manufacturers**: Test with manufacturers that are popular among your user base.

5. **Combine with Real Device Testing**: While the testing utilities are helpful for development, always test on real devices before releasing your app.
