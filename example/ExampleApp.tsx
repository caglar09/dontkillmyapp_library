import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { InstructionModal, useDeviceInstructions } from '../src';

const ExampleApp = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { manufacturerName, hasInstructions } = useDeviceInstructions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Don't Kill My App Example</Text>
      
      <Text style={styles.info}>
        Device Manufacturer: {manufacturerName || 'Unknown'}
      </Text>
      
      <Text style={styles.info}>
        Has Background Instructions: {hasInstructions ? 'Yes' : 'No'}
      </Text>
      
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ExampleApp;
