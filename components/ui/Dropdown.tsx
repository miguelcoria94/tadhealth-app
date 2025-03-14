import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">{label}</ThemedText>
      <Pressable 
        style={styles.dropdownButton}
        onPress={toggleDropdown}
      >
        <ThemedText style={styles.dropdownButtonText}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </ThemedText>
        <Feather 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={Colors.light.textGray[300]} 
        />
      </Pressable>
      {isOpen && (
        <View style={styles.dropdownContent}>
          {options.map((option) => (
            <Pressable
              key={option}
              style={styles.dropdownItem}
              onPress={() => handleSelect(option)}
            >
              <ThemedText style={styles.dropdownItemText}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.textGray[500] + '10',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  dropdownContent: {
    marginTop: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.textGray[500] + '20',
    zIndex: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.textGray[500] + '20',
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
}); 