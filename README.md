# PetTracker API

PetTracker application backend developed with NestJS.

The project was created for pet management with full authentication, image upload using AWS S3, and a modular architecture.

---

# Technologies

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Refresh Token
- AWS S3
- Multer
- Docker
- REST API

---

# Features

## Authentication

- User registration
- Login with JWT
- Refresh token
- Secure routes
- Permission control

## Pets

- Create pet
- Update pet
- Remove pet
- Search user's pets
- Pet image upload
- Image storage in AWS S3

## Upload

- Multipart/form-data upload
- File type validation
- Size validation
- PNG and JPEG support

---

# Architecture

The project uses NestJS's modular architecture.

```txt
src/
├── common/
│ ├── decorators/
│ ├── guards/
│ ├── interceptors/
│ └── s3/
│
├── modules/
│ ├── auth/
│ ├── user/
│ └── pet/
│
├── config/
└── main.ts

```

---

# Environment variables

Create a file `.env`:

```env DATABASE_URL=
DB_SYNCHRONIZE=
DB_AUTO_LOAD_ENTITIES=

JWT_SECRET=
JWT_EXPIRATION=

ENCRYPT_PASSWORD=
IV_VALUE=

AWS_REGION=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
```

---

# Installation

## Clone the project

```bash
git clone https://github.com/your-user/pettracker-backend.git
```

## Enter the folder

```bash
cd pettracker-backend
```

## Install the dependencies

```bash
npm install

```

---

# Running the project

## Development

````bash
npm run start:dev

# Production

bash bash npm run build npm run start:prod

---

# Image Upload

Images are stored using AWS S3.

Flow:

txt Frontend
↓ NestJS
↓ Multer

↓ AWS S3

↓ PostgreSQL

Example generated URL:

txt https://bucket-name.s3.region.amazonaws.com/image.png

---

# Security

- JWT authentication
- Refresh token
- Protected routes
- File validation
- Upload limit
- Pet ownership control

---

# Main Endpoints

# Auth

| Method | Endpoint |

| ------ | ------------- |

| POST | /auth/login |
| POST | /auth/refresh |

##User

| Method | Endpoint |
| ------ | -------- |
| POST | /user |
| GET | /user/me |
| PATCH | /user/me |
| DELETE | /user/me |

## Pets

| Method | Endpoint |
| ------ | -------- |
| POST | /pet |
| GET | /pet |
| PATCH | /pet/:id |
| DELETE | /pet/:id |

---

# Example of upload

```http POST /pet Content-Type: multipart/form-data Authorization: Bearer token

````

Fields:

```txt name race species birthDate pet-img

```

---

# Project Objective

PetTracker was developed as a portfolio project focusing on a modern backend using NestJS, JWT authentication, and integration with AWS services.

The project aims to simulate functionalities used in real SaaS applications.

---

# Future Improvements

- Cloud deployment
- CI/CD
- Presigned URLs
- Redis caching
- Multiple uploads
- Administrative dashboard
- Notifications
- Monitoring
- Automated testing

---

# Author

Matheus Iost

Full Stack Developer
