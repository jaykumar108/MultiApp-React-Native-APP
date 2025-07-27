import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Todo } from '../services/TodoService';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
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

  const getCategoryColor = (cat: Todo['category']) => {
    switch (cat) {
      case 'work':
        return '#007bff';
      case 'personal':
        return '#6f42c1';
      case 'shopping':
        return '#fd7e14';
      case 'health':
        return '#20c997';
      case 'other':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  return (
    <View style={[styles.todoItem, todo.completed && styles.todoItemCompleted]}>
      <TouchableOpacity 
        style={styles.todoContent}
        onPress={() => onToggle(todo._id!)}
      >
        <View style={[styles.checkbox, todo.completed && styles.checkboxCompleted]}>
          {todo.completed && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </View>
        
        <View style={styles.todoTextContainer}>
          <View style={styles.todoHeader}>
            <Text style={[styles.todoTitle, todo.completed && styles.todoTextCompleted]}>
              {todo.title}
            </Text>
            <View style={styles.priorityBadge}>
              <View
                style={[
                  styles.priorityDot,
                  { backgroundColor: getPriorityColor(todo.priority) },
                ]}
              />
              <Text style={styles.priorityText}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </Text>
            </View>
          </View>

          {todo.description && (
            <Text style={[styles.todoDescription, todo.completed && styles.todoTextCompleted]}>
              {todo.description}
            </Text>
          )}

          <View style={styles.todoMeta}>
            {/* Category */}
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(todo.category) + '20' }]}>
              <Ionicons
                name={getCategoryIcon(todo.category) as any}
                size={12}
                color={getCategoryColor(todo.category)}
              />
              <Text style={[styles.categoryText, { color: getCategoryColor(todo.category) }]}>
                {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
              </Text>
            </View>

            {/* Date */}
            <Text style={styles.todoMetaText}>
              📅 {formatDate(todo.date)}
            </Text>

            {/* Due Date */}
            {todo.dueDate && (
              <Text style={styles.todoMetaText}>
                ⏰ {formatDate(todo.dueDate)}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.actionButtons}>
        {onEdit && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => onEdit(todo)}
          >
            <Ionicons name="pencil-outline" size={18} color="#007bff" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(todo._id!)}
        >
          <Ionicons name="trash-outline" size={18} color="#ff4757" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todoItemCompleted: {
    opacity: 0.7,
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dee2e6',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  todoTextContainer: {
    flex: 1,
  },
  todoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  todoDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    lineHeight: 20,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6c757d',
  },
  todoMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
  },
  todoMetaText: {
    fontSize: 11,
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 6,
  },
  deleteButton: {
    padding: 6,
  },
});

export default TodoItem; 