const router = require('express').Router();
const TopicController = require('../controllers/TopicController');

router.get('/', TopicController.getItem);
router.get('/:id', TopicController.getItemById);
router.post('/', TopicController.postItem);
router.put('/:id', TopicController.putItem);
router.delete('/:id', TopicController.deleteItem);

module.exports = router
