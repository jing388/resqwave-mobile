import { Dropdown } from "@/components/dropdown";
import { EditedData, NeighborhoodData } from "@/types/neighborhood";
import { Check, X } from "lucide-react-native";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface DropdownOption {
  label: string;
  value: string;
}

interface NeighborhoodEditProps {
  neighborhoodData: NeighborhoodData;
  editedData: EditedData;
  dropdownOptions: {
    households: DropdownOption[];
    residents: DropdownOption[];
    householdSize: DropdownOption[];
    subsidenceDuration: DropdownOption[];
  };
  onDropdownChange: (field: string, value: string) => void;
  onHazardToggle: (index: number) => void;
  onNotableInfoChange: (text: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  DetailRow: React.ComponentType<{
    label: string;
    value: string | number;
    showAvatar?: boolean;
  }>;
  InfoCard: React.ComponentType<{
    title: string;
    children: React.ReactNode;
    className?: string;
  }>;
}

const EditableDropdown = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | number;
  options: DropdownOption[];
  onChange: (value: string) => void;
}) => (
  <View className="mb-4">
    <Text className="text-gray-300 text-base font-geist-medium mb-2">
      {label}
    </Text>
    <Dropdown
      options={options}
      selectedValue={String(value)}
      onValueChange={onChange}
      placeholder={`Select ${label.toLowerCase()}`}
    />
  </View>
);

const EditableCheckbox = ({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) => (
  <TouchableOpacity
    className="flex-row items-center py-2 mb-2"
    onPress={onToggle}
  >
    <View
      className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
        checked ? "bg-blue-500 border-blue-500" : "border-gray-600 bg-gray-800"
      }`}
    >
      {checked && <Check size={12} color="#ffffff" />}
    </View>
    <Text className="text-white text-sm font-geist-regular flex-1 leading-5">
      {label}
    </Text>
  </TouchableOpacity>
);

const EditableTextArea = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
}) => (
  <View className="mb-4">
    <Text className="text-gray-300 text-base font-geist-medium mb-2">
      {label}
    </Text>
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

export const NeighborhoodEdit: React.FC<NeighborhoodEditProps> = ({
  neighborhoodData,
  editedData,
  dropdownOptions,
  onDropdownChange,
  onHazardToggle,
  onNotableInfoChange,
  onCancel,
  onSubmit,
  DetailRow,
  InfoCard,
}) => {
  return (
    <>
      {/* Basic Information - Read Only */}
      <View className="px-6 mb-6">
        <InfoCard title="ABOUT THE NEIGHBORHOOD">
          <DetailRow label="Name" value={neighborhoodData.name} />
          <DetailRow
            label="Registered At"
            value={neighborhoodData.registeredAt}
          />
          <DetailRow label="Terminal ID" value={neighborhoodData.terminalID} />
          <DetailRow
            label="Terminal Address"
            value={neighborhoodData.terminalAddress}
          />
          <DetailRow
            label="Coordinates"
            value={`${neighborhoodData.coordinates.latitude}, ${neighborhoodData.coordinates.longitude}`}
          />
        </InfoCard>
      </View>

      {/* Population Statistics - Editable */}
      <View className="px-6 mb-6">
        <InfoCard title="Population Statistics">
          <EditableDropdown
            label="Approx. Households"
            value={String(editedData.approxHouseholds)}
            options={dropdownOptions.households}
            onChange={(value) => onDropdownChange("approxHouseholds", value)}
          />
          <EditableDropdown
            label="Approx. No. of Residents"
            value={String(editedData.approxResidents)}
            options={dropdownOptions.residents}
            onChange={(value) => onDropdownChange("approxResidents", value)}
          />
          <EditableDropdown
            label="Avg. Household Size"
            value={String(editedData.avgHouseholdSize)}
            options={dropdownOptions.householdSize}
            onChange={(value) => onDropdownChange("avgHouseholdSize", value)}
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
            onChange={(value) =>
              onDropdownChange("floodwaterSubsidence", value)
            }
          />

          <View className="mt-4">
            <Text className="text-gray-300 text-base font-geist-medium mb-3">
              Flood Related Hazards:
            </Text>
            {editedData.floodRelatedHazards.map((hazard, index) => (
              <EditableCheckbox
                key={index}
                label={hazard.label}
                checked={hazard.checked}
                onToggle={() => onHazardToggle(index)}
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
            onChange={onNotableInfoChange}
          />
        </InfoCard>
      </View>

      {/* Submit/Cancel Buttons */}
      <View className="px-6 mb-8">
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-gray-600 rounded-xl py-4 items-center"
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-2">
              <X size={18} color="#ffffff" />
              <Text className="text-white text-base font-geist-semibold">
                Cancel
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-green-500 rounded-xl py-4 items-center"
            onPress={onSubmit}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-2">
              <Check size={18} color="#ffffff" />
              <Text className="text-white text-base font-geist-semibold">
                Submit
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
