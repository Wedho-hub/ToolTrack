# ToolTrack - Tool Management System

A comprehensive tool management system built with React (frontend) and Node.js/Express (backend) that allows organizations to track, assign, and manage tools efficiently.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/register system with JWT tokens
- **Role-based Access**: Admin and Worker roles with different permissions
- **Tool Management**: Add, edit, delete, and view tools
- **Tool Assignment**: Assign tools to users and track usage
- **Real-time Status**: Track tool availability and usage status
- **Dashboard**: Personalized view of assigned tools

### User Roles
- **Admin**: Full access to manage tools, users, and assignments
- **Worker**: Can view available tools and manage their assigned tools

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for client-side routing
- **Axios** for API calls
- **Bootstrap 5** for responsive UI
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **dotenv** for environment variables

## 📁 Project Structure

```
ToolTrack/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── toolController.js  # Tool CRUD operations
│   │   └── userController.js  # User management
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── Tool.js            # Tool schema
│   │   └── User.js            # User schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── toolRoutes.js      # Tool endpoints
│   │   └── userRoutes.js      # User endpoints
│   ├── server.js              # Express server
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   ├── pages/             # Page components
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── api.js                 # API configuration
│   └── vite.config.js         # Vite configuration
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ToolTrack
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tooltrack
JWT_SECRET=your-secret-key-here
```

5. **Start the development servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Tools
- `GET /api/tools` - Get all tools
- `GET /api/tools/:id` - Get tool by ID
- `POST /api/tools` - Create new tool (admin only)
- `PUT /api/tools/:id` - Update tool (admin only)
- `DELETE /api/tools/:id` - Delete tool (admin only)
- `POST /api/tools/:id/assign` - Assign tool to user (admin only)
- `POST /api/tools/:id/return` - Return assigned tool
- `GET /api/tools/my-tools` - Get user's assigned tools

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## 🎯 Key Components Explained

### Frontend Components

#### `api.js`
Centralized API configuration with axios interceptors for:
- Automatic token attachment to requests
- Response error handling (401 redirects)
- Base URL configuration

#### `AuthContext.jsx`
Provides authentication state and methods:
- `login(token, userData)` - Handles user login
- `logout()` - Clears user session
- `user` - Current user object
- `loading` - Auth loading state

#### `ProtectedRoute.jsx`
Component wrapper for protected routes that checks authentication status.

#### `ToolForm.jsx`
Reusable form component for adding/editing tools with validation.

### Backend Architecture

#### `authMiddleware.js`
JWT verification middleware that:
- Validates tokens
- Attaches user to request object
- Handles unauthorized access

#### `Tool.js` Model
```javascript
{
  name: String,           // Tool name
  description: String,    // Tool description
  category: String,       // Tool category
  totalQuantity: Number,  // Total available
  availableQuantity: Number, // Currently available
  status: String,         // available/in-use/maintenance
  assignedTo: ObjectId    // Reference to User
}
```

#### `User.js` Model
```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email
  password: String,       // Hashed password
  role: String,           // admin/worker
  assignedTools: [ObjectId] // Array of assigned tools
}
```

## 🔄 Usage Flow

### For Admins:
1. Register as admin or login with admin credentials
2. Navigate to "Manage Tools" to add/edit/delete tools
3. Assign tools to workers from the tool management interface
4. Monitor tool usage and availability

### For Workers:
1. Register as worker or login with worker credentials
2. View available tools on the dashboard
3. Request tools from admin
4. Return tools when done

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run dev
```
Test all pages:
- Login/Register functionality
- Tool CRUD operations (admin)
- Tool assignment/return flow
- Dashboard view for different roles

### Backend Testing
```bash
cd backend
npm run dev
```
Test endpoints using tools like Postman or curl:
```bash
# Register admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@tooltrack.com","password":"admin123","role":"admin"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tooltrack.com","password":"admin123"}'
```

## 🚀 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret
```

### PM2 for Backend
```bash
npm install -g pm2
pm2 start backend/server.js --name tooltrack-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@tooltrack.com or create an issue in the GitHub repository.
