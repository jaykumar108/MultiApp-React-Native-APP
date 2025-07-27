# Todo API Integration Documentation

## Overview
The Todo app has been completely updated to integrate with your backend API using the mongoose schema and Express routes you provided. The app now supports all the advanced features including categories, priorities, filtering, pagination, and real-time statistics.

## API Endpoints Integrated

### Todo Management
- `POST /api/todos` - Create new todo
- `GET /api/todos` - Get todos with filtering and pagination
- `GET /api/todos/stats` - Get todo statistics
- `GET /api/todos/:id` - Get single todo by ID
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion status

### Authentication
All todo endpoints require authentication using Bearer token in the Authorization header.

## New Features Implemented

### 1. Enhanced Todo Schema
The app now supports all fields from your mongoose schema:
- **Title** (required) - Task title
- **Description** (optional) - Detailed task description
- **Category** - work, personal, shopping, health, other
- **Priority** - low, medium, high
- **Date** (required) - Task date
- **Due Date** (optional) - Task due date
- **Attachments** - Array of attachment URLs
- **Completed** - Boolean completion status
- **IP & User Agent** - Automatically captured by backend

### 2. Advanced Filtering & Search
- **Status Filter**: All, Active, Completed
- **Category Filter**: Filter by task category
- **Priority Filter**: Filter by priority level
- **Search**: Search in title and description
- **Date Filter**: Filter by specific date
- **Sort Options**: Sort by creation date, due date, or priority
- **Sort Order**: Ascending or descending

### 3. Pagination
- **Infinite Scroll**: Load more todos as user scrolls
- **Configurable Page Size**: Default 10 items per page
- **Loading States**: Smooth loading indicators

### 4. Real-time Statistics
- **Total Tasks**: Count of all tasks
- **Active Tasks**: Count of incomplete tasks
- **Completed Tasks**: Count of completed tasks
- **Category Breakdown**: Tasks by category
- **Priority Breakdown**: Tasks by priority

### 5. Enhanced UI Components

#### TodoForm Component
- **Modal-based form** for creating/editing tasks
- **Category selection** with icons
- **Priority selection** with color coding
- **Date pickers** for task and due dates
- **Form validation** with error handling
- **Edit mode** for updating existing tasks

#### TodoItem Component
- **Rich task display** with all metadata
- **Priority badges** with color coding
- **Category badges** with icons
- **Date information** with emojis
- **Edit and delete actions**
- **Completion toggle** with visual feedback

#### TodoFilters Component
- **Basic filter tabs** for quick status filtering
- **Advanced filter modal** with all options
- **Search functionality** with clear option
- **Filter count badge** showing active filters
- **Reset and apply actions**

## File Structure

```
src/
├── services/
│   └── TodoService.ts          # API service for todos
├── components/
│   ├── TodoForm.tsx           # Todo creation/editing form
│   ├── TodoItem.tsx           # Individual todo item display
│   └── TodoFilters.tsx        # Advanced filtering component
├── screens/
│   └── TodoScreen.tsx         # Main todo screen (completely rewritten)
└── config/
    └── api.ts                 # API configuration
```

## API Configuration

### Development & Production
```typescript
DEV: {
  BASE_URL: 'https://multi-app-backend.vercel.app/api',
  AUTH_URL: 'https://multi-app-backend.vercel.app/api/auth',
  TODOS_URL: 'https://multi-app-backend.vercel.app/api/todos',
}
```

### Production
```typescript
PROD: {
  BASE_URL: 'https://multi-app-backend.vercel.app/api',
  AUTH_URL: 'https://multi-app-backend.vercel.app/api/auth',
  TODOS_URL: 'https://multi-app-backend.vercel.app/api/todos',
}
```

## Usage Examples

### Creating a Todo
```typescript
const todoData = {
  title: "Complete project documentation",
  description: "Write comprehensive documentation for the new feature",
  category: "work",
  priority: "high",
  date: new Date(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
  completed: false,
  attachments: []
};

const response = await TodoService.createTodo(todoData);
```

### Filtering Todos
```typescript
const filters = {
  page: 1,
  limit: 10,
  status: 'active',
  category: 'work',
  priority: 'high',
  search: 'project',
  sortBy: 'dueDate',
  sortOrder: 'asc'
};

const response = await TodoService.getTodos(filters);
```

### Getting Statistics
```typescript
const stats = await TodoService.getTodoStats(2024, 1); // January 2024
```

## Error Handling

The app includes comprehensive error handling:
- **Network errors** with retry logic
- **Authentication errors** with automatic logout
- **API errors** with user-friendly messages
- **Form validation** with real-time feedback
- **Loading states** to prevent multiple submissions

## Authentication Integration

The todo functionality integrates seamlessly with the existing authentication system:
- **Automatic token inclusion** in all API requests
- **Token refresh** handling
- **Authentication state** management
- **Protected routes** and components

## Performance Optimizations

- **Pagination** to handle large datasets
- **Infinite scroll** for smooth user experience
- **Optimistic updates** for better UX
- **Debounced search** to reduce API calls
- **Cached data** with refresh capabilities

## Testing the Integration

1. **Start your backend server** on port 5000
2. **Login to the app** using existing authentication
3. **Navigate to Todo screen** from the main app
4. **Create a new task** using the + button
5. **Test filtering** using the filter options
6. **Test search** functionality
7. **Test pagination** by scrolling
8. **Test edit/delete** operations
9. **Verify statistics** are updating correctly

## API Response Format Expected

The app expects API responses in this format:
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Todo data or array of todos
  },
  "totalPages": 5,
  "currentPage": 1,
  "totalItems": 50
}
```

## Troubleshooting

### Common Issues
1. **Network Error**: Ensure backend server is running on port 5000
2. **Authentication Error**: Check if user is logged in
3. **CORS Issues**: Configure backend to allow requests from the app
4. **Data Not Loading**: Check API endpoint URLs in config

### Debug Mode
Enable debug logging by checking console output for:
- API request URLs and data
- API response data
- Error messages and stack traces

## Next Steps

1. **Test the integration** with your backend
2. **Update production URLs** when deploying
3. **Add date picker components** for better date selection
4. **Implement file upload** for attachments
5. **Add push notifications** for due dates
6. **Implement offline support** with local storage 