# Noor 🌙

An Islamic tracking app designed to help users track prayers, Adhkar, Quran sessions, and earn Gems.

## 📂 Project Structure

This repository is organized into distinct parts:

- **`client/`**: The frontend application (currently empty/in-progress).
- **`server/`**: The Node.js, Express, and Prisma backend API. 

## 🚀 Getting Started with the Backend

To get started with the server component, please navigate to the `server/` directory. You will find dedicated documentation:

- [Server README](./server/README.md) - Contains prerequisites, installation instructions, database setup, and a list of API endpoints.
- [Noor Backend Documentation](./server/Noor_Backend_Documentation.md) - Detailed backend reference.

### Quick Start (Server)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables as described in `./server/README.md`.
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security Highlights

The backend emphasizes security through:
- JWTs stored in HTTP-Only, `SameSite=Strict` cookies to prevent XSS.
- CORS configurations and CSRF protection.
- Input validation on all routes using `Joi`.
- Secure password hashing using `bcryptjs`.
