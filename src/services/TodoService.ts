import { getApiConfig } from '../config/api';
import AuthService from './AuthService';

export interface Todo {
  _id?: string;
  user?: string | any;
  date: Date | string;
  title: string;
  description?: string;
  category: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  dueDate?: Date | string | null;
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
  completed: boolean;
  ip?: string;
  userAgent?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface TodoFilters {
  page?: number;
  limit?: number;
  status?: 'completed' | 'active' | 'all';
  category?: string;
  priority?: string;
  year?: number;
  month?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  date?: string;
}

export interface TodoResponse {
  success: boolean;
  message: string;
  data?: Todo | Todo[] | TodoStats;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
}

class TodoService {
  private static instance: TodoService;
  private baseUrl: string;

  private constructor() {
    const config = getApiConfig();
    this.baseUrl = config.TODOS_URL;
  }

  static getInstance(): TodoService {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    data?: any,
    queryParams?: Record<string, any>
  ): Promise<TodoResponse> {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      let url = `${this.baseUrl}${endpoint}`;
      
      // Add query parameters
      if (queryParams) {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      const config: RequestInit = {
        method,
        headers,
      };

      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }

      console.log('Making Todo API request to:', url);
      console.log('Request method:', method);
      console.log('Request data:', data);

      const response = await fetch(url, config);
      const responseData = await response.json();

      console.log('Todo API Response status:', response.status);
      console.log('Todo API Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Network error occurred');
      }

      return {
        success: true,
        message: responseData.message || 'Success',
        data: responseData.data || responseData.todos || responseData,
        totalPages: responseData.totalPages,
        currentPage: responseData.currentPage,
        totalItems: responseData.totalItems,
      };
    } catch (error: any) {
      console.error('Todo API Error:', error);
      throw error;
    }
  }

  // Create new todo
  async createTodo(todoData: Omit<Todo, '_id' | 'user' | 'createdAt' | 'updatedAt'>): Promise<TodoResponse> {
    return this.makeRequest('/', 'POST', todoData);
  }

  // Get todos with filtering and pagination
  async getTodos(filters: TodoFilters = {}): Promise<TodoResponse> {
    return this.makeRequest('/', 'GET', undefined, filters);
  }

  // Get todo statistics
  async getTodoStats(year?: number, month?: number): Promise<TodoResponse> {
    const params: Record<string, any> = {};
    if (year) params.year = year;
    if (month) params.month = month;
    return this.makeRequest('/stats', 'GET', undefined, params);
  }

  // Get single todo by ID
  async getTodoById(id: string): Promise<TodoResponse> {
    return this.makeRequest(`/${id}`, 'GET');
  }

  // Update todo
  async updateTodo(id: string, todoData: Partial<Todo>): Promise<TodoResponse> {
    return this.makeRequest(`/${id}`, 'PUT', todoData);
  }

  // Delete todo
  async deleteTodo(id: string): Promise<TodoResponse> {
    return this.makeRequest(`/${id}`, 'DELETE');
  }

  // Toggle todo completion status
  async toggleTodoStatus(id: string): Promise<TodoResponse> {
    return this.makeRequest(`/${id}/toggle`, 'PATCH');
  }
}

export default TodoService.getInstance(); 