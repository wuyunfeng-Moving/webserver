import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'node:fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
// 修改文件路径到 data 目录
const dataDir = join(__dirname, '../data');
const messagesFilePath = join(dataDir, 'messages.json');
const blogsFilePath = join(dataDir, 'blogs.json');
const usersFilePath = join(dataDir, 'users.json');
// 确保 data 目录存在
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
// 文件系统管理类
class FileStorage {
    filePath;
    data = [];
    constructor(filePath) {
        this.filePath = filePath;
        // 确保父目录存在
        const dir = dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        this.ensureFile();
        this.loadData();
    }
    ensureFile() {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '[]', 'utf-8');
        }
    }
    loadData() {
        try {
            const savedData = fs.readFileSync(this.filePath, 'utf-8');
            if (savedData) {
                this.data = JSON.parse(savedData);
            }
        }
        catch (error) {
            console.error(`Failed to load data from ${this.filePath}:`, error);
            this.data = [];
            this.saveData(); // 重置文件
        }
    }
    saveData() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data), 'utf-8');
    }
    getData() {
        return this.data;
    }
    addData(item) {
        this.data.push(item);
        this.saveData();
    }
    updateData(id, newData) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...newData };
            this.saveData();
            return this.data[index];
        }
        return null;
    }
}
// 使用存储类
const messagesStorage = new FileStorage(messagesFilePath);
const blogsStorage = new FileStorage(blogsFilePath);
const usersStorage = new FileStorage(usersFilePath);
// 创建默认超级管理员账户
const initializeSuperUser = () => {
    const superUsername = 'wuyunfeng';
    // 检查超级管理员是否已存在
    if (!usersStorage.getData().find(u => u.username === superUsername)) {
        const superUser = {
            id: Date.now().toString(),
            username: superUsername,
            password: 'wuyunfeng123456',
            email: 'admin@example.com',
            createdAt: Date.now()
        };
        usersStorage.addData(superUser);
        console.log('Default superuser account created');
    }
};
// 初始化超级管理员
initializeSuperUser();
app.get('/messages', (req, res) => {
    const response = {
        status: 'success',
        data: messagesStorage.getData()
    };
    res.json(response);
});
app.post('/messages', (req, res) => {
    try {
        const message = {
            id: Date.now().toString(),
            content: req.body.content,
            timestamp: Date.now()
        };
        messagesStorage.addData(message);
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
        data: blogsStorage.getData()
    };
    res.json(response);
});
app.post('/blogs', (req, res) => {
    try {
        const blog = {
            id: Date.now().toString(),
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            timestamp: Date.now()
        };
        blogsStorage.addData(blog);
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
app.post('/register', (req, res) => {
    try {
        const { username, password, email } = req.body;
        // Validate required fields
        if (!username || !password || !email) {
            const response = {
                status: 'error',
                error: 'Username, password and email are required'
            };
            res.status(400).json(response);
            return;
        }
        //检查用户名是否已存在
        if (usersStorage.getData().find(u => u.username === username)) {
            const response = {
                status: 'error',
                error: 'Username already exists'
            };
            res.status(400).json(response);
            return;
        }
        // 创建新用户
        const user = {
            id: Date.now().toString(),
            username,
            password, // 注意:实际应用中应该对密码进行加密
            email,
            createdAt: Date.now()
        };
        usersStorage.addData(user);
        // 返回用户信息(不包含密码)
        const { password: _, ...userWithoutPassword } = user;
        const response = {
            status: 'success',
            data: userWithoutPassword
        };
        res.json(response);
    }
    catch (error) {
        console.error('Registration error:', error);
        const response = {
            status: 'error',
            error: error instanceof Error ? error.message : 'Failed to register user'
        };
        res.status(500).json(response);
    }
});
app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        // 验证必填字段
        if (!username || !password) {
            const response = {
                status: 'error',
                error: 'Username and password are required'
            };
            res.status(400).json(response);
            return;
        }
        // 查找用户
        const user = usersStorage.getData().find(u => u.username === username);
        // 验证用户存在和密码正确
        if (!user || user.password !== password) {
            const response = {
                status: 'error',
                error: 'Invalid username or password'
            };
            res.status(401).json(response);
            return;
        }
        // 生成简单的 token (实际应用中应该使用 JWT)
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        // 返回用户信息(不包含密码)和 token
        const { password: _, ...userWithoutPassword } = user;
        const response = {
            status: 'success',
            data: {
                user: userWithoutPassword,
                token
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Login error:', error);
        const response = {
            status: 'error',
            error: error instanceof Error ? error.message : 'Failed to login'
        };
        res.status(500).json(response);
    }
});
app.get('/blogs/:id', (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = blogsStorage.getData().find(b => b.id === blogId);
        if (!blog) {
            const response = {
                status: 'error',
                error: 'Blog not found'
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            status: 'success',
            data: blog
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            status: 'error',
            error: 'Failed to fetch blog'
        };
        res.status(500).json(response);
    }
});
app.put('/blogs/:id', (req, res) => {
    try {
        const blogId = req.params.id;
        const updates = {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
        };
        const updatedBlog = blogsStorage.updateData(blogId, updates);
        if (!updatedBlog) {
            const response = {
                status: 'error',
                error: 'Blog not found'
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            status: 'success',
            data: updatedBlog
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            status: 'error',
            error: 'Failed to update blog'
        };
        res.status(400).json(response);
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map