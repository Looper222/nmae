const { Router } = require('express');
const authController = require('../controllers/authController');
const filesController = require('../controllers/filesController');
const postsController = require('../controllers/postsController');

const router = Router();

// controller authController
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);

// @controller filesController
router.post('/files/upload', filesController.upload.single('file'), filesController.upload_single_file);
router.get('/files', filesController.get_files);
router.get('/files/:filename', filesController.get_single_file);
router.get('/files/img/:filename', filesController.get_single_image);
router.delete('/files/del/:id', filesController.delete_single_file);

// @controller postsController
router.post('/postCreate', postsController.single_post_create);

module.exports = router;