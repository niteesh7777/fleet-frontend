# Frontend Folder Structure Guide

## Overview
This document provides a comprehensive explanation of the frontend folder structure for the fleet management system, designed to help frontend engineers understand the architecture and organization.

## Project Structure

```
frontend/
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── eslint.config.js             # ESLint configuration
├── index.html                   # Main HTML entry point
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # Locked dependency versions
├── public/                      # Static assets folder
├── README.md                    # Project documentation
├── src/                         # Source code directory
└── vite.config.js              # Vite build configuration
```

## Source Code Structure (`/src`)

```
src/
├── App.jsx                      # Main application component
├── index.css                    # Global styles
├── main.jsx                     # Application entry point
├── api/                         # API integration layer
│   └── axiosClient.js           # Axios configuration
├── assets/                      # Static assets
│   └── react.svg               # React logo
├── components/                  # Reusable UI components
│   ├── buttons/                # Button components
│   ├── cards/                  # Card components  
│   ├── forms/                  # Form components
│   ├── modal/                  # Modal components
│   │   └── Modal.jsx           # Modal component
│   ├── tables/                 # Table components
│   └── ProtectedRoute.jsx      # Authentication wrapper
├── hooks/                       # Custom React hooks
├── layout/                      # Layout components
│   ├── DashboardLayout.jsx     # Main dashboard layout
│   └── Overview.jsx            # Overview component
├── pages/                       # Page components
│   ├── auth/                   # Authentication pages
│   │   ├── Login.jsx           # Login page
│   │   └── Register.jsx        # Register page
│   ├── dashboard/              # Dashboard pages
│   │   ├── Clients.jsx         # Clients dashboard
│   │   ├── Drivers.jsx         # Drivers dashboard
│   │   ├── MaintenanceLogs.jsx # Maintenance logs
│   │   ├── Overview.jsx        # Dashboard overview
│   │   ├── Routes.jsx          # Routes dashboard
│   │   ├── Trips.jsx           # Trips dashboard
│   │   └── Vehicles.jsx        # Vehicles dashboard
│   └── vehicles/               # Vehicle-specific pages
│       └── Vehicles.jsx        # Vehicle management
├── store/                       # State management
│   └── authStore.js            # Authentication state
└── utils/                       # Utility functions
```

## Key Files Explanation

### 1. **Entry Points**
- **`main.jsx`**: Application bootstrap file that renders the root component
- **`App.jsx`**: Main application component with routing setup
- **`index.html`**: HTML template with React mount point

### 2. **API Integration (`/api`)**
- **`axiosClient.js`**: Centralized HTTP client configuration
  - API base URL from environment variables
  - Request/response interceptors
  - Authentication token handling
  - Error handling middleware

### 3. **Components (`/components`)**
Organized by functionality:
- **`buttons/`**: Reusable button components (Primary, Secondary, etc.)
- **`cards/`**: Information display cards
- **`forms/`**: Form inputs and validation components
- **`modal/`**: Modal dialogs and popups
- **`tables/`**: Data table components with sorting/pagination
- **`ProtectedRoute.jsx`**: Authentication guard component

### 4. **Pages (`/pages`)**
Organized by feature areas:
- **`auth/`**: Authentication flows (Login, Register)
- **`dashboard/`**: Main dashboard views for different entities
- **`vehicles/`**: Vehicle-specific management interfaces

### 5. **State Management (`/store`)**
- **`authStore.js`**: Zustand-based authentication state
  - User login/logout state
  - Authentication tokens
  - User permissions and roles

### 6. **Layout (`/layout`)**
- **`DashboardLayout.jsx`**: Main application layout
  - Navigation sidebar
  - Header with user info
  - Content area wrapper
- **`Overview.jsx`**: Dashboard overview component

## Environment Configuration

### `.env` File
```bash
VITE_API_URL=http://localhost:4000/api/v1
```

**Key Points:**
- Uses Vite's environment variable convention (`VITE_`)
- API URL configured for backend integration
- Can be extended for different environments (development, staging, production)

## Technology Stack

### Core Technologies
- **React 19.2.0**: Latest React with compiler optimization
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **React Router DOM 7.9.6**: Client-side routing
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API calls

### Development Tools
- **ESLint**: Code linting and style enforcement
- **React Hot Toast**: Notification system
- **React Icons**: Icon library integration

## Styling Architecture

### TailwindCSS Integration
- Configured through `@tailwindcss/vite` plugin
- Utility-first approach for rapid UI development
- Responsive design utilities built-in
- Custom theme configuration available

### CSS Structure
- **`index.css`**: Global styles and Tailwind imports
- Component-specific styles using Tailwind classes
- Responsive design patterns throughout

## Routing Strategy

### React Router Implementation
```jsx
// Main routes defined in App.jsx
- /auth/* → Authentication pages
- /dashboard/* → Main application views
- /vehicles/* → Vehicle management
```

### Protected Routes
- **`ProtectedRoute.jsx`**: Wraps authenticated routes
- Role-based access control
- Automatic redirect to login when unauthenticated

## API Integration Pattern

### Axios Client Setup
```javascript
// axiosClient.js pattern
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**Features:**
- Automatic token injection
- Global error handling
- Request/response interceptors
- Consistent API response format

## State Management

### Zustand Store Pattern
```javascript
// authStore.js example
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false })
}));
```

**Benefits:**
- Lightweight alternative to Redux
- No boilerplate code
- React-like API
- Middleware support for persistence

## Component Architecture

### Reusable Components
- **Button Components**: Primary, Secondary, Danger variants
- **Form Components**: Input, Select, Checkbox with validation
- **Table Components**: Sortable, paginated data tables
- **Card Components**: Information display with consistent styling

### Page Components
- Feature-specific views
- Data fetching and display
- User interaction handling
- Form management and validation

## Best Practices Implemented

### 1. **Component Organization**
- Group related components in feature folders
- Reusable components in shared location
- Clear naming conventions

### 2. **Error Handling**
- Global error boundaries
- API error handling in axios interceptors
- User-friendly error messages

### 3. **Performance Optimization**
- React Compiler enabled for optimization
- Lazy loading for routes
- Efficient re-rendering with Zustand

### 4. **Security**
- Protected routes with authentication
- Token-based authentication
- Secure API client configuration

## Development Workflow

### Starting the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Code Quality
```bash
npm run lint          # ESLint checking
npm run preview       # Preview build locally
```

## Integration with Backend

### API Base URL
- Configured through environment variables
- Points to backend API at `http://localhost:4000/api/v1`
- Supports all CRUD operations for fleet management entities

### Authentication Flow
1. User logs in through `/auth/login`
2. JWT token stored in Zustand store
3. Token automatically attached to API requests
4. Protected routes check authentication status

### Data Flow
1. Components fetch data through API client
2. State management handles loading states
3. UI updates reactively based on data changes
4. Form submissions send data to backend endpoints

This structure provides a solid foundation for building and maintaining a modern React application with clear separation of concerns, reusable components, and efficient state management.
