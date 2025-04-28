# React Native Don't Kill My App - Usage Guide

This document provides additional information on how to use the React Native Don't Kill My App library in your projects.

## Installation

First, install the library and its peer dependency:

```bash
npm install react-native-dontkillmyapp react-native-webview
# or
yarn add react-native-dontkillmyapp react-native-webview
```

## When to Show Instructions

Consider showing the device-specific instructions in these scenarios:

1. **First Launch**: When a user first installs your app
2. **Background Issues**: When your app detects it's being killed in the background
3. **Settings Page**: Add a "Background Processing Help" button in your app settings
4. **Critical Features**: Before starting features that require background processing (like tracking, recording, etc.)

## Integration Examples

### Show Instructions on First Launch

```jsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InstructionModal, getCurrentDeviceInstructions } from 'react-native-dontkillmyapp';

const App = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasShownInstructions = await AsyncStorage.getItem('hasShownBackgroundInstructions');
        
        if (!hasShownInstructions) {
          // Check if there are instructions for this device
          const deviceInstructions = getCurrentDeviceInstructions();
          
          if (deviceInstructions?.user_solution) {
            setShowInstructions(true);
            await AsyncStorage.setItem('hasShownBackgroundInstructions', 'true');
          }
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };
    
    checkFirstLaunch();
  }, []);
  
  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      
      <InstructionModal
        visible={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Keep App Running in Background"
      />
    </View>
  );
};

export default App;
```

### Custom UI with InstructionsHelper

```jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { InstructionsHelper } from 'react-native-dontkillmyapp';
import { WebView } from 'react-native-webview';

const CustomInstructionsScreen = ({ onClose }) => {
  return (
    <InstructionsHelper
      renderLoading={() => (
        <View style={styles.loadingContainer}>
          <Text>Loading device instructions...</Text>
        </View>
      )}
      renderNoInstructions={() => (
        <View style={styles.container}>
          <Text style={styles.title}>No Special Instructions Needed</Text>
          <Text style={styles.text}>
            Your device doesn't require any special settings to keep our app running in the background.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
      renderInstructions={({ deviceData, manufacturerName }) => (
        <View style={styles.container}>
          <Text style={styles.title}>
            {manufacturerName} Device Instructions
          </Text>
          <Text style={styles.subtitle}>
            Please follow these steps to ensure our app works properly in the background:
          </Text>
          <ScrollView style={styles.scrollView}>
            <WebView
              originWhitelist={['*']}
              source={{ 
                html: `
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                          padding: 8px;
                          margin: 0;
                          color: #333;
                          font-size: 16px;
                          line-height: 1.5;
                        }
                        img {
                          max-width: 100%;
                          height: auto;
                          border-radius: 8px;
                          margin: 10px 0;
                        }
                      </style>
                    </head>
                    <body>
                      ${deviceData?.user_solution || ''}
                    </body>
                  </html>
                `
              }}
              style={styles.webView}
            />
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Got It</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  webView: {
    height: 500,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomInstructionsScreen;
```

## Advanced Usage

### Customizing the Modal Appearance

```jsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
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
        title="Keep Our App Running"
        closeButtonText="I Understand"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
        contentStyle={{
          backgroundColor: '#f5f5f5',
          borderRadius: 15,
          padding: 25,
        }}
        titleStyle={{
          color: '#333',
          fontSize: 22,
          fontWeight: '700',
        }}
        buttonStyle={{
          backgroundColor: '#4CAF50',
          paddingVertical: 15,
          paddingHorizontal: 40,
          borderRadius: 30,
        }}
        buttonTextStyle={{
          fontSize: 18,
        }}
      />
    </View>
  );
};

export default App;
```

### Using the Helper Function in a Non-React Context

```javascript
import { getBackgroundInstructions } from 'react-native-dontkillmyapp';

// Function to generate HTML content for a WebView or other display
function generateInstructionsContent() {
  const instructions = getBackgroundInstructions({
    appName: 'MyAwesomeApp',
  });
  
  if (!instructions.found) {
    return `
      <html>
        <body>
          <h2>No special instructions needed</h2>
          <p>Your device doesn't require any special settings to keep MyAwesomeApp running in the background.</p>
        </body>
      </html>
    `;
  }
  
  return `
    <html>
      <head>
        <style>
          body { font-family: sans-serif; padding: 15px; }
          h2 { color: #333; }
          img { max-width: 100%; }
        </style>
      </head>
      <body>
        <h2>Instructions for ${instructions.manufacturerName} devices</h2>
        ${instructions.instructionsHtml}
      </body>
    </html>
  `;
}

// This HTML content can be used with WebView or other components
const htmlContent = generateInstructionsContent();
```

## Troubleshooting

### Modal Not Showing on iOS

This library is specifically designed for Android devices. On iOS, the modal will not show by default since iOS doesn't have the same background processing restrictions as Android.

### WebView Not Rendering HTML

Make sure you have installed `react-native-webview` as a peer dependency:

```bash
npm install react-native-webview
# or
yarn add react-native-webview
```

And ensure you've completed the installation process for react-native-webview, which may include linking for older React Native versions.

### No Instructions Found for Device

If no instructions are found for a specific device, it might be because:

1. The device manufacturer is not in the dontkillmyapp.com database
2. The device is using stock Android without modifications
3. There was an error detecting the device manufacturer

You can provide fallback instructions for generic Android devices or check the manufacturer manually:

```javascript
import { getDeviceManufacturer } from 'react-native-dontkillmyapp';

console.log('Device manufacturer:', getDeviceManufacturer());
```
