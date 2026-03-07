# Task 1: Implement Better Auth

## Overview

The goal of this task is to integrate Better Auth, setting up core authentication functionality for the project. This will include database (PostgreSQL) setup, schema configuration using Drizzle, and route handling for a secure, scalable authentication flow.

## Steps

1. **Initialize Database with PostgreSQL**
   - Add Docker Compose file to set up a PostgreSQL service for development.
   - Ensure the database service is configured with Drizzle ORM compatibility.

2. **Read Better Auth Documentation**
   - Gain understanding of how Better Auth integrates with Next.js 16 and Drizzle ORM.
   - Identify the necessary plugins and configurations for our project.

3. **Install Drizzle ORM**
   - Ensure the latest version of Drizzle ORM is installed in the project.
   - Set up a migration system to manage schema changes related to authentication.

4. **Set Up Better Auth**
   - Install Better Auth and configure server-side auth handling (`Auth.ts`).
   - Use the Drizzle adapter for PostgreSQL.
   - Configure client-side auth setup (`AuthClient.ts`).

5. **Define Auth Routes**
   - Create route handler for `/api/auth/[...all]/route.ts` using Better Auth utilities.
   - Ensure secure server-side session handling.

6. **Validate Environment Variables**
   - Add necessary environment variables for the Better Auth configuration.
   - Validate these environment variables in a centralized `Env.ts` file.

7. **Generate Schema and Migrations**
   - Use Better Auth’s provided schema tooling to generate necessary tables.
   - Commit these migrations to the repository.

8. **Test Authentication Flow**
   - Implement unit and integration tests to verify login, signup, email verification, and password reset.
   - Run all related `bun` commands to ensure tests and type-checking pass successfully.

9. **Document Changes and Progress**
   - Add a summary report of the implemented functionality and test results at the end of the task.

## Checklist

- [ ] Database set up with PostgreSQL via Docker Compose
- [ ] Drizzle ORM installed and configured
- [ ] Better Auth integrated with server and client
- [ ] Auth routes set up securely
- [ ] Environment variables validated
- [ ] Auth schema and migrations generated
- [ ] Tests for the auth flow written and passing
- [ ] Documentation updated

## Branch: `task-1-better-auth`

Use this branch for all changes related to this task.
