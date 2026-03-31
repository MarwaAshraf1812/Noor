# Noor Backend API 🌙

A powerful, secure, and robust Node.js backend for the Noor Application, an Islamic tracking app designed to help users track prayers, Adhkar, Quran sessions, and earn Gems.

## 🛠 Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (ES Modules)
- **Framework:** [Express.js](https://expressjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (via Prisma Postgres / Prisma Accelerate)
- **Authentication:** JSON Web Tokens (JWT) stored in HTTP-Only Cookies
- **Validation:** [Joi](https://joi.dev/)
- **Security:** bcryptjs (Password Hashing), CORS configuration

---

## 📂 Project Structure

```text
server/
├── prisma/
│   └── schema.prisma       # Prisma database models & configuration
├── src/
│   ├── config/             # Database and environment configurations
│   ├── middleware/         # Custom Express middlewares (e.g., Auth, Error Handlers)
│   ├── modules/            # Domain-driven features (e.g., Auth module)
│   ├── utils/              # Helper functions and utilities
│   ├── app.js              # Express application setup
│   └── server.js           # Server entry point
├── .env                    # Environment variables
└── package.json            # Project dependencies and scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have Node.js installed (v18 or higher recommended).

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and populate it with the following:
```env
# HTTP Port
PORT=8000
NODE_ENV=development

# Prisma Postgres Connection Strings
# Used by Prisma Client for application queries
DATABASE_URL="prisma+postgres://<username>@db.prisma.io:5432/postgres?api_key=<your_api_key>"

# Used for standard migrations / introspections (CLI commands)
DIRECT_URL="postgresql://<username>:<your_api_key>@db.prisma.io:5432/postgres?sslmode=require"

# JWT Secret Key for signing cookies
JWT_SECRET="YOUR_SUPER_SECRET_KEY_HERE"
```

### 4. Database Setup
Push the schema to your remote database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Start the Server
For development (using nodemon):
```bash
npm run dev
# OR 
npm start
```

---

## 🔐 API Endpoints

### Authentication
All successful auth requests issue a highly secure, HTTP-Only `token` cookie valid for 7 days.

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user and initialize Gems wallet | Public |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT cookie | Public |
| `POST` | `/api/auth/logout` | Clear user JWT cookie | Public/Private |

---

## 🛡 Security Highlights
- **XSS Protection:** JWTs are intentionally kept out of JSON responses and `localStorage`. They are transmitted securely via HTTP-Only, `sameSite strict` cookies.
- **CSRF Protection:** Configured via `sameSite: "strict"` on JWT cookies alongside CORS configurations.
- **Data Integrity:** Strict input validation on all routes using `Joi` interceptors before touching the database.
- **Abstraction:** Prisma Singleton pattern employed to prevent connection exhaustion during development reloads.
