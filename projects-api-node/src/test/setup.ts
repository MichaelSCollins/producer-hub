import { DataSource } from 'typeorm';
import { AppDataSource } from '../index.js';

// Create a test database connection
export const TestDataSource = new DataSource({
    type: 'postgres',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    username: process.env.TEST_DB_USERNAME || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
    database: process.env.TEST_DB_NAME || 'project',
    synchronize: true,
    logging: false,
    entities: ['src/models/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts']
});

// Initialize test database before all tests
export const setup = async () => {
    try
    {
        await TestDataSource.initialize();
        console.log('Test database connection established');
    } catch (error)
    {
        console.error('Error initializing test database:', error);
        throw error;
    }
};

// Close test database connection after all tests
export const teardown = async () => {
    try
    {
        await TestDataSource.destroy();
        console.log('Test database connection closed');
    } catch (error)
    {
        console.error('Error closing test database connection:', error);
        throw error;
    }
}; 