# HNG14 Backend Stage 1 Task

Name Profiler API – Multi API Integration & Data Persistence

## Overview

A RESTful API that accepts a name, fetches data from three external APIs (Genderize, Agify & Nationalize), applies classification logic, and stores the result in PostgreSQL.

## Features

- **POST** `/api/profiles` – Create profile (idempotent)
- **GET** `/api/profiles` – Get all profiles with optional filters (`gender`, `country_id`, `age_group`)
- **GET** `/api/profiles/:id` – Get single profile
- **DELETE** `/api/profiles/:id` – Delete profile
- Calls 3 external free APIs
- Automatic age group classification
- Proper error handling (400, 404, 502)
- CORS enabled (`*`)
- UUID v7 IDs & UTC timestamps

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + pg
- **HTTP Client**: Axios
- **Others**: dotenv, cors, helmet, morgan

## API Endpoints

| Method | Endpoint                    | Description                      |
|--------|-----------------------------|----------------------------------|
| POST   | `/api/profiles`             | Create new profile               |
| GET    | `/api/profiles`             | Get all profiles (with filters)  |
| GET    | `/api/profiles/:id`         | Get single profile               |
| DELETE | `/api/profiles/:id`         | Delete profile                   |
