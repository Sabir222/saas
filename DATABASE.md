# Database Documentation

This document details the database setup for this SaaS boilerplate.

## Current Status

| Item       | Status                               |
| ---------- | ------------------------------------ |
| Database   | PostgreSQL 18                        |
| ORM        | Drizzle ORM                          |
| Tables     | Not created yet (pending migrations) |
| Extensions | pg_stat_statements, hypopg           |

## Quick Start

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# Reset database (deletes all data)
docker compose down -v
docker compose up -d
```

## Docker Setup

### Image

We use a custom PostgreSQL image with additional extensions:

```yaml
# docker-compose.yml
services:
  postgres:
    build:
      context: .
      dockerfile: Dockerfile.postgres
    ports:
      - "5432:5432"
```

The custom image includes:

- **pg_stat_statements** - For query performance monitoring
- **hypopg** - For hypothetical index testing

### Connection

| Setting  | Value     |
| -------- | --------- |
| Host     | localhost |
| Port     | 5432      |
| Database | saas_db   |
| User     | user      |
| Password | password  |

Connection string:

```
postgresql://user:password@localhost:5432/saas_db
```

## Schema

The database uses Better Auth's schema with Drizzle ORM. See [db/schema.ts](./db/schema.ts) for the full definition.

### Tables

| Table          | Purpose                             |
| -------------- | ----------------------------------- |
| `user`         | User accounts with admin/2FA fields |
| `session`      | Active user sessions                |
| `account`      | OAuth provider accounts             |
| `verification` | Email verification tokens           |
| `passkey`      | WebAuthn passkey credentials        |
| `twoFactor`    | TOTP 2FA secrets                    |

### User Table Fields

```typescript
// Core fields
;(id, name, email, emailVerified, image, createdAt, updatedAt)

// Admin plugin fields
;(role, banned, banReason, banExpires)

// TwoFactor plugin fields
twoFactorEnabled
```

## Extensions

### pg_stat_statements

Monitors query performance. Use:

```sql
-- View slow queries
SELECT query, calls, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### hypopg

Create hypothetical indexes without actually creating them:

```sql
-- Test if an index would help
SELECT * FROM hypopg_create_index(
  'CREATE INDEX ON users (email)'
);
```

## MCP Tools Available

With the Postgres MCP, you can use these tools:

| Tool                             | Description           |
| -------------------------------- | --------------------- |
| `postgres_execute_sql`           | Run any SQL query     |
| `postgres_list_schemas`          | List all schemas      |
| `postgres_list_objects`          | List tables/views     |
| `postgres_analyze_db_health`     | Full health check     |
| `postgres_explain_query`         | Explain query plan    |
| `postgres_get_top_queries`       | Slowest queries       |
| `postgres_analyze_query_indexes` | Index recommendations |

## Environment Variables

```bash
POSTGRES_URL=postgresql://user:password@localhost:5432/saas_db
```

## Future Considerations

- [ ] Add connection pooling (PgBouncer)
- [ ] Set up read replicas for scaling
- [ ] Configure automated backups
- [ ] Add Redis for session caching
- [ ] Set up database monitoring (Prometheus/Grafana)

## Migrations

Coming soon - will use Drizzle Kit or Better Auth CLI for schema migrations.
