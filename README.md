# Trainee App

A React Native mobile application for trainee registration and identity verification, with biometric face recognition powered by InsightFace. The app integrates with a FastAPI backend and PostgreSQL database for secure user onboarding and continuous monitoring.

## Features

- **User Registration**: Step-by-step registration process including employee ID (dummy id) and mobile number input. Complete authentication is not implemented as instructed.
- **Face Recognition**: Advanced face registration using InsightFace for biometric authentication, capturing multiple angles for robust embedding generation.
- **Backend API**: RESTful API built with FastAPI, handling face processing, database operations, and audit logging.
- **Database Integration**: PostgreSQL with pgvector for efficient storage and querying of face embeddings.
- **Containerized Deployment**: Docker Compose setup for easy development and deployment.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Docker and Docker Compose**: For containerized backend and database.
- **Node.js and npm**: For managing React Native dependencies.
- **Expo CLI**: For running the React Native application.
- **Git**: For cloning the repository.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sumeetgroup/lms_sumeetgroup.git
cd lms_sumeetgroup/trainee_app
```

### 2. Backend Setup

Navigate to the backend directory and create the environment configuration file:

```bash
cd backend
```

Create a `.env` file in the `backend/` folder with the following content:

```env
DB_USER=postgres
DB_PASSWORD=abcdefgh
DB_HOST=postgres
DB_PORT=5432
DB_NAME=trainee

PHOTO_STORAGE_PATH=./storage/photos
INSIGHTFACE_MODEL=buffalo_l

FACE_MATCH_THRESHOLD=0.4
LIVENESS_THRESHOLD=0.6
```

### 3. Start Backend Services

From the root `trainee_app` directory, build and start the Docker containers:

```bash
docker compose up --build
```

This command will:

- Build the backend and PostgreSQL images.
- Start the services on the specified ports.
- Download and load the InsightFace model (this may take several minutes on first run).

Verify the backend is running by visiting the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

For subsequent runs, use:

```bash
docker compose up
```

### 4. Frontend Setup

Install dependencies and start the Expo development server:

```bash
npx expo install
npx expo start
```

This will launch the Expo development tools. Use the Expo Go app on your mobile device or an emulator to run the application. You can use browser if you are getting network errors on application as Windows Security blocks network calls on its ports from external applications.

## Database Management

While the Docker containers are running, you can interact with the PostgreSQL database:

1. Open a new terminal and connect to the database container:

```bash
docker exec -it practice-postgres psql -U postgres
```

2. Switch to the trainee database:

```sql
\c trainee
```

3. List all tables:

```sql
\dt
```

4. View table contents (replace `<TABLE_NAME>` with the actual table name):

```sql
SELECT * FROM <TABLE_NAME>;
```

## Usage

1. **Registration Flow**:
   - Enter your Employee ID and temporary password (These values can be anything).
   - Provide a 10 digit mobile number.
   - Complete face registration by following on-screen instructions (the app captures multiple face angles).

2. **Face Verification**:
   - The backend processes face images using InsightFace to generate embeddings.
   - Embeddings are stored securely in the PostgreSQL database with pgvector support.

3. **API Endpoints**:
   - `POST /register/face`: Register a trainee's face with multiple photos.
   - `POST /verify/snapshot`: Verify identity during lessons or quizzes.
   - Visit [http://localhost:8000/docs](http://localhost:8000/docs) for full API documentation.

## Configuration

- **Database**: Configured via `backend/.env`. Supports PostgreSQL with pgvector for vector operations.
- **Face Recognition**: Uses InsightFace `buffalo_l` model. Thresholds for face matching and liveness detection are configurable.
- **Storage**: Face photos are stored locally in the `backend/storage/photos/` directory.
