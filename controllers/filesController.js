const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@nodetuts.je9tx.mongodb.net/nmae?retryWrites=true&w=majority`;

// Creat mongo connection
const conn = mongoose.createConnection(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// Init gfs & gridFSBucket
let gfs;
let gridFSBucket;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);

    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });

    gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
    url: dbURI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
});
const upload = multer({ storage });

// @route POST /upload
// @desc Uploads file to DB

const upload_single_file = (req, res) => {
    try {
        res.json({ fileID: req.file.id, filename: req.file.filename });
    } catch (err) {
        console.log(err);
        res.status(400).json('Attempt failed');
    }
};

const get_files = (req, res) => {
    try {
        gfs.files.find().toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    errorMessage: 'No files found'
                });
            }
            return res.json(files);
        });
    } catch (err) {
        console.log(err);
        res.status(400).json('Attempt failed');
    }
};

const get_single_file = (req, res) => {
    try {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            if (!file || file.length === 0) {
                return res.status(404).json({
                errorMessage: 'No file found'
                });
            }
            return res.json(file);
        });
    } catch (err) {
        console.log(err);
        res.status(400).json('Attempt failed');
    }
};

const get_single_image = (req, res) => {
    try {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            if (!file || file.length === 0) {
                return res.status(404).json({
                    errorMessage: 'No file found'
                });
            }
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                const readstream = gridFSBucket.openDownloadStreamByName(file.filename);
                readstream.pipe(res);
            } else {
                res.status(404).json({
                    errorMessage: 'Not an image'
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).json('Attempt failed');
    }
};

const delete_single_file = (req, res) => {
    try {
        const obj_id = new mongoose.Types.ObjectId(req.params.id);
        gridFSBucket.delete( obj_id, (err, gridFSBucket) => {
            if (err) {
                return res.status(404).json({ err: err });
            }

            res.status(201).json({
                operationStatus: 'File has been deleted'
            });
        });
    } catch (err) {
        console.log(err);
        res.status(400).json('Attempt failed');
    }
};

module.exports = {
    upload,
    upload_single_file,
    get_files,
    get_single_file,
    get_single_image,
    delete_single_file
}