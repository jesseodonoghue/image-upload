require('dotenv/config');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
// const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_ID,
    region: 'us-east-2'
});
const s3 = new AWS.S3();

// const storage = multer.memoryStorage({
//     destination: function(req, file, cb) {
//         cb(null, '');
//     }
// });

// const upload = multer({storage}).single('image');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: "TESTING_META_DATA"});
        },
        key: function (req, file, cb) {
            let myImage = file.originalname.split(".");
            const fileType = myImage[myImage.length - 1];

            cb(null, `${Date.now().toString()}.${fileType}`)
        }
    })
});

const singleUpload = upload.single('image');

app.post('/upload', (req, res) => {
    singleUpload(req, res, function(err) {
        return res.json({'imageUrl': req.file.location});
    });
})

// app.post('/upload', (req, res) => {

//     let myImage = req.file.originalname.split(".");
//     const fileType = myImage[myImage.length - 1];

//     console.log(req.file);

//     const params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `${uuidv4()}.${fileType}`,
//         Body: req.file.buffer
//     };

//     s3.upload(params, (error, data) => {
//         if(error) {
//             res.status(500).send(error);
//         }

//         res.status(200).send(data);
//     });
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});