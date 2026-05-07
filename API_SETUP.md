# Frontend API Integration Setup

## Overview
This React frontend is configured to work with a backend API at `http://localhost:4000` with JWT authentication and MongoDB data persistence.

## Project Structure
```
src/
├── components/
│   ├── Login.jsx          # Login/Signup form component
│   ├── PostForm.jsx       # Form to create/submit posts
│   └── PostsList.jsx      # Display fetched posts
├── context/
│   └── AuthContext.jsx    # JWT token & auth state management
├── services/
│   └── apiService.js      # API calls with axios interceptors
├── App.jsx                # Main app component
└── index.css              # Global styles
```

## Key Features

### 1. JWT Authentication
- **Login/Signup**: Email and password-based authentication
- **Token Storage**: JWT token stored in localStorage
- **Auto Headers**: Token automatically added to all API requests
- **Session Management**: User info persisted across page refreshes

### 2. API Service (apiService.js)
Features:
- Axios instance with base URL `http://localhost:4000`
- Request interceptor: Automatically adds JWT token to headers
- Response interceptor: Handles 401 errors (token expiration)
- Organized API methods for auth and posts

### 3. Auth Context (AuthContext.jsx)
Provides:
- `useAuth()` hook for accessing auth state
- `login(email, password)` - User login
- `signup(email, password)` - New user registration
- `logout()` - Clear session
- Loading and error states

### 4. Components

#### Login.jsx
- Login and Signup toggle
- Email/password inputs
- Error handling
- Loading states

#### PostForm.jsx
- Create new posts with:
  - Title (required)
  - URL (required)
  - Points (optional, defaults to 0)
- Success/error feedback
- Form reset on successful submission

#### PostsList.jsx
- Fetch and display all posts
- Shows:
  - Post title (clickable link)
  - URL
  - Points
  - Author
  - Posted timestamp (formatted)
- Auto-refresh on new post creation
- Loading and error states

## Backend API Requirements

### Authentication Endpoints

#### POST /api/auth/signup
Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

#### POST /api/auth/login
Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

### Post Endpoints

#### POST /api/posts
**Authorization**: Required (Bearer token)

Request:
```json
{
  "title": "Post Title",
  "url": "https://example.com",
  "points": 100
}
```
Response:
```json
{
  "_id": "post_id",
  "title": "Post Title",
  "url": "https://example.com",
  "points": 100,
  "author": "user@example.com",
  "postedAt": "2024-01-15T10:30:00Z"
}
```

#### GET /api/posts
**Authorization**: Required (Bearer token)

Response:
```json
[
  {
    "_id": "post_id",
    "title": "Post Title",
    "url": "https://example.com",
    "points": 100,
    "author": "user@example.com",
    "postedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### GET /api/posts/:id
**Authorization**: Required (Bearer token)

Response: Single post object

#### PUT /api/posts/:id
**Authorization**: Required (Bearer token)

Request: Updated post data

#### DELETE /api/posts/:id
**Authorization**: Required (Bearer token)

Response: Success message or deleted post

## Running the Application

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Environment Setup

Make sure your backend API is running on `http://localhost:4000`

To change the API URL, edit [src/services/apiService.js](src/services/apiService.js):
```javascript
const API_BASE_URL = 'http://localhost:4000'; // Change this URL
```

## Authentication Flow

```
User enters email/password
           ↓
Frontend calls /api/auth/login or /api/auth/signup
           ↓
Backend verifies credentials
           ↓
Backend generates JWT token
           ↓
Frontend receives token and user data
           ↓
Stores token in localStorage
           ↓
Token automatically added to all API requests
```

## Data Flow - Creating a Post

```
User fills form (title, url, points)
           ↓
Clicks "Create Post"
           ↓
POST /api/posts with form data
           ↓
Backend saves to MongoDB
           ↓
Backend returns saved post with metadata
           ↓
Frontend shows success message
           ↓
Automatically refreshes posts list
```

## Data Flow - Fetching Posts

```
Page loads or user creates new post
           ↓
GET /api/posts
           ↓
Backend queries MongoDB
           ↓
Returns array of posts
           ↓
Frontend displays posts with:
  - Title (clickable link)
  - URL
  - Points
  - Author
  - Posted timestamp
```

## Error Handling

- **401 Unauthorized**: Token expired → Auto logout
- **Network Errors**: Displayed to user with retry option
- **Validation Errors**: Backend error message shown in form
- **Loading States**: UI disabled during API calls

## Using the useAuth Hook

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, token, isAuthenticated, login, logout, loading, error } = useAuth();
  
  // Use auth state and methods
}
```

## Styling

- **Framework**: Tailwind CSS (v4)
- **Components**: Pre-styled with Tailwind utility classes
- **Responsive**: Mobile-first design
- **Colors**: Blue primary theme, red for alerts

## Next Steps

1. Set up the backend API with the endpoints mentioned above
2. Configure MongoDB connection
3. Start the frontend dev server
4. Test login/signup
5. Test creating and fetching posts
