This is a full-stack web application featuring a REST API backend and a Single-Page Application frontend.

- **Backend**: Symfony 7, API Platform, Doctrine, LexikJWTAuthenticationBundle
- **Frontend**: Angular 17+ (Standalone Components), RxJS, SCSS
- **Database**: MySQL 8
- **Environment**: Docker, Docker Compose

## Prerequisites

To run this project, you must have **Docker Desktop** (for Windows/Mac) or **Docker Engine + Docker Compose** (for Linux) installed on your machine.

- [Install Docker](https://www.docker.com/products/docker-desktop/)

## Quick Start

The entire setup process consists of a few simple steps in your terminal.

### 1. Clone the Repository

If you haven't already, clone the repository to your local machine:

```bash
git clone <your-repository-url>
cd <project-folder-name>
```

### 2. Set Up Environment Variables

The project includes an example environment file `.env.example`. Copy it to create your own `.env` file.

```bash
# For Windows (PowerShell)
copy .env.example .env

# For Linux / macOS
cp .env.example .env
```

The default `.env` file contains all the necessary settings for local development. You can change the passwords if you wish.

My `.env` file

```bash
MYSQL_DATABASE=news_db
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_ROOT_PASSWORD=root_password

DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@db:3306/${MYSQL_DATABASE}?serverVersion=8.0&charset=utf8mb4"
CORS_ALLOW_ORIGIN=^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$

JWT_PASSPHRASE=secret123
```

### 3. Build and Run Docker Containers

This command will build the necessary images (on the first run) and start all services (web server, PHP, database, frontend) in the background.

```bash
docker compose up -d --build
```

### 4. Install Dependencies

Once the containers are running, you need to install the dependencies for both the backend and the frontend.

**For the Backend (Symfony):**

```bash
# Fix permissions (important for Windows/Mac)
docker compose exec --user=root php chown -R www-data:www-data var vendor

# Install PHP packages
docker compose exec php composer install
```

**Sometimes, if you are reconfiguring a PHP container, you will need to issue three commands in sequence:**

Set access rights for var and vendor:

```bash
docker compose exec --user=root php chown -R www-data:www-data var vendor
```

Install items:

```bash
docker compose exec php composer install
```

Now enter any other Composer commands:

```bash
docker compose exec php composer require symfony/runtime
```

**For the Frontend (Angular):**

```bash
# Install JavaScript packages
docker compose exec frontend npm install
```

### 5. Set Up the Database and Seed Data

Now that all dependencies are installed, let's prepare the database.

1.  **Create the database:**

    ```bash
    docker compose exec php php bin/console doctrine:database:create
    ```

2.  **Apply migrations (create tables):**

    ```bash
    docker compose exec php php bin/console doctrine:migrations:migrate
    ```

3.  **Create a test user:**

    ```bash
    docker compose exec php php bin/console app:create-user test@test.com 123456
    ```

4.  **Seed the database with sample news:**
    ```bash
    docker compose exec php php bin/console app:seed-news
    ```

### 6. Generate JWT Keys

For authentication to work, you need to generate SSL keys.

```bash
# Create the jwt directory
docker compose exec --user=root php sh -c "mkdir -p config/jwt && chown www-data:www-data config/jwt"

# Generate the keys
docker compose exec php openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
docker compose exec php openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout
```

**Pass Phrase:** `secret123` (if you haven't changed it in the `.env` file).

**You're all set!**

## Accessing the Application

- **Frontend (Angular App)**: [http://localhost:4200](http://localhost:4200)
- **Backend API (Symfony)**: [http://localhost:8080](http://localhost:8080)
- **Database (MySQL)**: Connect via `localhost:3306` (credentials are in the `.env` file)

**Test User Credentials:**

- **Email:** `test@test.com`
- **Password:** `123456`

## Useful Commands

### Stop the Project

```bash
docker compose stop
```

### Start a Stopped Project

```bash
docker compose start
```

### Stop and Remove Containers

```bash
docker compose down
```

### Stop and Remove Containers and Volumes (full database reset)

```bash
docker compose down -v
```

### Execute Symfony Commands

```bash
docker compose exec php php bin/console <command>
```

### Execute Angular CLI Commands

```bash
docker compose exec frontend npm run ng -- <command>
```

### View Logs

```bash
# View backend logs
docker compose logs -f php

# View frontend logs
docker compose logs -f frontend
```
