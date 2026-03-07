import { BetterAuth } from '@better-auth/server';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { migrate } from 'drizzle-orm/migrate';
import { drizzle } from 'drizzle-orm/node-postgres';
import postgres from 'pg';

// Ensure environment variables are loaded
if (!process.env.POSTGRES_URL) {
    throw new Error('Missing environment variable: POSTGRES_URL');
}
if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error('Missing environment variable: BETTER_AUTH_SECRET');
}

// Configure PostgreSQL database connection
const pool = new postgres.Pool({ connectionString: process.env.POSTGRES_URL });
const db = drizzle(pool);

// Initialize Better Auth
const auth = BetterAuth({
    adapter: drizzleAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
        verifyRequest: '/auth/verify',
    },
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
});

// Ensure migrations are applied (useful for development environments)
(async () => {
    console.log('Running migrations...');
    try {
        await migrate(db, { path: './migrations' });
        console.log('Migrations complete.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
})();

export default auth;