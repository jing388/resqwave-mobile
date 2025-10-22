import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

const COUNTRIES = [
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  // Add more countries as needed
];

type CountryCodePickerProps = {
  selectedCountry: typeof COUNTRIES[0];
  onSelect: (country: typeof COUNTRIES[0]) => void;
};

export default function CountryCodePicker({ selectedCountry, onSelect }: CountryCodePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: typeof COUNTRIES[0] }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        onSelect(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.name}</Text>
      <Text style={styles.countryCode}>{item.code}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
        style={styles.selectorContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectedFlag}>{selectedCountry.flag}</Text>
        <Text style={styles.selectedCode}>{selectedCountry.code}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={COUNTRIES}
              renderItem={renderItem}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 56,
    borderWidth: 1,
    borderColor: '#374151',
    marginRight: 8,
    minWidth: 90,
  },
  selectedFlag: {
    fontSize: 18,
    marginRight: 8,
  },
  selectedCode: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Geist_500Medium',
    minWidth: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#262626',
    borderRadius: 12,
    maxHeight: '70%',
    padding: 16,
  },
  countryList: {
    marginBottom: 10,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  flag: {
    fontSize: 16,
    width: 30,
  },
  countryName: {
    color: 'white',
    flex: 1,
    marginLeft: 10,
  },
  countryCode: {
    color: '#9CA3AF',
    fontFamily: 'Geist_500Medium',
    width: 50,
    textAlign: 'right',
  },
  closeButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
