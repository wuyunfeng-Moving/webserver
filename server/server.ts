import express from 'express';
import cors from 'cors';
import { Message, ServerResponse, Blog } from '../shared/types';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const messages: Message[] = [];
const blogs: Blog[] = [];

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