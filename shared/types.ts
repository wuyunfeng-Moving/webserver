export interface Message {
    id: string;
    content: string;
    timestamp: number;
}

export interface Blog {
    id: string;
    title: string;
    content: string;
    timestamp: number;
    category: string;
}

export interface ServerResponse {
    status: 'success' | 'error';
    data?: any;
    error?: string;
}

export interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    createdAt: number;
}

export interface LoginResponse {
    token: string;
    user: Omit<User, 'password'>;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface BlogCreate {
    title: string;
    content: string;
    category: string;
}