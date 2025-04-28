import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  Platform 
} from 'react-native';
import { 
  InstructionModal, 
  setTestManufacturer, 
  clearTestManufacturer,
  isInTestMode,
  getDeviceManufacturer
} from '../src';

const manufacturers = [
  { label: 'Real Device (Clear Override)', value: '' },
  { label: 'Samsung', value: 'samsung' },
  { label: 'Huawei', value: 'huawei' },
  { label: 'Xiaomi', value: 'xiaomi' },
  { label: 'OnePlus', value: 'oneplus' },
  { label: 'Oppo', value: 'oppo' },
  { label: 'Vivo', value: 'vivo' },
  { label: 'Sony', value: 'sony' },
  { label: 'Nokia', value: 'nokia' },
  { label: 'Motorola', value: 'motorola' },
  { label: 'Asus', value: 'asus' },
  { label: 'Lenovo', value: 'lenovo' },
];

const TestApp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [currentManufacturer, setCurrentManufacturer] = useState('');
  
  useEffect(() => {
    if (selectedManufacturer) {
      setTestManufacturer(selectedManufacturer);
    } else {
      clearTestManufacturer();
    }
    setCurrentManufacturer(getDeviceManufacturer());
  }, [selectedManufacturer]);
  
  const handleSelectManufacturer = (value: string) => {
    setSelectedManufacturer(value);
    setSelectionModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Don't Kill My App - Test Mode</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Actual Device Manufacturer:</Text>
        <Text style={styles.infoValue}>{Platform.OS === 'android' ? getDeviceManufacturer() : 'Not Android'}</Text>
        
        <Text style={styles.infoLabel}>Test Mode:</Text>
        <Text style={styles.infoValue}>{isInTestMode() ? 'Active' : 'Inactive'}</Text>
        
        <Text style={styles.infoLabel}>Current Manufacturer Used:</Text>
        <Text style={styles.infoValue}>{currentManufacturer || 'None'}</Text>
      </View>

      <Text style={styles.label}>Select a manufacturer to simulate:</Text>

      <TouchableOpacity 
        style={styles.selectButton}
        onPress={() => setSelectionModalVisible(true)}
      >
        <Text style={styles.selectButtonText}>
          {manufacturers.find(m => m.value === selectedManufacturer)?.label || 'Select Manufacturer'}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button
          title="Show Instructions for Selected Manufacturer"
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Manufacturer Selection Modal */}
      <Modal
        visible={selectionModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={manufacturers}
              keyExtractor={(item) => item.value || 'real-device'}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => handleSelectManufacturer(item.value)}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Cancel" onPress={() => setSelectionModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <InstructionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Instructions for ${currentManufacturer ? currentManufacturer.charAt(0).toUpperCase() + currentManufacturer.slice(1) : ''} Devices`}
        closeButtonText="Got it"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  infoValue: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    maxHeight: '80%',
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default TestApp;
