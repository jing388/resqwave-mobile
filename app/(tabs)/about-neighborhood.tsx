import { Dropdown } from '@/components/dropdown';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Pencil, Radio, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NeighborhoodData {
  id: string;
  name: string;
  registeredAt: string;
  lastUpdatedAt: string;
  terminalID: string;
  terminalAddress: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  approxHouseholds: number;
  approxResidents: number;
  avgHouseholdSize: number;
  floodwaterSubsidence: string;
  floodRelatedHazards: string[];
  notableInfo: string[];
  focalPerson: {
    name: string;
    avatar?: string;
    contactNo: string;
    email: string;
  };
  alternativeFocalPerson: {
    name: string;
    avatar?: string;
    contactNo: string;
    email: string;
  };
}

interface FloodHazard {
  label: string;
  checked: boolean;
}

export default function AboutNeighborhoodScreen() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodData | null>(null);
  
  // Reanimated values for header
  const scrollY = useSharedValue(0);
  const HEADER_HEIGHT = 100;

  // Available hazard options (this can also come from backend)
  const availableHazards = [
    "Strong Water Current (Malakas na agos ng tubig)",
    "Risk of landslide or erosion (Panganib ng landslide o erosion)",
    "Drainage overflow or canal blockage (Pag-apaw ng drainage o bara sa kanal)",
    "Roads became impassable (Mga kalsada ay hindi madaanan)",
    "Electrical wires or exposed cables (Mga kable o wire na nakalantad)"
  ];

  // Editable data state
  const [editedData, setEditedData] = useState({
    approxHouseholds: 0,
    approxResidents: 0,
    avgHouseholdSize: 0,
    floodwaterSubsidence: "",
    floodRelatedHazards: [] as FloodHazard[],
    notableInfo: ""
  });

  // Fetch neighborhood data from backend
  useEffect(() => {
    fetchNeighborhoodData();
  }, []);

  const fetchNeighborhoodData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_URL}/neighborhoods/${neighborhoodId}`);
      // const data = await response.json();
      
      // Mock data - replace with actual API response
      const mockData: NeighborhoodData = {
        id: "N-16",
        name: "N-16",
        registeredAt: "August 10, 2023",
        lastUpdatedAt: "September 25, 2023",
        terminalID: "RSQW-001",
        terminalAddress: "Barangay 175 Subdivision, Camarin, Caloocan City North",
        coordinates: {
          latitude: 14.765,
          longitude: 121.0392
        },
        approxHouseholds: 15800,
        approxResidents: 71726,
        avgHouseholdSize: 4.5,
        floodwaterSubsidence: "2-4 hours",
        floodRelatedHazards: [
          "Strong Water Current (Malakas na agos ng tubig)",
          "Drainage overflow or canal blockage (Pag-apaw ng drainage o bara sa kanal)",
          "Electrical wires or exposed cables (Mga kable o wire na nakalantad)"
        ],
        notableInfo: [
          "Contains multiple residential subdivisions",
        ],
        focalPerson: {
          name: "Juan Dela Cruz",
          contactNo: "+63 912 345 6789",
          email: "juan.delacruz@resqwave.ph"
        },
        alternativeFocalPerson: {
          name: "Maria Santos",
          contactNo: "+63 923 456 7890",
          email: "maria.santos@resqwave.ph"
        }
      };

      setNeighborhoodData(mockData);
      
      // Initialize edited data with fetched data
      setEditedData({
        approxHouseholds: mockData.approxHouseholds,
        approxResidents: mockData.approxResidents,
        avgHouseholdSize: mockData.avgHouseholdSize,
        floodwaterSubsidence: mockData.floodwaterSubsidence,
        floodRelatedHazards: availableHazards.map(hazard => ({
          label: hazard,
          checked: mockData.floodRelatedHazards.some(h => hazard.includes(h) || h.includes(hazard.split(' (')[0]))
        })),
        notableInfo: mockData.notableInfo.join('\n')
      });
    } catch (error) {
      console.error('Error fetching neighborhood data:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  // Handler functions
  const handleEditPress = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset edited data to original values from fetched data
    if (neighborhoodData) {
      setEditedData({
        approxHouseholds: neighborhoodData.approxHouseholds,
        approxResidents: neighborhoodData.approxResidents,
        avgHouseholdSize: neighborhoodData.avgHouseholdSize,
        floodwaterSubsidence: neighborhoodData.floodwaterSubsidence,
        floodRelatedHazards: availableHazards.map(hazard => ({
          label: hazard,
          checked: neighborhoodData.floodRelatedHazards.some(h => hazard.includes(h) || h.includes(hazard.split(' (')[0]))
        })),
        notableInfo: neighborhoodData.notableInfo.join('\n')
      });
    }
  };

  const handleSubmitEdit = async () => {
    try {
      // Prepare data for API
      const updatedData = {
        approxHouseholds: editedData.approxHouseholds,
        approxResidents: editedData.approxResidents,
        avgHouseholdSize: editedData.avgHouseholdSize,
        floodwaterSubsidence: editedData.floodwaterSubsidence,
        floodRelatedHazards: editedData.floodRelatedHazards
          .filter(h => h.checked)
          .map(h => h.label.split(' (')[0]),
        notableInfo: editedData.notableInfo.split('\n').filter(line => line.trim() !== '')
      };

      console.log('Submitting edited data:', updatedData);

      // TODO: Replace with actual API call
      // const response = await fetch(`${API_URL}/neighborhoods/${neighborhoodData?.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${authToken}`
      //   },
      //   body: JSON.stringify(updatedData)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to update neighborhood data');
      // }
      //
      // const result = await response.json();

      // Update local state with new data
      if (neighborhoodData) {
        const now = new Date().toISOString();
        setNeighborhoodData({
          ...neighborhoodData,
          ...updatedData,
          lastUpdatedAt: now
        });
      }

      setIsEditMode(false);
      // TODO: Show success message to user
    } catch (error) {
      console.error('Error updating neighborhood data:', error);
      // TODO: Show error message to user
    }
  };

  const handleDropdownChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: field === 'approxHouseholds' || field === 'approxResidents' ? parseInt(value) : 
               field === 'avgHouseholdSize' ? parseFloat(value) : value
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

  const DetailRow = ({ label, value, showAvatar }: { label: string; value: string | number; showAvatar?: boolean }) => (
    <View className="flex-row justify-between gap-4">
      <Text className="text-white text-base font-geist-medium flex-shrink-0" style={{ width: '35%' }}>
        {label}
      </Text>
      <View className="flex-1 flex-row items-center justify-end gap-2">
        {showAvatar && (
          <View className="w-6 h-6 rounded-full bg-gray-600 items-center justify-center">
            <Text className="text-white text-xs font-geist-semibold">
              {String(value).charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text className="text-white text-base font-geist-regular text-right">
          {value}
        </Text>
      </View>
    </View>
  );

  const InfoCard = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
    <View className={`bg-gray-800/50 rounded-xl p-6 mb-4 border border-gray-700 ${className || ''}`}>
      <Text className="text-background-muted text-sm font-geist-medium spacing-10 tracking-wide">{title}</Text>
      {children}
    </View>
  );

  const Separator = () => <View className="h-[1px] bg-gray-700" />;

  // Dropdown options - can be fetched from backend config
  const dropdownOptions = {
    households: [
      { label: '10,000', value: '10000' },
      { label: '12,000', value: '12000' },
      { label: '15,000', value: '15000' },
      { label: '15,800', value: '15800' },
      { label: '16,500', value: '16500' },
      { label: '17,000', value: '17000' },
      { label: '18,000', value: '18000' },
      { label: '20,000', value: '20000' }
    ],
    residents: [
      { label: '50,000', value: '50000' },
      { label: '60,000', value: '60000' },
      { label: '70,000', value: '70000' },
      { label: '71,726', value: '71726' },
      { label: '73,000', value: '73000' },
      { label: '75,000', value: '75000' },
      { label: '80,000', value: '80000' },
      { label: '90,000', value: '90000' }
    ],
    householdSize: [
      { label: '3.0 members', value: '3.0' },
      { label: '3.5 members', value: '3.5' },
      { label: '4.0 members', value: '4.0' },
      { label: '4.5 members', value: '4.5' },
      { label: '5.0 members', value: '5.0' },
      { label: '5.5 members', value: '5.5' },
      { label: '6.0 members', value: '6.0' }
    ],
    subsidenceDuration: [
      { label: 'Less than 1 hour', value: 'Less than 1 hour' },
      { label: '1-2 hours', value: '1-2 hours' },
      { label: '2-4 hours', value: '2-4 hours' },
      { label: '4-6 hours', value: '4-6 hours' },
      { label: '6-8 hours', value: '6-8 hours' },
      { label: '8-12 hours', value: '8-12 hours' },
      { label: 'More than 12 hours', value: 'More than 12 hours' }
    ]
  };

  const EditableDropdown = ({ label, value, options, onChange }: {
    label: string;
    value: string | number;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
  }) => (
    <View className="mb-4">
      <Text className="text-gray-300 text-base font-geist-medium mb-2">{label}</Text>
      <Dropdown
        options={options}
        selectedValue={String(value)}
        onValueChange={onChange}
        placeholder={`Select ${label.toLowerCase()}`}
      />
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
    if (!neighborhoodData) return null;

    if (isEditMode) {
      return (
        <>
          {/* Basic Information - Read Only */}
          <View className="px-6 mb-6">
            <InfoCard title="ABOUT THE NEIGHBORHOOD">
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
                value={String(editedData.approxHouseholds)}
                options={dropdownOptions.households}
                onChange={(value) => handleDropdownChange('approxHouseholds', value)}
              />
              <EditableDropdown
                label="Approx. No. of Residents"
                value={String(editedData.approxResidents)}
                options={dropdownOptions.residents}
                onChange={(value) => handleDropdownChange('approxResidents', value)}
              />
              <EditableDropdown
                label="Avg. Household Size"
                value={String(editedData.avgHouseholdSize)}
                options={dropdownOptions.householdSize}
                onChange={(value) => handleDropdownChange('avgHouseholdSize', value)}
              />
            </InfoCard>
          </View>

          {/* Flood Information - Editable */}
          <View className="px-6 mb-6">
            <InfoCard title="Flood Information">
              <EditableDropdown
                label="Floodwater Subsidence Duration"
                value={editedData.floodwaterSubsidence}
                options={dropdownOptions.subsidenceDuration}
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
        {/* Neighborhood Information - Consolidated Section */}
        <View className="px-6">
          <InfoCard title="NEIGHBORHOOD INFORMATION">
            <View className="gap-4 mt-4">
              
              {/* Neighborhood ID */}
              <DetailRow label="Neighborhood ID" value={neighborhoodData.id} />
              <Separator />

              {/* Registered At */}
              <DetailRow label="Registered At" value={neighborhoodData.registeredAt} />
              <Separator />

              {/* Terminal ID */}
              <DetailRow label="Terminal ID" value={neighborhoodData.terminalID} />
              <Separator />

              {/* Terminal Address */}
              <DetailRow label="Terminal Address" value={neighborhoodData.terminalAddress} />
              <Separator />

              {/* Coordinates */}
              <DetailRow label="Coordinates" value={`${neighborhoodData.coordinates.latitude}, ${neighborhoodData.coordinates.longitude}`} />
              <Separator />

              {/* Approx. Residents */}
              <DetailRow label="Approximate Number of Residents" value={neighborhoodData.approxResidents.toLocaleString()} />
              <Separator />

              {/* Avg. Household Size */}
              <DetailRow label="Approximate Number of Household" value={`${neighborhoodData.avgHouseholdSize} members`} />
              <Separator />

              {/* Floodwater Subsidence */}
              <DetailRow label="Floodwater Subsidence" value={neighborhoodData.floodwaterSubsidence} />
            </View>

            {/* Flood-Related Hazards */}
            <View className="mt-6">
              <Text className="text-background-muted text-sm font-geist-medium spacing-10 tracking-wide mb-3">
                FLOOD-RELATED HAZARDS
              </Text>
              {neighborhoodData.floodRelatedHazards.map((hazard: string, index: number) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-white text-md font-geist-regular mr-2">•</Text>
                  <Text className="text-white text-md font-geist-regular flex-1 leading-6">
                    {hazard}
                  </Text>
                </View>
              ))}
            </View>

            {/* Other Notable Information */}
            <View className="mt-4">
              <Text className="text-background-muted text-sm font-geist-medium spacing-10 tracking-wide mb-3">
                OTHER NOTABLE INFORMATION
              </Text>
              {neighborhoodData.notableInfo.map((info: string, index: number) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-white text-md font-geist-regular mr-2">•</Text>
                  <Text className="text-white text-md font-geist-regular flex-1 leading-6">
                    {info}
                  </Text>
                </View>
              ))}
            </View>
          </InfoCard>
        </View>

        {/* Focal Person Information */}
        <View className="px-6 mb-2">
          <InfoCard title="FOCAL PERSON">
            <View className="gap-4 mt-4">
              <DetailRow label="Focal Person" value={neighborhoodData.focalPerson.name} showAvatar={true} />
              <Separator />
              <DetailRow label="Contact No." value={neighborhoodData.focalPerson.contactNo} />
              <Separator />
              <DetailRow label="Email" value={neighborhoodData.focalPerson.email} />
              <Separator />
              <DetailRow label="Alternative Focal Person" value={neighborhoodData.alternativeFocalPerson.name} showAvatar={true} />
              <Separator />
              <DetailRow label="Contact No." value={neighborhoodData.alternativeFocalPerson.contactNo} />
              <Separator />
              <DetailRow label="Email" value={neighborhoodData.alternativeFocalPerson.email} />
            </View>
          </InfoCard>
        </View>
      </>
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated Header Component
  const AnimatedHeader = () => {
    if (!neighborhoodData) return null;

    // Sticky header background/border style (only shows when scrolled)
    const stickyHeaderStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollY.value,
        [0, 80],
        [0, 1],
        Extrapolation.CLAMP
      );

      return {
        opacity,
        backgroundColor: '#111827',
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
        paddingVertical: 10,
      };
    });

    // Collapsed navbar opacity (fade in when scrolling)
    const collapsedOpacity = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollY.value,
        [0, 50],
        [0, 1],
        Extrapolation.CLAMP
      );

      return { opacity };
    });

    return (
      <Animated.View 
        style={[
          stickyHeaderStyle,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            height: 90,
          }
        ]}
      >
        {/* Collapsed Navbar Content - Only visible when scrolling */}
        <Animated.View 
          style={[
            collapsedOpacity,
            {
              paddingHorizontal: 24,
              paddingVertical: 20,
              height: 70,
            }
          ]}
          pointerEvents={scrollY.value > 25 ? 'auto' : 'none'}
        >
          <View className="flex-row items-center gap-3">
            <View className="bg-gray-700 rounded-lg p-3">
              <Radio size={22} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-2xl font-geist-semibold">
                {neighborhoodData.name}
              </Text>
              <Text className="text-gray-400 text-sm font-geist-regular mt-1">
                {neighborhoodData.coordinates.latitude}, {neighborhoodData.coordinates.longitude}
              </Text>
            </View>
            {!isEditMode && (
              <TouchableOpacity
                className="bg-blue-500 rounded-lg p-3"
                onPress={handleEditPress}
                activeOpacity={0.7}
              >
                <Pencil size={20} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1F2937]" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#1F2937', '#171717']}
        className="absolute inset-0"
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text className="text-gray-400 text-base font-geist-regular mt-4">
            Loading neighborhood data...
          </Text>
        </View>
      ) : !neighborhoodData ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white text-xl font-geist-semibold mb-2">
            No Data Available
          </Text>
          <Text className="text-gray-400 text-base font-geist-regular text-center">
            Unable to load neighborhood information
          </Text>
        </View>
      ) : (
        <>
          {/* Animated Sticky Header */}
          <AnimatedHeader />

          <Animated.ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 0 }}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
          >
            {/* Header Section */}
            <View className="px-6 py-6">
              <Text className="text-white text-3xl font-geist-bold mb-2">
                About Your Neighborhood
              </Text>
              <Text className="text-gray-400 text-base font-geist-regular">
                View and manage neighborhood information
              </Text>
            </View>

            {/* Normal Header Section - Looks like part of content */}
            <View className="px-6 pb-4">
              <View className="rounded-xl overflow-hidden border border-gray-700">
                <LinearGradient
                  colors={['#2A426B', '#335082']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="p-4"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="bg-white-700 rounded-lg p-3">
                      <Radio size={22} color="#ffffff" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-2xl font-geist-semibold">
                        {neighborhoodData.name}
                      </Text>
                      <Text className="text-gray-400 text-sm font-geist-regular mt-1">
                        {neighborhoodData.coordinates.latitude}, {neighborhoodData.coordinates.longitude}
                      </Text>
                    </View>
                    {/* Edit Button */}
                    {!isEditMode && (
                      <TouchableOpacity
                        className="bg-blue-500 rounded-lg p-3"
                        onPress={handleEditPress}
                        activeOpacity={0.7}
                      >
                        <Pencil size={20} color="#ffffff" />
                      </TouchableOpacity>
                    )}
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* Dynamic Content */}
            {renderContent()}

            {/* Footer */}
            <View className="px-6 pb-6">
              <Text className="text-gray-500 text-xs font-geist-regular text-center">
                Data last updated: {formatDate(neighborhoodData.lastUpdatedAt)}
              </Text>
            </View>
          </Animated.ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
