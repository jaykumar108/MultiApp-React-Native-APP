import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TodoService, { Todo, TodoFilters, TodoStats } from '../services/TodoService';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import TodoFiltersComponent from '../components/TodoFilters';
import { useAuth } from '../context/AuthContext';

const TodoScreen = ({ navigation }: any) => {
  const { isAuthenticated } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filters, setFilters] = useState<TodoFilters>({
    page: 1,
    limit: 10,
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load todos from API
  const loadTodos = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setFilters(prev => ({ ...prev, page: 1 }));
      } else if (filters.page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await TodoService.getTodos(filters);
      
      console.log('TodoScreen - Response:', response);
      console.log('TodoScreen - Response data:', response.data);
      console.log('TodoScreen - Response data type:', typeof response.data);
      console.log('TodoScreen - Is array:', Array.isArray(response.data));
      
      if (response.success && response.data) {
        let todoData: Todo[] = [];
        
        // Handle different response formats
        if (Array.isArray(response.data)) {
          todoData = response.data;
        } else if (response.data && typeof response.data === 'object') {
          // If it's an object with a data property
          const responseObj = response.data as any;
          if (Array.isArray(responseObj.data)) {
            todoData = responseObj.data;
          } else if (Array.isArray(responseObj.todos)) {
            todoData = responseObj.todos;
          }
        }
        
        console.log('TodoScreen - Todo data:', todoData);
        console.log('TodoScreen - Todo data length:', todoData.length);
        
        if (filters.page === 1 || isRefresh) {
          setTodos(todoData);
        } else {
          setTodos(prev => [...prev, ...todoData]);
        }

        // Check if there are more pages
        if (response.totalPages && response.currentPage) {
          setHasMore(response.currentPage < response.totalPages);
        } else {
          setHasMore(todoData.length === filters.limit);
        }
      } else {
        Alert.alert('Error', response.message || 'Failed to load todos');
      }
    } catch (error: any) {
      console.error('Error loading todos:', error);
      Alert.alert('Error', error.message || 'Failed to load todos');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [filters]);

  // Load stats from API
  const loadStats = useCallback(async () => {
    try {
      const response = await TodoService.getTodoStats();
      if (response.success && response.data) {
        setStats(response.data as TodoStats);
      }
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      loadTodos();
      loadStats();
    }
  }, [isAuthenticated]);

  // Reload when filters change
  useEffect(() => {
    if (isAuthenticated) {
      loadTodos();
    }
  }, [filters]);

  // Debug: Log when todos change
  useEffect(() => {
    console.log('TodoScreen - Todos state changed:', todos);
    console.log('TodoScreen - Todos length:', todos.length);
  }, [todos]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    loadTodos(true);
    loadStats();
  }, [loadTodos, loadStats]);

  // Load more todos
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  }, [hasMore, loadingMore]);

  // Create new todo
  const handleCreateTodo = async (todoData: Omit<Todo, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await TodoService.createTodo(todoData);
      if (response.success) {
        setModalVisible(false);
        loadTodos(true); // Refresh the list
        loadStats(); // Refresh stats
        Alert.alert('Success', 'Task created successfully!');
      } else {
        Alert.alert('Error', response.message || 'Failed to create task');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create task');
    }
  };

  // Update todo
  const handleUpdateTodo = async (todoData: Omit<Todo, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTodo?._id) return;

    try {
      const response = await TodoService.updateTodo(editingTodo._id, todoData);
      if (response.success) {
        setModalVisible(false);
        setEditingTodo(null);
        loadTodos(true); // Refresh the list
        loadStats(); // Refresh stats
        Alert.alert('Success', 'Task updated successfully!');
      } else {
        Alert.alert('Error', response.message || 'Failed to update task');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update task');
    }
  };

  // Toggle todo completion
  const handleToggleTodo = async (id: string) => {
    try {
      const response = await TodoService.toggleTodoStatus(id);
      if (response.success) {
        // Update local state immediately for better UX
        setTodos(prev => 
          prev.map(todo => 
            todo._id === id 
              ? { ...todo, completed: !todo.completed }
              : todo
          )
        );
        loadStats(); // Refresh stats
      } else {
        Alert.alert('Error', response.message || 'Failed to update task');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update task');
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await TodoService.deleteTodo(id);
              if (response.success) {
                setTodos(prev => prev.filter(todo => todo._id !== id));
                loadStats(); // Refresh stats
                Alert.alert('Success', 'Task deleted successfully!');
              } else {
                Alert.alert('Error', response.message || 'Failed to delete task');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete task');
            }
          }
        },
      ]
    );
  };

  // Edit todo
  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setModalVisible(true);
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: TodoFilters) => {
    setFilters(newFilters);
  };

  // Render todo item
  const renderTodo = ({ item }: { item: Todo }) => {
    console.log('TodoScreen - Rendering todo item:', item);
    return (
      <TodoItem
        todo={item}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
        onEdit={handleEditTodo}
      />
    );
  };

  // Render loading footer
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#007bff" />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="list-outline" size={64} color="#ddd" />
      <Text style={styles.emptyText}>No tasks found</Text>
      <Text style={styles.emptySubtext}>
        {filters.search 
          ? 'Try adjusting your search criteria'
          : 'Add a new task to get started'
        }
      </Text>
      {!filters.search && (
        <TouchableOpacity 
          style={styles.addFirstTaskButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addFirstTaskButtonText}>Add Your First Task</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && todos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <TouchableOpacity 
            style={styles.addButtonTop}
            onPress={() => {
              setEditingTodo(null);
              setModalVisible(true);
            }}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.active}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        )}

        {/* Filters */}
        <TodoFiltersComponent 
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Todo List */}
        <FlatList
          data={todos}
          renderItem={renderTodo}
          keyExtractor={item => item._id!}
          style={styles.todoList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007bff']}
              tintColor="#007bff"
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />

        {/* Todo Form Modal */}
        <TodoForm
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingTodo(null);
          }}
          onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
          initialData={editingTodo || undefined}
          isEditing={!!editingTodo}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  addButtonTop: {
    backgroundColor: '#007bff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  todoList: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#6c757d',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  addFirstTaskButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  addFirstTaskButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TodoScreen; 