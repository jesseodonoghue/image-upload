require('dotenv/config');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});

const storage = multer.memoryStorage({
    destination: function(req, file, cb) {
        cb(null, '');
    }
});

const upload = multer({storage}).single('image');

app.post('/upload', upload, (req, res) => {

    let myImage = req.file.originalname.split(".");
    const fileType = myImage[myImage.length - 1];

    console.log(req.file);

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuidv4()}.${fileType}`,
        Body: req.file.buffer
    };

    s3.upload(params, (error, data) => {
        if(error) {
            res.status(500).send(error);
        }

        res.status(200).send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});