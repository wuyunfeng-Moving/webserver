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
}

export interface ServerResponse {
    status: 'success' | 'error';
    data?: any;
    error?: string;
}