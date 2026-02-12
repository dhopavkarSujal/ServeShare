# ServeShare – Backend Service

A scalable and modular REST API built with Node.js, Express, and MySQL for handling authentication and core backend operations of the ServeShare platform.

---

## Overview

The backend service manages:

* User authentication
* Database connectivity
* Route handling
* Business logic processing
* Middleware management
* Modular MVC-based structure

---

## Architecture Pattern

This backend follows a layered architecture:

* Routes Layer
* Controller Layer
* Model Layer
* Middleware Layer
* Configuration Layer

This ensures scalability, maintainability, and clean separation of concerns.

---

## Project Structure

```
backend/
│
├── server.js
├── package.json
├── .env
│
├── config/
│   └── db.js
│
├── routes/
│   └── auth_routes.js
│
├── controllers/
│   └── auth_controller.js
│
├── models/
│   └── user_model.js
│
├── middleware/
│   └── auth_middleware.js
```

---

## Folder Responsibility

### Root Files

* **server.js**
  Application entry point. Initializes Express server, middleware, and routes.

* **package.json**
  Manages dependencies, scripts, and project metadata.

* **.env**
  Stores environment variables and configuration secrets.

---

### config/

Handles application-level configurations.

* **db.js**
  Establishes MySQL database connection and exports connection instance.

---

### routes/

Defines API endpoint mappings.

* **auth_routes.js**
  Authentication endpoints such as register and login.

---

### controllers/

Contains business logic for each route.

* **auth_controller.js**
  Processes authentication requests, validates input, generates JWT tokens, and interacts with models.

---

### models/

Handles direct database interactions.

* **user_model.js**
  Executes queries related to user data operations.

---

### middleware/

Contains reusable request-processing logic.

* **auth_middleware.js**
  Handles JWT verification and protected route authorization.

---

## Installation

```bash
cd backend
npm install
```

---

## Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

---

## Environment Variables

Create a `.env` file in the backend root directory:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=serveshare
JWT_SECRET=your_secret_key
```

---

## Technology Stack

* Node.js
* Express.js
* MySQL
* JWT
* dotenv
* bcrypt

---

## Design Principles

* Modular architecture
* Clean separation of concerns
* Reusable middleware
* Environment-based configuration
* Scalable folder structure