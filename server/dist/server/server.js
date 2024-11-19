"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const messages = [];
const blogs = [];
app.get('/messages', (req, res) => {
    console.log(messages);
    const response = {
        status: 'success',
        data: messages
    };
    res.json(response);
});
app.post('/messages', (req, res) => {
    console.log(req.body);
    try {
        const message = {
            id: Date.now().toString(),
            content: req.body.content,
            timestamp: Date.now()
        };
        messages.push(message);
        const response = {
            status: 'success',
            data: message
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            status: 'error',
            error: 'Failed to create message'
        };
        res.status(400).json(response);
    }
});
app.get('/blogs', (req, res) => {
    const response = {
        status: 'success',
        data: blogs
    };
    res.json(response);
});
app.post('/blogs', (req, res) => {
    try {
        const blog = {
            id: Date.now().toString(),
            title: req.body.title,
            content: req.body.content,
            timestamp: Date.now()
        };
        blogs.push(blog);
        const response = {
            status: 'success',
            data: blog
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            status: 'error',
            error: 'Failed to create blog'
        };
        res.status(400).json(response);
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
