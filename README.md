# Project Documentation

## Overview
This project is a document management system built with NestJS and TypeScript, featuring robust authentication, role-based access control, and integration with an ingestion service (Python API). The system supports document CRUD operations, tracks ingestion progress, and provides detailed API documentation.

## Table of Contents
1. [Setup & Configuration](#setup-configuration)
2. [Features](#features)
3. [APIs](#apis)
4. [Testing & Documentation](#testing-documentation)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [Contributing](#contributing)
9. [License](#license)

## Setup & Configuration

- **NestJS with TypeScript**: The project is built using NestJS for a modular, scalable architecture.
- **PostgreSQL with ORM (Prisma/TypeORM)**: Configured for seamless database interaction.
- **JWT Authentication & Role-Based Access Control**: Implemented secure authentication and authorization for Admin, Editor, and Viewer roles.

## Features

### User & Authentication
- Register, login, and logout APIs.
- Password hashing for security.
- Token generation and verification.

### Document Management
- CRUD operations for document management.
- Metadata storage in the database.
- File uploads and storage management.

### Ingestion Control
- Ingestion Trigger API to call a Python API (or mock service).
- Track ingestion status and handle retries in case of failures.
- Ingestion Management API to monitor ingestion progress.

## APIs

- **User APIs**
  - `/users/create`: Register a new user.
  - `/users/login`: Authenticate and retrieve a JWT token.
  - `/users/logout`: Invalidate the current session.
  - `/users/update/:id`: Update user details.
  - `/users/all`: Get all users.
  - `/users/:id`: Get user by ID.
  - `/users/all`: Get all users.




- **Document APIs**
  - `/Documents/upload`: Upload a document.
  - `/Documents`: Get all documents.
  - `/Documents/:id`: Delete a document.


- **Ingestion APIs**
  - `/Ingestions/trigger`: Trigger document ingestion.
  - `/ingestion/:id/status`: Check ingestion status by ID.
  - `/ingestion/:id/embeddings`: Retrieve embeddings for a document by ID.


## Testing & Documentation

- **Unit Tests**: Comprehensive test coverage for key APIs.
- **Swagger/OpenAPI**: Integrated for live API documentation.

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/jritu961/nestjs_clean_architecture.git
   cd nest-architecture-backend
   git checkout feat/develop
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up the database:**
   - Configure the `.env` file with your PostgreSQL credentials .

## Environment Variables

Create a `.env` file with the following:

```
PORT=4004
MONGO_DB=mongod://localhost:27017/nest-js-db
JWT_SECRET=ritu_1234_jaiswal
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=1234
DATABASE_NAME=nest-assign
DATABASE_URL=postgres://user:1234@localhost:5432/nest-assign
CLOUDINARY_CLOUD_NAME: 'dcnskyql4', 
CLOUDINARY_API_KEY: '254958792483692', 
CLOUDINARY_API_SECRET:'csdhIuE5auuo6krljup7HVfFdJs' 
```

## Running the Application

```sh
npm run start
```

Access the Swagger API docs at:
```
http://localhost:4004/api
```

## Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

---

