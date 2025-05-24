import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from './ThemeContext';

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { font } = useTheme();

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const subscriber = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('notes')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          const notesList = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate?.() || null,
              updatedAt: data.updatedAt?.toDate?.() || null,
            };
          });
          setNotes(notesList);
          setLoading(false);
        },
        (error) => {
          console.error(error);
          Alert.alert('Lỗi', 'Không thể tải danh sách ghi chú');
          setLoading(false);
        }
      );

    return () => subscriber();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 16 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, fontFamily: font }}>Cài đặt</Text>
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: '#007AFF' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontFamily: font },
    });
  }, [navigation, font]);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(search.toLowerCase()) ||
    note.content?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() =>
        navigation.navigate('Note', {
          noteId: item.id,
          title: item.title,
          content: item.content,
        })
      }
    >
      <Text style={[styles.noteTitle, { fontFamily: font }]}>{item.title}</Text>
      <Text style={[styles.noteContent, { fontFamily: font }]} numberOfLines={2}>
        {item.content}
      </Text>
      {item.createdAt && (
        <Text style={[styles.noteMeta, { fontFamily: font }]}>
          Tạo lúc: {formatDate(item.createdAt)}
        </Text>
      )}
      {item.updatedAt && (
        <Text style={[styles.noteMeta, { fontFamily: font }]}>
          Cập nhật: {formatDate(item.updatedAt)}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.searchInput, { fontFamily: font }]}
        placeholder="Tìm kiếm ghi chú..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredNotes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Note')}
        >
          <Text style={[styles.addButtonText, { fontFamily: font }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    margin: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  noteItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
  },
  noteMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
