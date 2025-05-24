import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const NoteScreen = ({ route, navigation }) => {
  const { noteId, title: initialTitle, content: initialContent } = route.params || {};
  const [title, setTitle] = useState(initialTitle || '');
  const [content, setContent] = useState(initialContent || '');
  const [createdAt, setCreatedAt] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    if (noteId) {
      const user = auth().currentUser;
      if (!user) return;

      const subscriber = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('notes')
        .doc(noteId)
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              const data = doc.data();
              if (data) {
                setTitle(data.title || '');
                setContent(data.content || '');
                setCreatedAt(data.createdAt ? data.createdAt.toDate() : null);
                setUpdatedAt(data.updatedAt ? data.updatedAt.toDate() : null);
              } else {
                setTitle('');
                setContent('');
                setCreatedAt(null);
                setUpdatedAt(null);
              }
            }
          },
          (error) => {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể tải ghi chú');
          }
        );

      return () => subscriber();
    }
  }, [noteId]);

  const saveNote = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập để lưu ghi chú');
        return;
      }

      const noteData = {
        title,
        content,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (noteId) {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('notes')
          .doc(noteId)
          .update(noteData);
      } else {
        noteData.createdAt = firestore.FieldValue.serverTimestamp();
        await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('notes')
          .add(noteData);
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể lưu ghi chú');
    }
  };

  const deleteNote = async () => {
    try {
      const user = auth().currentUser;
      if (!user || !noteId) return;

      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('notes')
        .doc(noteId)
        .delete();

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể xóa ghi chú');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          {noteId && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                Alert.alert(
                  'Xác nhận',
                  'Bạn có chắc chắn muốn xóa ghi chú này?',
                  [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Xóa', onPress: deleteNote, style: 'destructive' },
                  ]
                );
              }}
            >
              <Text style={styles.deleteButtonText}>Xóa</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, noteId, title, content]);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dateContainer}>
        {createdAt && (
          <Text style={styles.dateText}>
            Tạo lúc: {formatDate(createdAt)}
          </Text>
        )}
        {updatedAt && (
          <Text style={styles.dateText}>
            Cập nhật lúc: {formatDate(updatedAt)}
          </Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Nhập tiêu đề ghi chú..."
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={styles.contentInput}
          placeholder="Nhập nội dung ghi chú..."
          placeholderTextColor="#999"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dateContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  inputContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    minHeight: 200,
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 16,
  },
  saveButton: {
    marginLeft: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginRight: 16,
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NoteScreen;