import { Pool } from 'pg';

export class PostgresDB {
    private static pool: Pool;

    static getPool(): Pool {
        if (!this.pool)
        {
            console.log('Connecting to PostgreSQL...');
            this.pool = new Pool({
                user: 'postgres', // Replace with your DB username
                host: '127.0.0.1',    // Use IPv4 localhost
                database: 'postgres', // Replace with your DB name
                password: 'postgres', // Replace with your DB password
                port: 5432,           // Ensure this matches your PostgreSQL port
            });
        }
        return this.pool;
    }
}
