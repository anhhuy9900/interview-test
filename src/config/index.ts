import dotenv from 'dotenv';
import path from 'path';

const config = dotenv.config({ path: path.resolve(__dirname, '../../.env') }).parsed;

export const APP_PORT = config?.APP_PORT || null;

export const DB_HOST = config?.DB_HOST || 'localhost';
export const DB_PORT = (config?.DB_PORT || 5432) as number;
export const DB_NAME = config?.DB_NAME;
export const DB_USERNAME = config?.DB_USERNAME;
export const DB_PASS = config?.DB_PASS;

export const SECRET_KEY = config?.SECRET_KEY || '';
export const SECRET_KEY_ACCESS_TOKEN = config?.SECRET_KEY_ACCESS_TOKEN || '';
export const EXPIRE_ACCESS_TOKEN = (config?.EXPIRE_ACCESS_TOKEN as unknown as number) || 0;

export const MAXIMUM_FILE_SIZE_UPLOAD = (config?.MAXIMUM_FILE_SIZE_UPLOAD as unknown as number) || 0;
export const QUOTA_LIMIT_UPLOAD = (config?.QUOTA_LIMIT_UPLOAD as unknown as number) || 0;
