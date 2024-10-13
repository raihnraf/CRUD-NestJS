# Library Management API

This project is a NestJS-based REST API for managing a library system. It provides endpoints for managing books and users, with JWT authentication for secure access.

## Features

- User authentication and authorization using JWT
- CRUD operations for books and users
- PostgreSQL database integration using TypeORM
- E2E testing for the authentication flow

## Project Structure

The project follows the NestJS modular architecture pattern, which provides several benefits:

1. **Modularity**: Each feature (books, users, auth) is encapsulated in its own module, promoting a clean and organized code structure.
2. **Scalability**: New features can be easily added as separate modules without affecting existing code.
3. **Testability**: The modular structure facilitates unit testing and e2e testing of individual components.
4. **Dependency management**: Each module clearly defines its dependencies, making the application easier to maintain and understand.

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database
4. Create a `.env` file in the root directory with the following content:

   ```
   DB_HOST=your_db_host
   DB_PORT=your_db_port
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   ```

5. Run the application: `npm run start:dev`

## API Endpoints

- POST /api/auth/register: Register a new user
- POST /api/auth/login: Authenticate a user and receive a JWT token
- GET /api/auth/profile: Get the profile of the authenticated user
- GET /api/books: Get all books (requires authentication)
- POST /api/books: Create a new book (requires authentication)
- GET /api/books/:id: Get a specific book (requires authentication)
- PATCH /api/books/:id: Update a book (requires authentication)
- DELETE /api/books/:id: Delete a book (requires authentication)
- GET /api/users: Get all users (requires authentication)
- DELETE /api/users/:id: Delete a user (requires authentication)
- PUT /api/users/:id: Update users (requires authentication)

## Testing

To run the e2e tests: `npm run test:e2e`

## Technologies Used

- NestJS
- TypeORM
- PostgreSQL
- Passport.js (for authentication)
- Jest (for testing)

## Future Improvements

- Implement role-based access control
- Add pagination for book and user listings
- Implement book borrowing functionality
- Add more comprehensive unit tests

Feel free to contribute to this project by submitting pull requests or reporting issues.