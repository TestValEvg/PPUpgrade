import dotenv from 'dotenv';

dotenv.config();

export const credentials = {
    username: process.env.TEST_EMAIL || '',
    password: process.env.TEST_PASSWORD || ''
};

if (!credentials.username || !credentials.password) {
    throw new Error('TEST_EMAIL and TEST_PASSWORD environment variables are required. Create a .env file in the project root.');
}