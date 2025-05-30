# Book Review API

A RESTful API for managing books and reviews with user authentication.

## Features

- User authentication (JWT)
- Book management (CRUD operations)
- Review system (with rating)
- Search and filtering
- Pagination

## Database Schema

### Users
- `username` (String, unique, required)
- `email` (String, unique, required)
- `password` (String, required)

### Books
- `title` (String, required)
- `author` (String, required)
- `genre` (String, required)
- `publishedYear` (Number)
- `createdBy` (ObjectId, ref: User)
- `averageRating` (Number, calculated)
- `reviewCount` (Number, calculated)

### Reviews
- `rating` (Number, required, min:1, max:5)
- `comment` (String)
- `book` (ObjectId, ref: Book)
- `user` (ObjectId, ref: User)

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the server: `npm run dev`

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token

### Books
- `GET /api/v1/books` - Get all books (with pagination and filters and authenticated)
- `GET /api/v1/books/:id` - Get a single book with reviews (authenticated)
- `POST /api/v1/books` - Add a new book (authenticated)
- `GET /api/v1/books/search?query=...` - Search books by title or author (authenticated)

### Reviews
- `POST /api/v1/books/:id/reviews` - Add a review (authenticated)
- `PUT /api/v1/reviews/:id` - Update a review (authenticated, owner only)
- `DELETE /api/v1/reviews/:id` - Delete a review (authenticated, owner only)

## Example Requests

[View the API request Postman collection](./BookReviewAPI.postman_collection.json)


## 🚀 Live API

The backend is deployed on Render and accessible here:

🔗 **Base URL**: [https://book-review-api-80si.onrender.com](https://book-review-api-80si.onrender.com)

You can use this base URL for all your API requests.
