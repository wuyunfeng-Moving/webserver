"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const messagesFilePath = path_1.default.join(__dirname, 'messages.json');
const blogsFilePath = path_1.default.join(__dirname, 'blogs.json');
const messages = [];
const blogs = [];
// 新增：从磁盘恢复数据
try {
    const savedMessages = fs_1.default.readFileSync(messagesFilePath, 'utf-8');
    if (savedMessages) {
        messages.push(...JSON.parse(savedMessages));
    }
}
catch (error) {
    console.error('Failed to load messages:', error);
}
try {
    const savedBlogs = fs_1.default.readFileSync(blogsFilePath, 'utf-8');
    if (savedBlogs) {
        blogs.push(...JSON.parse(savedBlogs));
    }
}
catch (error) {
    console.error('Failed to load blogs:', error);
}
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
        fs_1.default.writeFileSync(messagesFilePath, JSON.stringify(messages));
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
        fs_1.default.writeFileSync(blogsFilePath, JSON.stringify(blogs));
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
