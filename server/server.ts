import express from 'express';
import cors from 'cors';
import { Message, ServerResponse, Blog } from '../shared/types';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const messagesFilePath = path.join(__dirname, 'messages.json');
const blogsFilePath = path.join(__dirname, 'blogs.json');

const messages: Message[] = [];
const blogs: Blog[] = [];

// 新增：从磁盘恢复数据
try {
    const savedMessages = fs.readFileSync(messagesFilePath, 'utf-8');
    if (savedMessages) {
        messages.push(...JSON.parse(savedMessages));
    }
} catch (error) {
    console.error('Failed to load messages:', error);
}

try {
    const savedBlogs = fs.readFileSync(blogsFilePath, 'utf-8');
    if (savedBlogs) {
        blogs.push(...JSON.parse(savedBlogs));
    }
} catch (error) {
    console.error('Failed to load blogs:', error);
}

app.get('/messages', (req, res) => {
    console.log(messages);
    const response: ServerResponse = {
        status: 'success',
        data: messages
    };
    res.json(response);
});

app.post('/messages', (req, res) => {
    console.log(req.body);
    try {
        const message: Message = {
            id: Date.now().toString(),
            content: req.body.content,
            timestamp: Date.now()
        };
        messages.push(message);
        fs.writeFileSync(messagesFilePath, JSON.stringify(messages));
        
        const response: ServerResponse = {
            status: 'success',
            data: message
        };
        res.json(response);
    } catch (error) {
        const response: ServerResponse = {
            status: 'error',
            error: 'Failed to create message'
        };
        res.status(400).json(response);
    }
});

app.get('/blogs', (req, res) => {
    const response: ServerResponse = {
        status: 'success',
        data: blogs
    };
    res.json(response);
});

app.post('/blogs', (req, res) => {
    try {
        const blog: Blog = {
            id: Date.now().toString(),
            title: req.body.title,
            content: req.body.content,
            timestamp: Date.now()
        };
        blogs.push(blog);
        fs.writeFileSync(blogsFilePath, JSON.stringify(blogs));
        
        const response: ServerResponse = {
            status: 'success',
            data: blog
        };
        res.json(response);
    } catch (error) {
        const response: ServerResponse = {
            status: 'error',
            error: 'Failed to create blog'
        };
        res.status(400).json(response);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});