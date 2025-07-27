import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TodoFilters as TodoFiltersType } from '../services/TodoService';

interface TodoFiltersProps {
  filters: TodoFiltersType;
  onFiltersChange: (filters: TodoFiltersType) => void;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ filters, onFiltersChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState<TodoFiltersType>(filters);

  const categories = ['all', 'work', 'personal', 'shopping', 'health', 'other'];
  const priorities = ['all', 'low', 'medium', 'high'];
  const statuses = ['all', 'active', 'completed'];

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setModalVisible(false);
  };

  const resetFilters = () => {
    const resetFilters: TodoFiltersType = {
      page: 1,
      limit: 10,
      status: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    setModalVisible(false);
  };

  const updateFilter = (key: keyof TodoFiltersType, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.category) count++;
    if (filters.priority) count++;
    if (filters.search) count++;
    if (filters.year || filters.month) count++;
    return count;
  };

  return (
    <>
      <View style={styles.filterContainer}>
        {/* Basic Filter Tabs */}
        <View style={styles.basicFilters}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                filters.status === status && styles.filterTabActive,
              ]}
              onPress={() => updateFilter('status', status)}
            >
              <Text
                style={[
                  styles.filterText,
                  filters.status === status && styles.filterTextActive,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Advanced Filters Button */}
        <TouchableOpacity
          style={styles.advancedFilterButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="options-outline" size={20} color="#007bff" />
          {getFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {filters.search && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6c757d" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            value={filters.search}
            onChangeText={(text) => updateFilter('search', text)}
          />
          {filters.search && (
            <TouchableOpacity onPress={() => updateFilter('search', '')}>
              <Ionicons name="close-circle" size={20} color="#6c757d" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Advanced Filters Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Search */}
              <Text style={styles.inputLabel}>Search</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Search in title and description..."
                value={localFilters.search || ''}
                onChangeText={(text) => updateFilter('search', text)}
              />

              {/* Category Filter */}
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.optionsContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.optionButton,
                      localFilters.category === category && styles.optionButtonActive,
                    ]}
                    onPress={() => updateFilter('category', category === 'all' ? undefined : category)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localFilters.category === category && styles.optionTextActive,
                      ]}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Priority Filter */}
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.optionsContainer}>
                {priorities.map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.optionButton,
                      localFilters.priority === priority && styles.optionButtonActive,
                    ]}
                    onPress={() => updateFilter('priority', priority === 'all' ? undefined : priority)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localFilters.priority === priority && styles.optionTextActive,
                      ]}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sort Options */}
              <Text style={styles.inputLabel}>Sort By</Text>
              <View style={styles.sortContainer}>
                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    localFilters.sortBy === 'createdAt' && styles.sortButtonActive,
                  ]}
                  onPress={() => updateFilter('sortBy', 'createdAt')}
                >
                  <Text
                    style={[
                      styles.sortText,
                      localFilters.sortBy === 'createdAt' && styles.sortTextActive,
                    ]}
                  >
                    Date Created
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    localFilters.sortBy === 'dueDate' && styles.sortButtonActive,
                  ]}
                  onPress={() => updateFilter('sortBy', 'dueDate')}
                >
                  <Text
                    style={[
                      styles.sortText,
                      localFilters.sortBy === 'dueDate' && styles.sortTextActive,
                    ]}
                  >
                    Due Date
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    localFilters.sortBy === 'priority' && styles.sortButtonActive,
                  ]}
                  onPress={() => updateFilter('sortBy', 'priority')}
                >
                  <Text
                    style={[
                      styles.sortText,
                      localFilters.sortBy === 'priority' && styles.sortTextActive,
                    ]}
                  >
                    Priority
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sort Order */}
              <Text style={styles.inputLabel}>Sort Order</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    localFilters.sortOrder === 'desc' && styles.optionButtonActive,
                  ]}
                  onPress={() => updateFilter('sortOrder', 'desc')}
                >
                  <Ionicons
                    name="arrow-down"
                    size={16}
                    color={localFilters.sortOrder === 'desc' ? '#fff' : '#007bff'}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      localFilters.sortOrder === 'desc' && styles.optionTextActive,
                    ]}
                  >
                    Newest First
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    localFilters.sortOrder === 'asc' && styles.optionButtonActive,
                  ]}
                  onPress={() => updateFilter('sortOrder', 'asc')}
                >
                  <Ionicons
                    name="arrow-up"
                    size={16}
                    color={localFilters.sortOrder === 'asc' ? '#fff' : '#007bff'}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      localFilters.sortOrder === 'asc' && styles.optionTextActive,
                    ]}
                  >
                    Oldest First
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  basicFilters: {
    flex: 1,
    flexDirection: 'row',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: '#007bff',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
  },
  filterTextActive: {
    color: '#fff',
  },
  advancedFilterButton: {
    padding: 12,
    marginLeft: 8,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
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
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  sortText: {
    fontSize: 14,
    color: '#333',
  },
  sortTextActive: {
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TodoFilters; 