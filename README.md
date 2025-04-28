# React Native Don't Kill My App

A React Native library that helps your app run in the background on different Android devices by providing device-specific instructions to users.

## Installation

```bash
npm install react-native-dontkillmyapp react-native-webview
# or
yarn add react-native-dontkillmyapp react-native-webview
```

> Note: This library requires `react-native-webview` as a peer dependency to display the HTML instructions.

## Features

- 📱 Automatically detects the Android device manufacturer
- 📋 Provides device-specific instructions from [dontkillmyapp.com](https://dontkillmyapp.com)
- 🎨 Includes a customizable modal component to display instructions
- 🔧 Offers helper functions and hooks for complete customization
- 📦 Works offline with embedded device data
- 🧪 Includes testing utilities to simulate different device manufacturers

## Usage

### Basic Usage with Modal

```jsx
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { InstructionModal } from 'react-native-dontkillmyapp';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Show Background Instructions"
        onPress={() => setModalVisible(true)}
      />
      
      <InstructionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Keep App Running in Background"
        closeButtonText="Got it"
      />
    </View>
  );
};

export default App;
```

### Using the Hook for Custom UI

```jsx
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useDeviceInstructions } from 'react-native-dontkillmyapp';
import { WebView } from 'react-native-webview';

const CustomInstructionsScreen = () => {
  const { 
    deviceData, 
    loading, 
    hasInstructions, 
    manufacturerName 
  } = useDeviceInstructions();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading instructions...</Text>
      </View>
    );
  }

  if (!hasInstructions) {
    return (
      <View style={styles.container}>
        <Text>No specific instructions found for your device.</Text>
        <Text>General Android battery optimization settings may apply.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Instructions for {manufacturerName} devices
      </Text>
      
      <ScrollView style={styles.scrollView}>
        <WebView
          originWhitelist={['*']}
          source={{ html: deviceData?.user_solution || '' }}
          style={styles.webView}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  webView: {
    height: 500,
  },
});

export default CustomInstructionsScreen;
```

### Testing Different Manufacturers

For development and testing purposes, you can override the device manufacturer detection:

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Picker } from 'react-native';
import { 
  InstructionModal, 
  setTestManufacturer, 
  clearTestManufacturer,
  isInTestMode
} from 'react-native-dontkillmyapp';

const TestScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  
  // List of common manufacturers to test
  const manufacturers = [
    { label: 'Real Device (Clear Override)', value: '' },
    { label: 'Samsung', value: 'samsung' },
    { label: 'Huawei', value: 'huawei' },
    { label: 'Xiaomi', value: 'xiaomi' },
    { label: 'OnePlus', value: 'oneplus' },
    { label: 'Oppo', value: 'oppo' },
    { label: 'Vivo', value: 'vivo' },
    { label: 'Sony', value: 'sony' },
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
      
      <Text style={styles.status}>
        Test Mode: {isInTestMode() ? 'Active' : 'Inactive'}
      </Text>
      
      <Button
        title="Show Instructions for Selected Manufacturer"
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
  status: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 20,
  },
});

export default TestScreen;
```

### Using Helper Functions

```jsx
import { getBackgroundInstructions } from 'react-native-dontkillmyapp';

// Get instructions for the current device
const instructions = getBackgroundInstructions({
  appName: 'Sleep Tracker', // Replace placeholders in the instructions
});

console.log(`Device: ${instructions.manufacturerName}`);
console.log(`Has instructions: ${instructions.found}`);
console.log(`Test mode active: ${instructions.testMode}`);

// The HTML content can be used with WebView or other components
const htmlContent = instructions.instructionsHtml;
```

## API Reference

### Components

#### `<InstructionModal />`

A ready-to-use modal component that displays device-specific instructions.

Props:
- `visible` (boolean): Whether the modal is visible
- `onClose` (function): Callback when the modal is closed
- `title` (string, optional): Modal title (default: "Keep App Running in Background")
- `closeButtonText` (string, optional): Text for the close button (default: "Got it")
- `containerStyle` (object, optional): Custom styles for the modal container
- `contentStyle` (object, optional): Custom styles for the modal content
- `titleStyle` (object, optional): Custom styles for the title
- `buttonStyle` (object, optional): Custom styles for the close button
- `buttonTextStyle` (object, optional): Custom styles for the button text
- `deviceData` (DeviceData, optional): Custom device data to override automatic detection
- `onNoInstructions` (function, optional): Callback when no instructions are found

#### `<InstructionsHelper />`

A component that uses render props pattern for complete UI customization.

Props:
- `renderInstructions` (function): Function to render custom UI with the instructions data
- `renderNoInstructions` (function, optional): Fallback UI to render when no instructions are found
- `renderLoading` (function, optional): Function to render loading state

### Hooks

#### `useDeviceInstructions(options)`

A hook that provides device-specific instructions data.

Options:
- `autoFetch` (boolean, optional): Whether to automatically fetch instructions on mount (default: true)
- `onSuccess` (function, optional): Callback when instructions are successfully fetched
- `onNotFound` (function, optional): Callback when no instructions are found

Returns:
- `deviceData` (DeviceData | null): The device-specific instructions data
- `loading` (boolean): Whether instructions are being fetched
- `error` (string | null): Error message if fetching failed
- `fetchInstructions` (function): Function to manually fetch instructions
- `hasInstructions` (boolean): Whether instructions are available
- `manufacturerName` (string | null): The name of the device manufacturer

### Utility Functions

#### `getDeviceManufacturer()`

Gets the device manufacturer name in lowercase with spaces replaced by hyphens.

Returns: string

#### `getCurrentDeviceInstructions()`

Gets the instructions for the current device.

Returns: DeviceData | null

#### `getDeviceInstructions(manufacturer)`

Gets the instructions for a specific manufacturer.

Parameters:
- `manufacturer` (string): The manufacturer name

Returns: DeviceData | null

#### `getBackgroundInstructions(options)`

Helper function that returns the HTML instructions for the current device or a specified manufacturer.

Options:
- `manufacturer` (string, optional): Manufacturer name to override automatic detection
- `appName` (string, optional): App name to replace placeholders in instructions (default: "your app")

Returns:
- `found` (boolean): Whether instructions were found
- `manufacturerName` (string | null): The name of the device manufacturer
- `instructionsHtml` (string | null): The HTML instructions for users
- `developerInstructionsHtml` (string | null): The HTML instructions for developers
- `award` (number | undefined): The device's "don't kill my app" award rating
- `position` (number | undefined): The device's position in the ranking
- `explanation` (string | undefined): Additional explanation about the device
- `testMode` (boolean): Whether the library is currently in test mode

### Testing Utilities

#### `setTestManufacturer(manufacturer)`

Override the device manufacturer for testing purposes.

Parameters:
- `manufacturer` (string | null): The manufacturer name to use for testing (e.g., 'samsung', 'xiaomi'), or null to clear the override

#### `clearTestManufacturer()`

Clear any manufacturer override that was set for testing.

#### `getTestManufacturer()`

Gets the current test manufacturer if set.

Returns: string | null

#### `isInTestMode()`

Checks if the library is currently in test mode with an overridden manufacturer.

Returns: boolean

## License

MIT
