require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const port = process.env.PORT || 3000;
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const processedDir = path.join(uploadDir, 'processed');

// Yükleme dizinlerini oluştur
[uploadDir, processedDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Multer yapılandırması
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100000000 // 100MB varsayılan
    }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Video yükleme endpoint'i
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Video dosyası bulunamadı' });
    }
    res.json({
        message: 'Video başarıyla yüklendi',
        filename: req.file.filename
    });
});

// Video kırpma endpoint'i
app.post('/trim', async (req, res) => {
    const { filename, startTime, duration } = req.body;

    if (!filename || startTime === undefined || duration === undefined) {
        return res.status(400).json({ error: 'Geçersiz parametreler' });
    }

    const inputPath = path.join(uploadDir, filename);
    const outputFilename = `trimmed-${Date.now()}.mp4`;
    const outputPath = path.join(processedDir, outputFilename);

    if (!fs.existsSync(inputPath)) {
        return res.status(404).json({ error: 'Video dosyası bulunamadı' });
    }

    try {
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .setStartTime(startTime)
                .setDuration(duration)
                .outputOptions('-movflags', 'faststart')  // Bu satır, MP4'ün başında gerekli meta veriyi yerleştirir.
                .output(outputPath)
                .on('end', () => {
                    resolve();
                })
                .on('error', (err) => {
                    reject(err);
                })
                .run();
        });

        res.json({
            message: 'Video başarıyla kırpıldı',
            filename: outputFilename,
            url: `/uploads/processed/${outputFilename}`
        });
    } catch (error) {
        console.error('Video kırpma hatası:', error);
        res.status(500).json({ error: 'Video kırpma işlemi başarısız oldu' });
    }
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 