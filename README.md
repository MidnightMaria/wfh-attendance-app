# WFH Attendance & Employee Monitoring System

A backend system built using a microservices architecture with NestJS. This application is designed to manage employee attendance (work from home) and provide monitoring capabilities for HR administrators.

---

# Overview

This system consists of multiple services that work together to handle:

* Authentication and authorization using JWT
* Employee data management
* Attendance tracking with optional photo upload
* Centralized API access through an API Gateway
* Containerized deployment using Docker

---

# Architecture

```
Frontend (React)
        ↓
   API Gateway (3000)
        ↓
----------------------------------
| Auth Service        (3001)     |
| Employee Service    (3002)     |
| Attendance Service  (3003)     |
----------------------------------
        ↓
     MySQL Database
```

---

# Services

## Auth Service (Port 3001)

Responsible for authentication and user management.

Features:

* User registration
* User login (JWT-based)
* Profile retrieval (protected route)

Implementation details:

* Password hashing using bcrypt
* JWT token generation and validation
* Role-based payload (ADMIN, EMPLOYEE)

---

## Employee Service (Port 3002)

Responsible for managing employee master data.

Features:

* Create employee
* Retrieve all employees
* Retrieve employee by ID
* Update employee
* Deactivate employee

Access control:

* Restricted to ADMIN role

---

## Attendance Service (Port 3003)

Responsible for handling attendance records.

Features:

* Employee check-in
* Optional photo upload for attendance proof
* Attendance monitoring (admin)
* Filtering by employee and date

Access control:

* EMPLOYEE: check-in
* ADMIN: view-only monitoring

---

## API Gateway (Port 3000)

Acts as the single entry point for all client requests.

Responsibilities:

* Routes incoming requests to appropriate services
* Simplifies frontend integration
* Centralizes API access

---

# Authentication Flow

1. User logs in and receives a JWT token
2. Token is sent in request headers:

```
Authorization: Bearer <token>
```

3. Backend validates:

* Token authenticity
* User role
* Employee association (for attendance)

---

# API Documentation (Swagger)

Swagger documentation is available for each service:

| Service     | URL                            |
| ----------- | ------------------------------ |
| Auth        | http://localhost:3001/api-docs |
| Employee    | http://localhost:3002/api-docs |
| Attendance  | http://localhost:3003/api-docs |
| API Gateway | http://localhost:3000/api-docs |

Swagger provides:

* Endpoint overview
* Request and response structure
* Basic API testing capability

---

# Running the Application (Docker)

## 1. Clone repository

```bash
git clone <your-repository-url>
cd wfh-attendance-app
```

---

## 2. Configure environment variables

Copy `.env.example` files:

```bash
cp backend/auth-service/.env.example backend/auth-service/.env
cp backend/employee-service/.env.example backend/employee-service/.env
cp backend/attendance-service/.env.example backend/attendance-service/.env
cp backend/api-gateway/.env.example backend/api-gateway/.env
```

---

## 3. Run services

```bash
docker compose up --build
```

---

## 4. Service endpoints

* API Gateway: http://localhost:3000
* Auth Service: http://localhost:3001
* Employee Service: http://localhost:3002
* Attendance Service: http://localhost:3003

---

# Example API Flow

## 1. Register user

```http
POST /auth/register
```

---

## 2. Login

```http
POST /auth/login
```

Response:

```json
{
  "access_token": "..."
}
```

---

## 3. Use token

Header:

```http
Authorization: Bearer <token>
```

---

## 4. Employee management (ADMIN)

```http
POST /employees
GET /employees
PATCH /employees/:id
PATCH /employees/:id/deactivate
```

---

## 5. Attendance (EMPLOYEE)

```http
POST /attendances/check-in
POST /attendances/check-in-with-photo
```

---

## 6. Attendance monitoring (ADMIN)

```http
GET /attendances
GET /attendances?employee_id=1
GET /attendances?attendance_date=YYYY-MM-DD
```

---

# Security

* JWT-based authentication
* Role-based access control
* Input validation using class-validator
* Global validation pipe enabled across services

---

# Technology Stack

Backend:

* NestJS
* TypeORM
* MySQL
* JWT
* Multer (file upload)

Infrastructure:

* Docker
* Docker Compose

API Documentation:

* Swagger

---

# Project Structure

```
backend/
├── api-gateway/
├── auth-service/
├── employee-service/
├── attendance-service/
frontend/
docker-compose.yml
```

---

# Notes

* No seed data is included. Data should be created manually through API.
* Swagger is provided for API documentation and basic testing.
* Postman or similar tools can be used for more advanced testing scenarios.

---

# Conclusion

This project demonstrates a backend system built with a microservices architecture, incorporating authentication, role-based access control, and modular service design. It is suitable for technical assessments and as a portfolio project.

---

# Author

Agnes
