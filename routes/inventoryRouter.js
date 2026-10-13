const { Router } = require('express')
const router = Router();

const categoryController = require('../controllers/categoryController')
const itemController = require('../controllers/itemController');

router.get('/', categoryController.categoryListGet)

router.get('/category/create', categoryController.categoryCreateGet)
router.post('/category/create', categoryController.categoryCreatePost)

router.get('/category/:id', categoryController.categoryDetailGet)

router.get('/category/:id/update', categoryController.categoryUpdateGet)
router.post('/category/:id/update', categoryController.categoryUpdatePost)

router.post('/category/:id/delete', categoryController.categoryDeletePost)

router.get('/item/create', itemController.itemCreateGet)
router.post('/item/create', itemController.itemCreatePost);

router.get('/item/:id', itemController.itemDetailGet)

router.get('/item/:id/update', itemController.itemUpdateGet)
router.post('/item/:id/update', itemController.itemUpdatePost)

router.post('/item/:id/delete', itemController.itemDeletePost)


module.exports = router;