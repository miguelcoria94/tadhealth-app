// components/FileUploadForms.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';

// Mock function to simulate file upload
const uploadFile = async (file: DocumentPicker.DocumentResult) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: file.assets?.[0].name || 'Unknown file',
    type: file.assets?.[0].mimeType || 'application/octet-stream',
    uploadedAt: new Date().toISOString()
  };
};

interface FileInfo {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
}

export default function FileUploadForms() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      // Check file size (max 10MB)
      const fileSize = result.assets[0].size || 0;
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      
      if (fileSize > maxSize) {
        Alert.alert('File too large', 'Please upload files smaller than 10MB.');
        return;
      }

      setIsUploading(true);
      try {
        const uploadedFile = await uploadFile(result);
        setFiles(prev => [...prev, uploadedFile]);
      } catch (error) {
        Alert.alert('Upload failed', 'Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Upload Button */}
      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={handleFilePick}
        disabled={isUploading}
      >
        <Feather name="upload" size={24} color={Colors.light.background} />
        <ThemedText style={styles.uploadButtonText}>
          {isUploading ? 'Uploading...' : 'Upload Form'}
        </ThemedText>
      </TouchableOpacity>

      {/* File List */}
      {files.map((file) => (
        <ThemedView key={file.id} variant="elevated" style={styles.fileItem}>
          <View style={styles.fileInfo}>
            <Feather name="file-text" size={20} color={Colors.light.textGray[300]} />
            <View style={styles.fileDetails}>
              <ThemedText style={styles.fileName}>{file.name}</ThemedText>
              <ThemedText style={styles.fileDate}>
                Uploaded {formatDate(file.uploadedAt)}
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteFile(file.id)}
            style={styles.deleteButton}
          >
            <Feather name="trash-2" size={20} color={Colors.light.pink[100]} />
          </TouchableOpacity>
        </ThemedView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.green[200],
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  uploadButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: Colors.light.textGray[100],
    marginBottom: 4,
  },
  fileDate: {
    fontSize: 12,
    color: Colors.light.textGray[300],
  },
  deleteButton: {
    padding: 8,
  },
});