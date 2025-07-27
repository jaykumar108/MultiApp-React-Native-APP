import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Todo } from '../services/TodoService';

interface TodoFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (todoData: Omit<Todo, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Todo>;
  isEditing?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<Todo['category']>(initialData?.category || 'other');
  const [priority, setPriority] = useState<Todo['priority']>(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialData?.dueDate ? new Date(initialData.dueDate as string) : undefined
  );
  const [date, setDate] = useState<Date>(
    initialData?.date ? new Date(initialData.date as string) : new Date()
  );

  const categories: Todo['category'][] = ['work', 'personal', 'shopping', 'health', 'other'];
  const priorities: Todo['priority'][] = ['low', 'medium', 'high'];

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the task');
      return;
    }

    const todoData: Omit<Todo, '_id' | 'user' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      dueDate,
      date,
      completed: false,
      attachments: [],
    };

    onSubmit(todoData);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('other');
    setPriority('medium');
    setDueDate(undefined);
    setDate(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getCategoryIcon = (cat: Todo['category']) => {
    switch (cat) {
      case 'work':
        return 'briefcase';
      case 'personal':
        return 'person';
      case 'shopping':
        return 'cart';
      case 'health':
        return 'fitness';
      case 'other':
        return 'ellipsis-horizontal';
      default:
        return 'ellipsis-horizontal';
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Task' : 'Add New Task'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.inputLabel}>Task Title *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter task title..."
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            {/* Description */}
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              placeholder="Enter task description..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />

            {/* Category */}
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.optionsContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.optionButton,
                    category === cat && styles.optionButtonActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Ionicons
                    name={getCategoryIcon(cat) as any}
                    size={16}
                    color={category === cat ? '#fff' : '#007bff'}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      category === cat && styles.optionTextActive,
                    ]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Priority */}
            <Text style={styles.inputLabel}>Priority</Text>
            <View style={styles.optionsContainer}>
              {priorities.map((pri) => (
                <TouchableOpacity
                  key={pri}
                  style={[
                    styles.optionButton,
                    priority === pri && styles.optionButtonActive,
                    { borderColor: getPriorityColor(pri) },
                  ]}
                  onPress={() => setPriority(pri)}
                >
                  <View
                    style={[
                      styles.priorityIndicator,
                      { backgroundColor: getPriorityColor(pri) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      priority === pri && styles.optionTextActive,
                    ]}
                  >
                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date */}
            <Text style={styles.inputLabel}>Date</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => {
                // For now, we'll set a default date
                // In a real app, you'd use a date picker
                setDate(new Date());
              }}
            >
              <Ionicons name="calendar-outline" size={20} color="#007bff" />
              <Text style={styles.dateTimeButtonText}>
                {formatDate(date)}
              </Text>
            </TouchableOpacity>

            {/* Due Date */}
            <Text style={styles.inputLabel}>Due Date (Optional)</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => {
                // For now, we'll set a default date
                // In a real app, you'd use a date picker
                setDueDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow
              }}
            >
              <Ionicons name="calendar-outline" size={20} color="#007bff" />
              <Text style={styles.dateTimeButtonText}>
                {dueDate ? formatDate(dueDate) : 'Select Due Date'}
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Update Task' : 'Add Task'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  modalInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 6,
  },
  optionButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextActive: {
    color: '#fff',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TodoForm; 