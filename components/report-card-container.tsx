import { FileText } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ReportCardContainerProps {
  id: string;
  documentName: string;
  dateAccomplished: string;
  onViewDocument: (id: string, documentName: string) => void;
  type?: string;
}

export function ReportCardContainer({
  id,
  documentName,
  dateAccomplished,
  onViewDocument,
  type
}: ReportCardContainerProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <View className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
      {/* Document Header */}
      <View className="flex-row items-start gap-3 mb-3">
        <View className="bg-blue-500/20 rounded-lg p-2">
          <FileText size={20} color="#60A5FA" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-base font-geist-semibold mb-1">
            {documentName}
          </Text>
          <Text className="text-gray-400 text-sm font-geist-regular">
            Completed on {formatDate(dateAccomplished)}
          </Text>
        </View>
      </View>

      {/* View Document Button */}
      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-2.5 px-4 self-start"
        onPress={() => onViewDocument(id, documentName)}
      >
        <Text className="text-white text-sm font-geist-semibold">
          View Document
        </Text>
      </TouchableOpacity>
    </View>
  );
}
