const { Router } = require("express");
const TopicController = require("../controllers/TopicController");
const router = Router();

router.post("/topics", TopicController.postItem);
router.get("/topics", TopicController.getItem);
router.get("/topics/:id", TopicController.getItemById);
router.put("/topics/:id", TopicController.putItem);
router.delete("/topics/:id", TopicController.deleteItem);

module.exports = router;
