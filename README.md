# WFH Attendance System (Microservices Architecture)

A fullstack web application for Work From Home (WFH) attendance tracking and employee monitoring, built using a microservices architecture.

This system is designed to simulate a real-world HR workflow, where administrators manage employee data and control user access, while employees submit daily attendance with optional proof.

---

# Overview

This system provides:

* Secure authentication and authorization (JWT-based)
* Employee master data management
* Attendance tracking with optional photo proof
* Admin-controlled user account creation
* Attendance monitoring for HR
* Microservices-based backend architecture
* Containerized deployment using Docker

---

# Architecture

```
Frontend (React + Vite)
        ↓
   API Gateway (3000)
        ↓
------------------------------------------------
| Auth Service        (3001)                   |
| Employee Service    (3002)                   |
| Attendance Service  (3003)                   |
------------------------------------------------
        ↓
     MySQL Database
```

## Architecture Highlights

* Each service has a single responsibility
* Communication through API Gateway
* Internal validation via service-to-service calls
* Shared database (MySQL)

---

# Services

## Auth Service (Port 3001)

Handles authentication, authorization, and user account management.

### Features

* Admin-driven user account creation (no public registration)
* User login (JWT-based)
* Role-based access control (ADMIN, EMPLOYEE)
* Profile retrieval (protected routes)

### Implementation Details

* Password hashing using bcrypt
* JWT token generation and validation
* Enforces email consistency with employee data
* Validates employee_id via Employee Service

---

## Employee Service (Port 3002)

Manages employee master data.

### Features

* Create employee
* Update employee
* Activate and deactivate employee
* Prevent duplicate email and employee code

### Data Strategy

* Uses soft delete (is_active = false)
* Preserves historical data
* Restricted to ADMIN role

---

## Attendance Service (Port 3003)

Handles employee attendance records.

### Features

* Daily check-in with timestamp
* Prevent multiple check-ins per day
* Optional photo upload as proof
* Attendance monitoring (ADMIN)
* Filtering by employee and date

### Photo Upload

* Uses multer with diskStorage
* Stored locally in:

```
attendance-service/uploads/
```

* Accessible via:

```
http://localhost:3003/uploads/<filename>
```

---

## API Gateway (Port 3000)

Acts as the single entry point for all client requests.

### Responsibilities

* Routes requests to appropriate services
* Simplifies frontend integration
* Centralizes API access
* Provides Swagger documentation

---

# Authentication Flow

1. User logs in and receives a JWT token

2. Token is included in request headers:

```
Authorization: Bearer <token>
```

3. Backend validates:

* Token authenticity
* User role (ADMIN or EMPLOYEE)
* Employee association (for attendance)

---

# Key Features

## Authentication and Authorization

* JWT-based authentication
* Role-based access control
* Protected routes using guards

---

## Employee Management (ADMIN)

* Create employee
* Update employee
* Activate and deactivate employee
* Duplicate data prevention

---

## Attendance System

* Daily check-in system
* Prevent duplicate attendance per day
* Optional photo upload
* Admin monitoring support

---

## User Account Management

* No public registration
* Accounts created by ADMIN only
* Each user linked to employee_id
* Email must match employee record

---

## Data Integrity

* Cross-service validation (Auth to Employee)
* Email consistency enforcement
* Strong relationship between user and employee data

---

## Photo Upload Mechanism

* Multer-based file handling
* Local storage
* URL-based file access

---

# Tech Stack

## Backend

* NestJS (TypeScript)
* TypeORM
* MySQL
* JWT Authentication
* Multer (file upload)
* Swagger

## Frontend

* React.js (Vite)
* TailwindCSS

## Infrastructure

* Docker
* Docker Compose

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

# Running the Application

## 1. Clone repository

```
git clone <your-repository-url>
cd wfh-attendance-app
```

---

## 2. Configure environment variables

```
cp backend/auth-service/.env.example backend/auth-service/.env
cp backend/employee-service/.env.example backend/employee-service/.env
cp backend/attendance-service/.env.example backend/attendance-service/.env
cp backend/api-gateway/.env.example backend/api-gateway/.env
```

---

## 3. Run with Docker

```
docker compose up --build
```

---

## 4. Access services

* Frontend: [http://localhost:5173](http://localhost:5173)
* API Gateway: [http://localhost:3000](http://localhost:3000)
* Swagger Docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

# API Documentation

Swagger is available at:

```
http://localhost:3000/api-docs
```

Provides:

* Endpoint overview
* Request and response schema
* API testing interface

---

# Example API Flow

## Login

```
POST /auth/login
```

Response:

```
{
  "access_token": "..."
}
```

---

## Employee Management (ADMIN)

```
POST /employees
GET /employees
PATCH /employees/:id
PATCH /employees/:id/deactivate
```

---

## Attendance (EMPLOYEE)

```
POST /attendances/check-in
POST /attendances/check-in-with-photo
```

---

## Attendance Monitoring (ADMIN)

```
GET /attendances
GET /attendances?employee_id=1
GET /attendances?attendance_date=YYYY-MM-DD
```

---

# Security

* JWT-based authentication
* Role-based authorization
* Input validation using class-validator
* Global validation pipe
* Controlled service-to-service communication

---

# Important Design Decisions

## Microservices Separation

Each service has a single responsibility:

* Auth handles identity and access
* Employee handles master data
* Attendance handles activity data

---

## No Public Registration

* Aligns with real HR systems
* Prevents unauthorized account creation

---

## Soft Delete Strategy

* Employees are not deleted
* Uses is_active flag
* Preserves historical records

---

## Service-to-Service Validation

* Auth validates employee_id via Employee Service
* Prevents invalid relationships

---

## Email Consistency Enforcement

* User email must match employee email
* Prevents identity mismatch

---

# Future Improvements

* Cloud storage (AWS S3 or Cloudinary)
* Analytics dashboard
* Email notification system
* Pagination and filtering improvements
* UI and UX enhancements
* Event-driven architecture (Kafka or RabbitMQ)

---

# Conclusion

This project demonstrates:

* Microservices architecture implementation
* Secure authentication and authorization
* Cross-service data integrity enforcement
* Real-world HR workflow modeling
* Fullstack system integration

Suitable for portfolio, technical assessments, and academic projects.

---

# Author

Agnes

---
