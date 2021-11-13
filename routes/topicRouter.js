const { Router } = require("express");
const TopicController = require("../controllers/TopicController");
const router = Router();

router.post("/", TopicController.postItem);
router.get("/", TopicController.getItem);
router.get("/:id", TopicController.getItemById);
router.put("/:id", TopicController.putItem);
router.delete("/:id", TopicController.deleteItem);

module.exports = router;
