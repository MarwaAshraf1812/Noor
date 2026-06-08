# Noor Backend API 🌙

A powerful, secure, and robust Node.js backend for the Noor Application—an Islamic tracking app designed to help users track prayers, Adhkar, Quran sessions, and earn Gems.

---

## 🛠 Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (ES Modules)
- **Framework:** [Express.js](https://expressjs.com/)
- **Real-Time Communication:** [Socket.io](https://socket.io/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (via Prisma Postgres / Prisma Accelerate)
- **Authentication:** JSON Web Tokens (JWT) stored in secure HTTP-Only Cookies
- **Validation:** [Joi](https://joi.dev/)
- **Security:** bcryptjs (Password Hashing), CORS configuration

---

## 📂 Project Structure

```text
server/
├── config/             # Database and environment configurations
├── logger/             # Logging service (Winston Logger) configuration
├── logs/               # Application runtime log files
├── middleware/         # Express middlewares (e.g. Auth, CheckLevelUp, error handler)
├── modules/            # Domain-driven feature modules (Auth, Prayer, Quran, etc.)
│   ├── achievements/   # Achievement condition callbacks & badges logic
│   ├── adhkar/         # Adhkar logs, category lists, and dashboard data
│   ├── auth/           # Registration, login, and cookie management
│   ├── gamification/   # Points calculation, leveling rules, and streak updates
│   ├── prayers/        # Prayer times logic, locations, and status tracker
│   ├── quran/          # Memorization (Hifz) & Revision logging
│   └── tasbih/         # Tasbih session counter
├── prisma/             # Database configuration
│   └── schema.prisma   # Prisma schema containing PostgreSQL models
├── utils/              # Helper functions and utilities (e.g., prayer timers)
├── .env                # Local environment variables
├── app.js              # Express app router initialization & configuration
├── package.json        # Dependencies and scripts
└── server.js           # Main HTTP server entry point (configures Socket.io)
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
Create a `.env` file in the `server` directory and populate it with the following:
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

All endpoints (except auth routes) expect a valid JWT passed automatically via secure **HTTP-Only Cookies** and route requests through the `authenticate` and `checkLevelUp` middleware.

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user, password hashing, initialize Gems wallet | Public |
| `POST` | `/login` | Authenticate user credentials and issue JWT cookie | Public |
| `POST` | `/logout` | Clear user JWT cookie | Public/Private |

### 2. Prayers (`/api/v1/prayer`)
| Method | Endpoint | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `POST` | `/record` | Logs a prayer location/status. Checks for on-time bonuses | `{ "prayerName": "maghrib", "status": "COMPLETED", "location": "MOSQUE", "latitude": 30.0, "longitude": 31.0 }` |
| `GET` | `/dashboard` | Fetches today's prayers and auto-calculates prayer times | `Query params: ?latitude=30.0&longitude=31.0` |

### 3. Quran Tracker (`/api/v1/quran`)
| Method | Endpoint | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `POST` | `/session` | Logs a memorization or revision session. Awards gems per Ayah | `{ "surah_name": "سورة النبأ", "verse_count": 5, "type": "HIFZ" }` |
| `GET` | `/dashboard` | Returns current memorized/revised counts, history, and goals | None |
| `PUT` | `/targets` | Updates daily goals for Hifz & Revision | `{ "daily_hifz_target": 10, "daily_revision_target": 20 }` |

### 4. Tasbih Counter (`/api/v1/tasbih`)
| Method | Endpoint | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `POST` | `/session` | Logs count details for a specific Tasbih category | `{ "tasbih_name": "Subhan Allah", "count": 33, "completedSession": true }` |
| `GET` | `/dashboard` | Fetches historical Tasbih logs and stats | None |

### 5. Adhkar Checklists (`/api/v1/adhkar`)
| Method | Endpoint | Description | Payload / URL Format |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard` | Fetches completion statuses for all daily Adhkar categories | None |
| `GET` | `/category/:category` | Retrieves the list of Adhkar for a category | `:category` is `MORNING`, `EVENING`, or `SLEEP` |
| `POST` | `/session` | Submits checklist completion for a category and awards Gems | `{ "category": "MORNING" }` |

---

## 🛡 Security Highlights

*   **XSS Protection:** JWT tokens are kept out of local storage and exclusively transmitted via HTTP-Only, `SameSite=Strict` cookies.
*   **CSRF Protection:** Handled via custom CORS origin settings and strict cookie configurations.
*   **Data Integrity:** Express routes execute input sanitization and validation using `Joi` validation schemas prior to controller execution.
*   **Database Reliability:** Uses the Prisma Singleton pattern to manage connections and prevent connection exhaustion during development hot-reloads.
