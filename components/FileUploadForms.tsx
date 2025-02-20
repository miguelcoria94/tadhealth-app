// components/FileUploadForms.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Modal, ActivityIndicator } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';

interface FormInfo {
  id: number;
  name: string;
  type: string;
  status: 'Completed' | 'Pending' | 'Rejected';
  sharedBy: string;
  sharedDate: string;
  studentId: number;
  filePath?: string;
}

interface Props {
  studentId: number;
  existingForms: FormInfo[];
}

export default function FileUploadForms({ studentId, existingForms }: Props) {
  const [selectedForm, setSelectedForm] = useState<FormInfo | null>(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFormPress = (form: FormInfo) => {
    if (form.filePath) {
      setSelectedForm(form);
      setIsViewerVisible(true);
    }
  };

  const handleCloseViewer = () => {
    setIsViewerVisible(false);
    setSelectedForm(null);
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      setIsUploading(true);
      try {
        // Copy file to app's documents directory
        const fileName = result.assets[0].name;
        const newPath = FileSystem.documentDirectory + fileName;
        
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: newPath
        });

        Alert.alert('Success', 'File uploaded successfully!');
      } catch (error) {
        Alert.alert('Upload failed', 'Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Existing Forms */}
      {existingForms
        .filter(form => form.studentId === studentId)
        .map(form => (
          <TouchableOpacity
            key={form.id}
            onPress={() => handleFormPress(form)}
            activeOpacity={form.filePath ? 0.7 : 1}
          >
            <ThemedView variant="elevated" style={styles.formCard}>
              <View style={styles.formHeader}>
                <View style={styles.formTitleContainer}>
                  <ThemedText style={styles.formName}>{form.name}</ThemedText>
                  {form.filePath && (
                    <Feather 
                      name="file-text" 
                      size={16} 
                      color={Colors.light.textGray[300]} 
                      style={styles.formIcon}
                    />
                  )}
                </View>
                <View style={[
                  styles.statusBadge,
                  { 
                    backgroundColor: 
                      form.status === 'Completed' ? Colors.light.success :
                      form.status === 'Pending' ? Colors.light.warning :
                      Colors.light.pink[100]
                  }
                ]}>
                  <ThemedText style={styles.statusText}>{form.status}</ThemedText>
                </View>
              </View>
              <View style={styles.formDetails}>
                <ThemedText style={styles.formText}>Type: {form.type}</ThemedText>
                <ThemedText style={styles.formText}>Shared by: {form.sharedBy}</ThemedText>
                <ThemedText style={styles.formText}>Date: {formatDate(form.sharedDate)}</ThemedText>
              </View>
            </ThemedView>
          </TouchableOpacity>
        ))}

      {/* Form Viewer Modal */}
      <Modal
        visible={isViewerVisible}
        onRequestClose={handleCloseViewer}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={handleCloseViewer}
              style={styles.closeButton}
            >
              <Feather name="x" size={24} color={Colors.light.textGray[100]} />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>
              {selectedForm?.name}
            </ThemedText>
          </View>
          
          {selectedForm?.filePath && (
            <WebView
              source={{ uri: selectedForm.filePath }}
              style={styles.webview}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
                Alert.alert('Error', 'Could not load the form');
              }}
            />
          )}
        </View>
      </Modal>

      {/* Upload Section */}
      <View style={styles.divider} />
      <ThemedText type="subtitle" style={styles.sectionTitle}>Upload New Form</ThemedText>
      
      <TouchableOpacity 
        style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
        onPress={handleFilePick}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color={Colors.light.background} />
        ) : (
          <>
            <Feather name="upload" size={24} color={Colors.light.background} />
            <ThemedText style={styles.uploadButtonText}>Upload Form</ThemedText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  formCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  formTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  formName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textGray[100],
    flex: 1,
  },
  formIcon: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '600',
  },
  formDetails: {
    gap: 4,
  },
  formText: {
    fontSize: 14,
    color: Colors.light.textGray[300],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.textGray[500] + "20",
    marginVertical: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + "20",
    backgroundColor: Colors.light.background,
    height: 60,
    marginTop: 40, // Fixed top margin for header
  },
  closeButton: {
    padding: 12,
    marginLeft: -4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textGray[100],
    marginLeft: 8,
    flex: 1,
  },
  webview: {
    flex: 1,
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
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.textGray[100],
    marginBottom: 16,
  },
});