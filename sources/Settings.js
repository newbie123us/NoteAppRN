import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';
import { useTheme } from './ThemeContext';

const Settings = ({ navigation }) => {
  const { font, setFont, fonts } = useTheme();

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  return (
    <View style={styles.container}>  
      <Text style={[styles.title, { fontFamily: font }]}>Cài đặt</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { fontFamily: font }]}>Font chữ</Text>
        <Picker
          selectedValue={font}
          style={{ width: 150 }}
          onValueChange={setFont}
        >
          {fonts.map(f => (
            <Picker.Item key={f.value} label={f.label} value={f.value} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#ff3b30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Settings; 