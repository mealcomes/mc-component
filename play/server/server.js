// server.ts
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 4000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(cors());

const storage = multer.diskStorage({
    destination: function (_, __, cb) {
        cb(null, uploadDir);
    },
    filename: function (_, file, cb) {
        cb(null, file.originalname); // 保持原文件名
    }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const fields = req.body;

    if (!file) {
        return res.status(400).json({ error: '没有收到文件' });
    }

    console.log('字段:', fields);
    console.log('文件保存路径:', path.join(uploadDir, file.originalname));

    res.json({
        message: '文件上传成功 ✅',
        filename: file.originalname,
        path: `/upload/${file.originalname}`
    });
});

// 启动服务
app.listen(PORT, () => {
    console.log(`服务已启动：http://localhost:${PORT}/upload`);
});
