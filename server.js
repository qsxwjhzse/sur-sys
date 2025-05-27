const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 将现有的静态文件移动到 public 目录
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB 连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/survey-system')
    .then(() => console.log('MongoDB 连接成功'))
    .catch(err => console.error('MongoDB 连接失败:', err));

// 定义数据模型
const Survey = mongoose.model('Survey', {
    name: String,
    age: Number,
    hobbies: String,
    zodiac: String,
    createdAt: { type: Date, default: Date.now }
});

// API 路由
app.post('/api/surveys', async (req, res) => {
    try {
        const survey = new Survey(req.body);
        await survey.save();
        res.status(201).json(survey);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/surveys', async (req, res) => {
    try {
        const surveys = await Survey.find().sort({ createdAt: -1 });
        res.json(surveys);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/surveys/:id', async (req, res) => {
    try {
        await Survey.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: '删除成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 