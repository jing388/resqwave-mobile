import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Modal, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Radio, Check, X, ChevronDown } from 'lucide-react-native';

export default function AboutNeighborhoodScreen() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("September 25, 2023");

  // Dropdown modal state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState<{
    label: string;
    value: string | number;
    options: string[];
    onChange: (value: string) => void;
  } | null>(null);

  // Editable data state
  const [editedData, setEditedData] = useState({
    approxHouseholds: 15800,
    approxResidents: 71726,
    floodwaterSubsidence: "2-4 hours",
    floodRelatedHazards: [
      { label: "Strong Water Current (Malakas na agos ng tubig)", checked: true },
      { label: "Risk of landslide or erosion (Panganib ng landslide o erosion)", checked: false },
      { label: "Drainage overflow or canal blockage (Pag-apaw ng drainage o bara sa kanal)", checked: true },
      { label: "Roads became impassable (Mga kalsada ay hindi madaanan)", checked: false },
      { label: "Electrical wires or exposed cables (Mga kable o wire na nakalantad)", checked: true }
    ],
    notableInfo: "Located in Camarin area, North Caloocan\nContains multiple residential subdivisions\nPart of flood-prone zone in Metro Manila\nWell-connected to public transportation\nGrowing commercial area with local markets"
  });

  // Mock data for Node N-16
  const neighborhoodData = {
    name: "N-16",
    registeredAt: "August 10, 2023",
    terminalID: "RSQW-001",
    terminalAddress: "Barangay 175 Subdivision, Camarin, Caloocan City North",
    coordinates: {
      latitude: 14.765,
      longitude: 121.0392
    },
    approxHouseholds: editedData.approxHouseholds,
    approxResidents: editedData.approxResidents,
    floodwaterSubsidence: editedData.floodwaterSubsidence,
    floodRelatedHazards: editedData.floodRelatedHazards.filter(h => h.checked).map(h => h.label.split(' (')[0]),
    notableInfo: editedData.notableInfo.split('\n')
  };

  // Handler functions
  const handleEditPress = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset edited data to original values
    setEditedData({
      approxHouseholds: 15800,
      approxResidents: 71726,
      floodwaterSubsidence: "2-4 hours",
      floodRelatedHazards: [
        { label: "Strong Water Current (Malakas na agos ng tubig)", checked: true },
        { label: "Risk of landslide or erosion (Panganib ng landslide o erosion)", checked: false },
        { label: "Drainage overflow or canal blockage (Pag-apaw ng drainage o bara sa kanal)", checked: true },
        { label: "Roads became impassable (Mga kalsada ay hindi madaanan)", checked: false },
        { label: "Electrical wires or exposed cables (Mga kable o wire na nakalantad)", checked: true }
      ],
      notableInfo: "Located in Camarin area, North Caloocan\nContains multiple residential subdivisions\nPart of flood-prone zone in Metro Manila\nWell-connected to public transportation\nGrowing commercial area with local markets"
    });
  };

  const handleSubmitEdit = () => {
    console.log('Submitting edited data:', editedData);

    // Update the last updated date to current time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    setLastUpdatedDate(`${formattedDate}, ${formattedTime}`);

    // Here you would typically save to a database or API
    setIsEditMode(false);
  };

  const handleDropdownChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: field === 'approxHouseholds' || field === 'approxResidents' ? parseInt(value) : value
    }));
  };

  const handleHazardToggle = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      floodRelatedHazards: prev.floodRelatedHazards.map((hazard, i) =>
        i === index ? { ...hazard, checked: !hazard.checked } : hazard
      )
    }));
  };

  const handleNotableInfoChange = (text: string) => {
    setEditedData(prev => ({
      ...prev,
      notableInfo: text
    }));
  };

  const openDropdown = (label: string, value: string | number, options: string[], onChange: (value: string) => void) => {
    setSelectedDropdown({ label, value: String(value), options, onChange });
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setSelectedDropdown(null);
  };

  const selectDropdownOption = (value: string) => {
    if (selectedDropdown) {
      selectedDropdown.onChange(value);
    }
    closeDropdown();
  };

  const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <View className="flex-row justify-between items-start py-3 border-b border-gray-700">
      <Text className="text-gray-300 text-base font-geist-medium flex-shrink-0 mr-4" style={{ width: '40%' }}>
        {label}
      </Text>
      <Text className="text-white text-base font-geist-regular flex-1 text-right leading-6">
        {value}
      </Text>
    </View>
  );

  const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-700">
      <Text className="text-white text-lg font-geist-semibold mb-3">{title}</Text>
      {children}
    </View>
  );

  const EditableDropdown = ({ label, value, options, onChange }: {
    label: string;
    value: string | number;
    options: string[];
    onChange: (value: string) => void;
  }) => (
    <View className="mb-4">
      <Text className="text-gray-300 text-base font-geist-medium mb-2">{label}</Text>
      <TouchableOpacity
        className="border border-gray-600 rounded-lg bg-gray-800 px-3 py-3 flex-row justify-between items-center"
        onPress={() => openDropdown(label, value, options, onChange)}
      >
        <Text className="text-white text-base flex-1">{value}</Text>
        <ChevronDown size={20} color="#60A5FA" />
      </TouchableOpacity>
    </View>
  );

  const EditableCheckbox = ({ label, checked, onToggle }: {
    label: string;
    checked: boolean;
    onToggle: () => void;
  }) => (
    <TouchableOpacity
      className="flex-row items-center py-2 mb-2"
      onPress={onToggle}
    >
      <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
        checked ? 'bg-blue-500 border-blue-500' : 'border-gray-600 bg-gray-800'
      }`}>
        {checked && <Check size={12} color="#ffffff" />}
      </View>
      <Text className="text-white text-sm font-geist-regular flex-1 leading-5">
        {label}
      </Text>
    </TouchableOpacity>
  );

  const EditableTextArea = ({ label, value, onChange }: {
    label: string;
    value: string;
    onChange: (text: string) => void;
  }) => (
    <View className="mb-4">
      <Text className="text-gray-300 text-base font-geist-medium mb-2">{label}</Text>
      <TextInput
        className="border border-gray-600 rounded-lg bg-gray-800 px-3 py-3 text-white text-base min-h-[100px]"
        value={value}
        onChangeText={onChange}
        multiline
        textAlignVertical="top"
        placeholder="Enter information..."
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );

  // Render content based on edit mode
  const renderContent = () => {
    if (isEditMode) {
      return (
        <>
          {/* Basic Information - Read Only */}
          <View className="px-6 mb-6">
            <InfoCard title="Basic Information">
              <DetailRow label="Name" value={neighborhoodData.name} />
              <DetailRow label="Registered At" value={neighborhoodData.registeredAt} />
              <DetailRow label="Terminal ID" value={neighborhoodData.terminalID} />
              <DetailRow label="Terminal Address" value={neighborhoodData.terminalAddress} />
              <DetailRow label="Coordinates" value={`${neighborhoodData.coordinates.latitude}, ${neighborhoodData.coordinates.longitude}`} />
            </InfoCard>
          </View>

          {/* Population Statistics - Editable */}
          <View className="px-6 mb-6">
            <InfoCard title="Population Statistics">
              <EditableDropdown
                label="Approx. Households"
                value={editedData.approxHouseholds.toLocaleString()}
                options={['15000', '15800', '16500', '17000', '18000']}
                onChange={(value) => handleDropdownChange('approxHouseholds', value)}
              />
              <EditableDropdown
                label="Approx. Residents"
                value={editedData.approxResidents.toLocaleString()}
                options={['70000', '71726', '73000', '75000', '80000']}
                onChange={(value) => handleDropdownChange('approxResidents', value)}
              />
              <DetailRow label="Avg. Household Size" value="4.5 members" />
            </InfoCard>
          </View>

          {/* Flood Information - Editable */}
          <View className="px-6 mb-6">
            <InfoCard title="Flood Information">
              <EditableDropdown
                label="Floodwater Subsidence Duration"
                value={editedData.floodwaterSubsidence}
                options={['1-2 hours', '2-4 hours', '4-6 hours', '6-8 hours', '8+ hours']}
                onChange={(value) => handleDropdownChange('floodwaterSubsidence', value)}
              />

              <View className="mt-4">
                <Text className="text-gray-300 text-base font-geist-medium mb-3">Flood Related Hazards:</Text>
                {editedData.floodRelatedHazards.map((hazard, index) => (
                  <EditableCheckbox
                    key={index}
                    label={hazard.label}
                    checked={hazard.checked}
                    onToggle={() => handleHazardToggle(index)}
                  />
                ))}
              </View>
            </InfoCard>
          </View>

          {/* Other Notable Information - Editable */}
          <View className="px-6 mb-8">
            <InfoCard title="Other Notable Information">
              <EditableTextArea
                label="Additional Information"
                value={editedData.notableInfo}
                onChange={handleNotableInfoChange}
              />
            </InfoCard>
          </View>

          {/* Submit/Cancel Buttons */}
          <View className="px-6 mb-8">
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-600 rounded-xl py-4 items-center"
                onPress={handleCancelEdit}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-2">
                  <X size={18} color="#ffffff" />
                  <Text className="text-white text-base font-geist-semibold">Cancel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-xl py-4 items-center"
                onPress={handleSubmitEdit}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-2">
                  <Check size={18} color="#ffffff" />
                  <Text className="text-white text-base font-geist-semibold">Submit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
      );
    }

    // View mode
    return (
      <>
        {/* Basic Information */}
        <View className="px-6 mb-6">
          <InfoCard title="Basic Information">
            <DetailRow label="Name" value={neighborhoodData.name} />
            <DetailRow label="Registered At" value={neighborhoodData.registeredAt} />
            <DetailRow label="Terminal ID" value={neighborhoodData.terminalID} />
            <DetailRow label="Terminal Address" value={neighborhoodData.terminalAddress} />
            <DetailRow label="Coordinates" value={`${neighborhoodData.coordinates.latitude}, ${neighborhoodData.coordinates.longitude}`} />
          </InfoCard>
        </View>

        {/* Population Statistics */}
        <View className="px-6 mb-6">
          <InfoCard title="Population Statistics">
            <DetailRow label="Approx. Households" value={neighborhoodData.approxHouseholds.toLocaleString()} />
            <DetailRow label="Approx. Residents" value={neighborhoodData.approxResidents.toLocaleString()} />
            <DetailRow label="Avg. Household Size" value="4.5 members" />
          </InfoCard>
        </View>

        {/* Flood Information */}
        <View className="px-6 mb-6">
          <InfoCard title="Flood Information">
            <DetailRow label="Floodwater Subsidence" value={neighborhoodData.floodwaterSubsidence} />

            <View className="mt-4">
              <Text className="text-gray-300 text-base font-geist-medium mb-2">Flood Related Hazards:</Text>
              {neighborhoodData.floodRelatedHazards.map((hazard: string, index: number) => (
                <Text key={index} className="text-white text-sm font-geist-regular mb-1 leading-5">
                  • {hazard}
                </Text>
              ))}
            </View>
          </InfoCard>
        </View>

        {/* Other Notable Information */}
        <View className="px-6 mb-8">
          <InfoCard title="Other Notable Information">
            {neighborhoodData.notableInfo.map((info: string, index: number) => (
              <Text key={index} className="text-white text-sm font-geist-regular mb-2 leading-5">
                • {info}
              </Text>
            ))}
          </InfoCard>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#1F2937', '#171717']}
        className="absolute inset-0"
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center justify-center gap-3 mb-2">
            <View className="bg-gray-700 rounded-lg p-3">
              <Radio size={28} color="#ffffff" />
            </View>
            <Text className="text-white text-3xl font-geist-bold">
              N-16
            </Text>
          </View>
          <Text className="text-gray-400 text-center text-base font-geist-regular">
            Last Registered: October 25, 2025
          </Text>
        </View>

        {/* Edit Information Button (only in view mode) */}
        {!isEditMode && (
          <View className="px-6 mb-6">
            <TouchableOpacity
              className="bg-blue-500 rounded-xl py-4 items-center"
              onPress={handleEditPress}
              activeOpacity={0.7}
            >
              <Text className="text-white text-lg font-geist-semibold">Edit Information</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dynamic Content */}
        {renderContent()}

        {/* Footer */}
        <View className="px-6 pb-8">
          <Text className="text-gray-500 text-xs font-geist-regular text-center">
            Data last updated: {lastUpdatedDate}
          </Text>
        </View>
      </ScrollView>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="slide"
        onRequestClose={closeDropdown}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-gray-800 rounded-t-3xl max-h-[60%]">
            <View className="flex-row justify-between items-center p-6 border-b border-gray-700">
              <Text className="text-white text-lg font-geist-semibold">
                {selectedDropdown?.label}
              </Text>
              <TouchableOpacity onPress={closeDropdown}>
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView className="px-6 py-2" showsVerticalScrollIndicator={false}>
              {selectedDropdown?.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  className="py-4 border-b border-gray-700"
                  onPress={() => selectDropdownOption(option)}
                >
                  <Text className="text-white text-base font-geist-regular">
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
