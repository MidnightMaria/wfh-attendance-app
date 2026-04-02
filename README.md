# WFH Attendance & Employee Monitoring System

A backend system built using a microservices architecture with NestJS. This application is designed to manage employee attendance (work from home) and provide monitoring capabilities for HR administrators.

---

# Overview

This project is a fullstack web application designed for employee work-from-home attendance tracking and monitoring. It is built using a microservices architecture with a clear separation of concerns between services.

This system consists of multiple services that work together to handle:

* Authentication and authorization using JWT
* Employee data management
* Attendance tracking with optional photo upload
* Centralized API access through an API Gateway
* Containerized deployment using Docker

The system allows:

* Employees to log in and submit attendance with optional photo proof
* Admin (HR) to manage employee data and monitor attendance
* Admin to create user accounts linked to employee records

---

# Tech Stack

Backend

* NestJS (TypeScript)
* TypeORM
* MySQL
* Microservices Architecture
* Docker & Docker Compose

Frontend

* React.js (Vite)
* TailwindCSS

Other

* JWT Authentication
* Swagger API Documentation

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

The backend is composed of multiple services:

1. API Gateway (Port 3000)

   * Single entry point for frontend
   * Routes requests to internal services

2. Auth Service (Port 3001)

   * Handles authentication and authorization
   * JWT token generation
   * User account management

3. Employee Service (Port 3002)

   * Manages employee master data
   * Supports create, update, activate, deactivate

4. Attendance Service (Port 3003)

   * Handles attendance submissions
   * Supports photo upload (stored locally)

All services are connected through Docker Compose and share a MySQL database.

---

# Services

## Auth Service (Port 3001)

Responsible for authentication and user management.

Features:

* User registration
* User login (JWT-based)
* Profile retrieval (protected route)
* JWT-based authentication
* Role-based access control (ADMIN, EMPLOYEE)
* Protected routes using guards

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
* Activate employee
* Prevent duplicate email and employee code

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
* Prevent multiple check-ins in the same day

Access control:

* EMPLOYEE: check-in
* ADMIN: view-only monitoring

Photo Upload Mechanism

* Uses multer diskStorage
* Files stored in:
  attendance-service/uploads/
* Accessible via:
  [http://localhost:3003/uploads/](http://localhost:3003/uploads/)<filename>

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

# User Account Management

* Admin-driven account creation (no public signup)
* Each user is linked to an employee via employee_id
* Email must match employee record (data consistency enforced)

---

# Data Integrity Improvements

* employee_id validation via internal service-to-service call
* Email consistency enforced between auth and employee service
* Soft delete strategy using is_active flag

---

# Important Design Decisions

1. Microservices Separation
   Each service has a single responsibility:

* Auth handles identity
* Employee handles master data
* Attendance handles activity data

2. No Public Registration
   User accounts are created by admin to match internal HR workflow.

3. Soft Delete Strategy
   Employees are not deleted but marked inactive (is_active = false) to preserve historical data.

4. Service-to-Service Validation
   Auth service validates employee_id by calling employee service to ensure data integrity.

5. Email Consistency Enforcement
   User email must match employee email to avoid identity mismatch.

---

# API Documentation (Swagger)

Swagger documentation is available for each service:

| Service     | URL                                                              |
| ----------- | ---------------------------------------------------------------- |
| Auth        | [http://localhost:3001/api-docs](http://localhost:3001/api-docs) |
| Employee    | [http://localhost:3002/api-docs](http://localhost:3002/api-docs) |
| Attendance  | [http://localhost:3003/api-docs](http://localhost:3003/api-docs) |
| API Gateway | [http://localhost:3000/api-docs](http://localhost:3000/api-docs) |

Swagger provides:

* Endpoint overview
* Request and response structure
* Basic API testing capability

---

# Environment Setup

Each service includes a `.env.example` file.

Example (Auth Service):

```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=wfh_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
EMPLOYEE_SERVICE_URL=http://employee-service:3002
```

---

# Running the Application (Docker)

## 1. Clone repository

```bash
git clone <your-repository-url>
cd wfh-attendance-app
```

---

## 2. Configure environment variables

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

* API Gateway: [http://localhost:3000](http://localhost:3000)
* Auth Service: [http://localhost:3001](http://localhost:3001)
* Employee Service: [http://localhost:3002](http://localhost:3002)
* Attendance Service: [http://localhost:3003](http://localhost:3003)
* Frontend: [http://localhost:5173](http://localhost:5173)

---

# Frontend Flow

Admin:

* Login
* Manage employees
* Create user account for employees
* Monitor attendance

Employee:

* Login
* Submit attendance (with optional photo)

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

This project demonstrates:

* Microservices architecture implementation
* Secure authentication and authorization
* Data integrity enforcement across services
* Real-world HR system workflow design
* Fullstack integration from backend to frontend

---

# Author

Agnes 
