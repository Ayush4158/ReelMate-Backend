# Zomato Reel Clone - Backend

Backend service for the Zomato Reel Clone application, built with Node.js, Express, and MongoDB.

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication
- Bcrypt for Password Hashing
- Cookie-based Session Management

## 📝 API Documentation

### Authentication APIs

#### User Authentication Endpoints

##### Register User
```http
POST /api/auth/user/register
```
Register a new user account
- Body:
  ```json
  {
    "fullname": "string",
    "email": "string",
    "password": "string"
  }
  ```
- Response: 201 Created
  ```json
  {
    "message": "User created successfully",
    "user": {
      "_id": "string",
      "email": "string",
      "fullname": "string"
    }
  }
  ```

##### Login User
```http
POST /api/auth/user/login
```
Login with user credentials
- Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- Response: 200 OK
  ```json
  {
    "message": "Logged in successfully",
    "user": {
      "_id": "string",
      "email": "string",
      "fullname": "string"
    }
  }
  ```

##### Get Current User
```http
GET /api/auth/me/user
```
Get current user profile
- Headers: Requires auth cookie
- Response: 200 OK
  ```json
  {
    "user": {
      "_id": "string",
      "email": "string",
      "fullname": "string"
    }
  }
  ```

##### Logout User
```http
GET /api/auth/user/logout
```
Logout current user
- Response: 200 OK
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Food Partner Authentication Endpoints

##### Register Food Partner
```http
POST /api/auth/partner/register
```
Register a new food partner account
- Body:
  ```json
  {
    "restaurantName": "string",
    "email": "string",
    "password": "string",
    "location": "string"
  }
  ```

##### Login Food Partner
```http
POST /api/auth/partner/login
```
Login with food partner credentials
- Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

##### Get Food Partner Profile
```http
GET /api/auth/me/partner
```
Get current food partner profile
- Headers: Requires auth cookie

##### Logout Food Partner
```http
GET /api/auth/partner/logout
```
Logout current food partner

### Food Management APIs

##### Create Food
```http
POST /api/food/create
```
Create a new food item
- Headers: Requires food partner auth
- Body: multipart/form-data
  ```
  name: string
  description: string
  price: number
  image: File
  video: File
  ```

##### Get All Foods
```http
GET /api/food/all
```
Get all food items with pagination
- Query Parameters:
  - page: number
  - limit: number

##### Get Food by ID
```http
GET /api/food/:id
```
Get specific food item details

### User Interaction APIs

##### Like Food
```http
POST /api/food/like/:id
```
Like a food item
- Headers: Requires user auth

##### Save Food
```http
POST /api/food/save/:id
```
Save a food item
- Headers: Requires user auth

##### Get Saved Foods
```http
GET /api/food/saved
```
Get user's saved food items
- Headers: Requires user auth

## 📁 Project Structure

```
src/
├── app.js              # Express app setup
├── controllers/        # Route controllers
│   ├── auth.controller.js
│   ├── food.controller.js
│   └── foodPartner.controller.js
├── db/                # Database configuration
│   └── db.js
├── middlewares/       # Custom middlewares
│   └── auth.middleware.js
├── models/           # Mongoose models
│   ├── food.model.js
│   ├── foodPartner.model.js
│   ├── likes.model.js
│   ├── save.model.js
│   └── user.model.js
├── routes/           # API routes
│   ├── auth.route.js
│   ├── food.route.js
│   └── foodPartner.route.js
└── services/         # Business logic services
    └── storage.service.js
```

## 🔒 Middleware Documentation

### Auth Middleware

#### `authUserMiddleware`
Protects routes that require user authentication
- Validates JWT token from cookies
- Attaches user object to request
- Usage: `authUserMiddleware` in protected routes

#### `authFoodPartnerMiddleware`
Protects routes that require food partner authentication
- Validates JWT token from cookies
- Attaches foodPartner object to request
- Usage: `authFoodPartnerMiddleware` in protected routes

## 💾 Models

### User Model
```javascript
{
  fullname: String,
  email: String,
  password: String,
  createdAt: Date
}
```

### Food Partner Model
```javascript
{
  restaurantName: String,
  email: String,
  password: String,
  location: String,
  createdAt: Date
}
```

### Food Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String,
  video: String,
  partner: ObjectId,
  createdAt: Date
}
```

## 🚀 Getting Started

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env file
cp .env.example .env

# Add required variables
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## 🔐 Security Features

- JWT-based authentication
- HTTP-only cookies
- Password hashing with bcrypt
- Protected routes with middleware
- Input validation
- CORS configuration
- Rate limiting
- Secure cookie options

## 📝 Environment Variables

| Variable      | Description           | Default     |
|---------------|-----------------------|-------------|
| PORT          | Server port           | 8080        |
| MONGODB_URI   | MongoDB connection URL| -           |
| JWT_SECRET    | JWT signing key       | -           |
| NODE_ENV      | Environment mode      | development |