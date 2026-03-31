Perfect! Having the **Auth Flow** documented in English is essential for your technical README or documentation. Since we are using **Node.js, Express, and Prisma**, here is the professional `.md` file for your Authentication module.

---

# 🔐 Authentication Module: User Flow & API Documentation

## 1. Overview
The Authentication module handles user onboarding, character (Avatar) selection, and secure access to the **Noor App**. It ensures that every "Hero" (User) has a unique profile and an initial wallet of 100 Gems to start their journey.

---

## 2. User Flow (The Journey)

### **A. Registration Phase**
1.  **Input:** User provides `Name`, `Email`, and `Password`.
2.  **Validation:** Backend checks if the email is already registered in the `User` table.
3.  **Password Hashing:** The system encrypts the password using **bcrypt**.
4.  **Avatar Selection:** User selects an `avatar_url` from the provided gallery.
5.  **Database Transaction:** * Create a new `User` record.
    * Automatically create a linked `Gems` record with `total: 100`.
6.  **Token Generation:** System issues a **JWT (JSON Web Token)** for session management.

### **B. Login Phase**
1.  **Input:** User provides `Email` and `Password`.
2.  **Verification:** Backend fetches the user by email and compares the hashed password.
3.  **Response:** If successful, returns the User Profile (Name, Avatar, Total Gems, Streak) and a new JWT.

---

## 3. Database Schema (Prisma Implementation)

The flow interacts with the following models defined in `schema.prisma`:

```prisma
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  password     String   // Used for Auth
  avatar_url   String?
  streak_count Int      @default(0)
  gems         Gems?    // Relation to Gems wallet
}

model Gems {
  id      String @id @default(uuid())
  user_id String @unique
  total   Int    @default(100)
  user    User   @relation(fields: [user_id], references: [id])
}
```

---

## 4. API Endpoints

### **Register a New Hero**
* **Endpoint:** `POST /api/auth/register`
* **Request Body:**
```json
{
  "name": "Omar",
  "email": "omar@noor.com",
  "password": "securePassword123",
  "avatar_url": "https://cdn.noor.app/avatars/boy-1.png"
}
```
* **Success Response (201 Created):**
```json
{
  "message": "Welcome to the Noor family!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": "uuid-123",
    "name": "Omar",
    "avatar_url": "...",
    "total_gems": 100
  }
}
```

### **Login Hero**
* **Endpoint:** `POST /api/auth/login`
* **Request Body:**
```json
{
  "email": "omar@noor.com",
  "password": "securePassword123"
}
```

---

## 5. Security Best Practices
* **Password Hashing:** `bcrypt` with a salt round of 10.
* **JWT Protection:** All subsequent requests (Prayers, Quran, Tasbih) must include the `Authorization: Bearer <token>` header.
* **Validation:** Use `Joi` or `Zod` to validate email formats and password strength.
